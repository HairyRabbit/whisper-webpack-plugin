import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default {
  input: path.resolve('src/index.js'),
  output: {
    file: path.resolve('lib/index.js'),
    format: 'cjs',
    exports: 'named'
  },
  plugins: [].concat(
    resolve({
      preferBuiltins: true
    }),
    babel({ exclude: 'node_modules/**' }),
    json({ exclude: 'node_modules/**' }),
    commonjs()
  ),
  external: [].concat(
    'path',
    'assert',
    'util',
    'webpack/lib/RequestShortener',
    'webpack/lib/formatLocation',
    Object.keys(Object.assign({}, pkg.dependencies, pkg.peerDependencies))
  )
}
