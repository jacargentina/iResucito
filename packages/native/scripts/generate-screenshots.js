const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// Run `yarn ios` once to create a local simulator build; this is intentionally not part of publish. Each locale is rebuilt from cleared app state, so curated community data would need the app's dev/import seeding mechanisms.

const nativeRoot = path.join(__dirname, '..');
const flowPath = path.join(nativeRoot, 'maestro', 'app-store-screenshots.yaml');
const configPath = path.join(nativeRoot, 'store.config.json');
const screenshotRoot = path.join(nativeRoot, 'store', 'apple', 'screenshot');
const appId = 'com.javiercastro.iresucito';
const screenNames = [
  'BuscarCantos',
  'Canto-Pantalla',
  'Canto-PDF',
  'Listas',
  'Lista-Pantalla',
  'Lista-PDF',
  'Comunidad',
  'Configuracion',
  'Configuracion-Idiomas',
];
const locales = [
  { store: 'de-DE', app: 'de', label: 'Deutsch' },
  { store: 'es-ES', app: 'es', label: 'Español' },
  { store: 'pt-BR', app: 'pt-BR', label: 'Português (Brazil)' },
  { store: 'pt-PT', app: 'pt-PT', label: 'Português (Portugal)' },
  { store: 'it', app: 'it', label: 'Italiano' },
  { store: 'en-US', app: 'en', label: 'English' },
  { store: 'fr-FR', app: 'fr', label: 'Français' },
  { store: 'pl', app: 'pl', label: 'Polski' },
  { store: 'ru', app: 'ru', label: 'Русский' },
  { store: 'hr', app: 'hr', label: 'Hrvatski' },
];
const devices = [
  {
    name: 'iPhone 17 Pro Max',
    deviceClass: 'APP_IPHONE_69',
    width: 1320,
    height: 2868,
  },
  {
    name: 'iPad Pro 13-inch (M4)',
    deviceClass: 'APP_IPAD_PRO_3GEN_13',
    width: 2064,
    height: 2752,
  },
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || nativeRoot,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
  });
  if (result.error || result.status !== 0) {
    const detail = result.error ? result.error.message : (result.stderr || '').trim();
    throw new Error(`${command} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return (result.stdout || '').trim();
}

function parseJson(value, source) {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Could not parse ${source}: ${error.message}`);
  }
}

function findDevice(deviceName) {
  const output = run('xcrun', ['simctl', 'list', 'devices', 'available', '--json'], {
    capture: true,
  });
  const runtimes = parseJson(output, 'simctl device list').devices;
  const candidates = Object.values(runtimes)
    .flat()
    .filter((device) => device.name === deviceName && device.isAvailable !== false);
  const booted = candidates.find((device) => device.state === 'Booted');
  const device = booted || candidates[0];
  if (!device) {
    throw new Error(`No available simulator named "${deviceName}". Install its iOS Simulator runtime in Xcode.`);
  }
  return device;
}

function ensureBooted(device) {
  if (device.state !== 'Booted') {
    run('xcrun', ['simctl', 'boot', device.udid]);
  }
  run('xcrun', ['simctl', 'bootstatus', device.udid, '-b']);
}

function findLocalApp() {
  const candidates = [
    path.join(nativeRoot, 'ios', 'build', 'Build', 'Products', 'Release-iphonesimulator', 'iResucit.app'),
    path.join(nativeRoot, 'ios', 'build', 'Build', 'Products', 'Debug-iphonesimulator', 'iResucit.app'),
  ];
  const derivedDataRoot = path.join(os.homedir(), 'Library', 'Developer', 'Xcode', 'DerivedData');
  if (fs.existsSync(derivedDataRoot)) {
    for (const entry of fs.readdirSync(derivedDataRoot)) {
      if (!entry.startsWith('iResucit-')) continue;
      candidates.push(
        path.join(derivedDataRoot, entry, 'Build', 'Products', 'Release-iphonesimulator', 'iResucit.app'),
        path.join(derivedDataRoot, entry, 'Build', 'Products', 'Debug-iphonesimulator', 'iResucit.app')
      );
    }
  }
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function ensureInstalled(udid) {
  const appPath = findLocalApp();
  if (!appPath) {
    throw new Error('No local simulator .app was found. Run `yarn ios --configuration Release --no-bundler` once, then rerun this command.');
  }
  spawnSync('xcrun', ['simctl', 'terminate', udid, appId], {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  run('xcrun', ['simctl', 'install', udid, appPath]);
}

function findCapturedDirectory(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'takeScreenshot') {
      return path.join(root, entry.name);
    }
    const nested = findCapturedDirectory(path.join(root, entry.name));
    if (nested) return nested;
  }
  return undefined;
}

function collectScreenshots(maestroOutput, outputDirectory) {
  const captured = findCapturedDirectory(maestroOutput);
  if (!captured) {
    throw new Error(`Maestro did not write any screenshots under ${maestroOutput}`);
  }
  for (const screenName of screenNames) {
    const source = path.join(captured, `${screenName}.png`);
    if (!fs.existsSync(source)) {
      throw new Error(`Maestro did not capture ${screenName}`);
    }
    fs.copyFileSync(source, path.join(outputDirectory, `${screenName}.png`));
  }
}

function verifyScreenshots(outputDirectory, device) {
  for (const screenName of screenNames) {
    const screenshotPath = path.join(outputDirectory, `${screenName}.png`);
    if (!fs.existsSync(screenshotPath)) {
      throw new Error(`Maestro did not create ${screenshotPath}`);
    }
    const dimensions = run(
      'sips',
      ['-g', 'pixelWidth', '-g', 'pixelHeight', screenshotPath],
      { capture: true }
    );
    const width = Number(dimensions.match(/pixelWidth: (\d+)/)?.[1]);
    const height = Number(dimensions.match(/pixelHeight: (\d+)/)?.[1]);
    if (width !== device.width || height !== device.height) {
      throw new Error(`${screenshotPath} is ${width}x${height}; expected ${device.width}x${device.height}`);
    }
  }
}

function translatedSongTitles(appLocale) {
  const songsDirectory = path.join(nativeRoot, '..', 'core', 'assets', 'songs');
  const localeFile = path.join(songsDirectory, `${appLocale}.json`);
  // Locales without their own songs file fall back to the Spanish catalog, like the app does.
  const sourceFile = fs.existsSync(localeFile) ? localeFile : path.join(songsDirectory, 'es.json');
  const entries = parseJson(fs.readFileSync(sourceFile, 'utf8'), sourceFile);
  const titles = Object.values(entries)
    .map((entry) => entry.name.split(' - ')[0].trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  if (titles.length < 3) {
    throw new Error(`${sourceFile} does not have enough songs to build the flow`);
  }
  return titles.slice(0, 3);
}

function screenshotPaths(storeLocale, deviceClass) {
  return screenNames.map(
    (screenName) => `store/apple/screenshot/${storeLocale}/${deviceClass}/${screenName}.png`
  );
}

function rewriteStoreConfig() {
  const config = parseJson(fs.readFileSync(configPath, 'utf8'), configPath);
  for (const locale of locales) {
    const info = config.apple.info[locale.store];
    if (!info) {
      throw new Error(`store.config.json has no apple.info.${locale.store} entry`);
    }
    info.screenshots = Object.fromEntries(
      devices.map((device) => [
        device.deviceClass,
        screenshotPaths(locale.store, device.deviceClass),
      ])
    );
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

function main() {
  const maestro = spawnSync('which', ['maestro'], { encoding: 'utf8' });
  if (maestro.status !== 0) {
    console.error('Maestro is required. Install it with: curl -Ls "https://get.maestro.mobile.dev" | bash');
    process.exit(1);
  }

  for (const locale of locales) {
    const localeDirectory = path.join(screenshotRoot, locale.store);
    fs.rmSync(localeDirectory, { recursive: true, force: true });
    for (const deviceConfig of devices) {
      const device = findDevice(deviceConfig.name);
      ensureBooted(device);
      ensureInstalled(device.udid);
      const outputDirectory = path.join(localeDirectory, deviceConfig.deviceClass);
      fs.mkdirSync(outputDirectory, { recursive: true });
      const [songOne, songTwo, songThree] = translatedSongTitles(locale.app);
      const maestroOutput = fs.mkdtempSync(path.join(os.tmpdir(), 'iresucito-screenshots-'));
      run(
        maestro.stdout.trim(),
        [
          '--device',
          device.udid,
          'test',
          flowPath,
          '--test-output-dir',
          maestroOutput,
          '--env',
          `LOCALE=${locale.app}`,
          '--env',
          `LOCALE_LABEL=${locale.label}`,
          '--env',
          `SONG_ONE=${songOne}`,
          '--env',
          `SONG_TWO=${songTwo}`,
          '--env',
          `SONG_THREE=${songThree}`,
        ]
      );
      collectScreenshots(maestroOutput, outputDirectory);
      fs.rmSync(maestroOutput, { recursive: true, force: true });
      verifyScreenshots(outputDirectory, deviceConfig);
    }
  }

  rewriteStoreConfig();
  console.log(`Generated ${locales.length * devices.length * screenNames.length} App Store screenshots.`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
