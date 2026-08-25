const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'store.config.json');
const notesPath = path.join(__dirname, '..', 'release-notes.json');
const appPath = path.join(__dirname, '..', 'app.json');

const checkOnly = process.argv.includes('--check');

if (!fs.existsSync(notesPath)) {
  console.error(
    `No se encontro ${notesPath}. Corre "yarn release-notes" antes de publicar.`
  );
  process.exit(1);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`No se pudo parsear ${filePath}: ${err.message}`);
    process.exit(1);
  }
}

const config = readJson(configPath);
const notes = readJson(notesPath);
const appVersion = readJson(appPath).expo.version;

const locales = Object.keys(config.apple.info);
const missing = locales.filter((locale) => !notes[locale]);
if (missing.length > 0) {
  console.error(`Faltan release notes para: ${missing.join(', ')}`);
  process.exit(1);
}

if (checkOnly) {
  console.log(`Release notes validadas para ${locales.length} locales.`);
  process.exit(0);
}

config.apple.version = appVersion;

for (const locale of locales) {
  config.apple.info[locale].releaseNotes = notes[locale];
}

fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
console.log(
  `Release notes aplicadas en ${locales.length} locales para la version ${appVersion}.`
);
