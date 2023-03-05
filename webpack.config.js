const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs'
    }
  },
  devtool: false,
  externals: {
    'html-webpack-plugin': 'commonjs html-webpack-plugin',
    'path': 'path-browserify'
  },
  resolve: {
    extensions: ['.js', '.ts'],
    fallback: { 
      "path": require.resolve("path-browserify") 
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      }
    ]
  },
  plugins: [
    new webpack.CleanPlugin()
  ]
}