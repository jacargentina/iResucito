const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execFileSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const configPath = path.join(rootDir, 'store.config.json');
const notesPath = path.join(rootDir, 'release-notes.json');

const MAX_LENGTH = 4000;

function git(args) {
  return execFileSync('git', args, { cwd: rootDir, encoding: 'utf8' }).trim();
}

function askPi(prompt) {
  const args = ['-p', '-nt', '--mode', 'text'];
  if (process.env.PI_PROVIDER) {
    args.push('--provider', process.env.PI_PROVIDER);
  }
  if (process.env.PI_MODEL) {
    args.push('--model', process.env.PI_MODEL);
  }
  args.push('--', prompt);
  return execFileSync('pi', args, {
    cwd: rootDir,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(/^(s|si|y|yes)$/i.test(answer.trim()));
    });
  });
}

function stripFences(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return fenced ? fenced[1].trim() : text.trim();
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`No se pudo parsear ${filePath}: ${err.message}`);
    process.exit(1);
  }
}

function getRange() {
  const flag = process.argv.indexOf('--range');
  if (flag !== -1 && process.argv[flag + 1]) {
    return process.argv[flag + 1];
  }
  try {
    return `${git(['describe', '--tags', '--abbrev=0'])}..HEAD`;
  } catch {
    console.warn('No se encontro un tag previo, se usan los ultimos 50 commits.');
    return '-50';
  }
}

function getCommits() {
  const range = getRange();
  console.log(`Rango de commits: ${range}`);
  const args = ['log', '--no-merges', '--pretty=format:%s%n%b%n---', range];
  return git(args)
    .split('\n---')
    .map((entry) => entry.trim())
    .filter((entry) => entry && !/^chore\(release\)/.test(entry))
    .join('\n---\n');
}

async function main() {
  const config = readJson(configPath);
  const locales = Object.keys(config.apple.info);

  const commits = getCommits();
  if (!commits) {
    console.error('No hay commits nuevos desde el ultimo tag.');
    process.exit(1);
  }

  console.log('Generando changelog con Pi...\n');
  const draft = askPi(
    [
      'Sos un redactor de release notes para las tiendas de apps (App Store y Google Play).',
      'A partir de estos commits, escribi las novedades visibles para el usuario final de la app iResucito.',
      '',
      'Reglas estrictas:',
      '- Responde SOLO con el texto de las notas, sin preambulo ni explicaciones.',
      '- Espaniol neutro, texto plano, sin markdown, sin negritas, sin titulos.',
      '- Una linea por cambio, empezando con "- ".',
      '- Maximo 5 lineas. Cada linea, una frase corta.',
      '- Describi el impacto observable para el usuario, no el detalle tecnico.',
      '- Ignora refactors internos, cambios de build, dependencias y CI.',
      '- No inventes cambios que no esten en los commits.',
      '',
      'Commits:',
      commits,
    ].join('\n')
  );

  console.log('--- Changelog propuesto (es) ---\n');
  console.log(draft);
  console.log('\n--------------------------------\n');

  if (!(await confirm('Aprobar y traducir a los demas idiomas? (s/n) '))) {
    console.log('Cancelado. No se escribio release-notes.json.');
    process.exit(1);
  }

  console.log('\nTraduciendo...\n');
  const raw = askPi(
    [
      'Traduci estas release notes de una app a los locales indicados.',
      'Responde SOLO con un objeto JSON valido, sin markdown ni explicaciones.',
      `Las claves deben ser exactamente: ${locales.join(', ')}.`,
      'Cada valor es el texto traducido, texto plano, conservando el formato de lineas del original.',
      'Usa el idioma real de cada locale (pt-BR y pt-PT con sus variantes propias).',
      '',
      'Texto original:',
      draft,
    ].join('\n')
  );

  let notes;
  try {
    notes = JSON.parse(stripFences(raw));
  } catch (err) {
    console.error(`Pi no devolvio un JSON valido: ${err.message}`);
    console.error(raw);
    process.exit(1);
  }

  const missing = locales.filter(
    (locale) => typeof notes[locale] !== 'string' || !notes[locale].trim()
  );
  if (missing.length > 0) {
    console.error(`Faltan traducciones para: ${missing.join(', ')}`);
    process.exit(1);
  }

  const tooLong = locales.filter((locale) => notes[locale].length > MAX_LENGTH);
  if (tooLong.length > 0) {
    console.error(`Superan ${MAX_LENGTH} caracteres: ${tooLong.join(', ')}`);
    process.exit(1);
  }

  const output = {};
  for (const locale of locales) {
    output[locale] = notes[locale].trim();
  }

  fs.writeFileSync(notesPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`Escrito ${notesPath} con ${locales.length} locales.`);
  console.log('Revisalo y luego corre: yarn publish');
}

main();
