const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getSentryExpoConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Resolver settings
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['require'];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Restrict resolution to defined node_modules
config.resolver.disableHierarchicalLookup = true;

// 4. Source and asset extensions
config.resolver.assetExts.push('json');
config.resolver.sourceExts.push('mjs');
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (e) => e !== 'json'
);

// 5. Unified block list
config.resolver.blockList = exclusionList([
  /\.expo[\\/]types/,
  /\/__tests__\/.*/,
  /\/\.vercel\/.*/,
]);

module.exports = config;
