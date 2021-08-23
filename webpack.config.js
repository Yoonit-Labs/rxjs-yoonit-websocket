const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      library: "YoonitWs",
      libraryTarget: "umd",
      globalObject: "this"
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
      ],
    },
    resolve: {
      extensions: ['.js']
    },
    plugins: [
      new Dotenv({
        path: './.env.'+argv.mode,
        allowEmptyValues: true,
        systemvars: true
      })
    ],
    devtool: 'inline-source-map'
  }
};
