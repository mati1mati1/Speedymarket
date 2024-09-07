const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // Ensure we handle .mjs and other common extensions
  config.resolver.sourceExts = ['native.tsx', 'mjs', 'ts', 'tsx', 'js', 'jsx', 'json', 'web.js', 'web.tsx', 'cjs'];
  
  // Removing svg from assetExts to avoid conflicts
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');

  // Adding support for css files
  config.resolver.assetExts.push('css');

  // Enabling package exports (unstable feature)
  config.resolver.unstable_enablePackageExports = true;

  // Custom resolveRequest function
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === "web") {
      if (moduleName.endsWith("/Libraries/Components/TextInput/TextInputState")) {
        return {
          filePath: require.resolve("identity-obj-proxy"), 
          type: "sourceFile"
        };
      }
      if (moduleName.endsWith("RCTExport")) {
        return {
          filePath: require.resolve("identity-obj-proxy"),
          type: "sourceFile"
        };
      }
    }
    
    // Fall back to default Metro behavior
    return context.resolveRequest(context, moduleName, platform);
  };

  // Main fields resolution order
  config.resolver.resolverMainFields = ['react-native-web', 'browser', 'main'];

  // Add conditions for resolving modules in different environments
  config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

  return config;
})();
