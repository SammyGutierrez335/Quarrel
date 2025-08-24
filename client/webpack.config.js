// webpack.config.js
const path = require('path');

module.exports = {
  // Sets the mode to 'development', 'production', or 'none'.
  // Affects how webpack bundles the code (e.g., minification in production).
  mode: 'development',
    resolve: {
        extensionAlias: {
            ".js": [".js", ".ts"], // if mixing TS/JS
        },
        fallback: { "path": require.resolve("path-browserify") }
    },
  // The main entry point of your application.
  entry: './src/index.js',

  // Defines where webpack should output the bundled files.
  output: {
    // The output directory must be an absolute path.
    path: path.resolve(__dirname, 'dist'),
    // The filename for the bundled JavaScript.
    filename: 'bundle.js',
  },
};