const path = require('path')
const WhisperWebpackPlugin = require('../../lib').default

module.exports = [{
  entry: path.resolve('index.js'),
  output: {
    filename: 'main.js',
    path: __dirname
  },
  stats: 'none',
  plugins: [
    new WhisperWebpackPlugin()
  ]
},{
  entry: path.resolve('index2.js'),
  output: {
    filename: 'main2.js',
    path: __dirname
  },
  stats: 'none',
  target: 'web',
  plugins: [
    new WhisperWebpackPlugin()
  ]
}]
