const path = require('path')
const WhisperWebpackPlugin = require('../../lib').default

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: '[name].js',
    path: __dirname
  },
  plugins: [
    new WhisperWebpackPlugin()
  ]
}
