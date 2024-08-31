module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@components": "./src/components",
          "@services": "./src/services",
          "@api": "./src/api"
        },
      },
    ],
  ],
};