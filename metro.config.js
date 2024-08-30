const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
  config.resolver.assetExts.push('css');
  config.resolver.unstable_enablePackageExports = true;
  config.resolver.sourceExts.unshift("mjs");
  config.resolver.resolverMainFields = ['react-native-web', 'react-native-web-maps','main'];
  config.resolver.sourceExts = ['ts', 'tsx', 'js', 'jsx', 'json', 'web.js', 'web.tsx', 'cjs'];
  config.resolver.unstable_conditionNames = [
    'browser',
    'require',
    'react-native',
  ]

  return config;
})();