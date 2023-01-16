const path = require('path');

const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use:['ts-loader']
      }
    ]
  },

  plugins: [
    new webpack.CleanPlugin()
  ]
}