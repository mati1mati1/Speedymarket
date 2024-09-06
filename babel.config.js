const path = require('path');

module.exports = api => {
  const platform = api.caller(caller => caller && caller.platform);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./src/components",
            "@services": "./src/services",
            "@api": "./src/api",
            ...(platform === 'web' ? {
              "react-native": "react-native-web",
              "react-native-maps": "@teovilla/react-native-web-maps"
            } : 
              {"@stripe/stripe-js": "@stripe/stripe-react-native"})
          },
          "extensions": [".web.js", ".web.ts", ".web.tsx", ".js", ".ts", ".tsx",".css"]
        },
      ],
    ],
  };
};
