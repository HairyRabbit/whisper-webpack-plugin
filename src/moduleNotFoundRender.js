/**
 * ModuleNotFound render
 *
 * 1. normal module not found
 * 2. mulit module for array entry
 * 3. css module composes
 *
 * @flow
 */

import assert from 'assert'
import { format } from 'util'
import chalk from 'chalk'
import { codeFrameColumns } from '@babel/code-frame'
import formatLocation from "webpack/lib/formatLocation"
import type { ModuleNotFoundError } from 'webpack/lib/ModuleNotFoundError'
import highlight from './highlighter'
import resolveCssLocation from './cssSourceLocationResolver'
import formtCssModuleFileName from './cssModuleFileName'
import { zh as lang } from './langs'

const buildins: Array<string> = [
  'child_process',
  'cluster',
  'dgram',
  'fs',
  'module',
  'readline',
  'repl',
  'tls',
  'url'
]

export default function moduleNotFoundRender(error: ModuleNotFoundError, shorter: Function, colors?: boolean = true): string {
  const file = error.origin.readableIdentifier(shorter)
  const deps = error.dependencies
  let isCssModule, isCssSourceMapEnabled
  /**
   * css modules composes not found error
   */
  if(deps.every(dep => /css-loader\/index\.js\?/.test(dep.request))) {
    isCssModule = true
  } else {
    assert(deps.length === 1)
  }
  const location = deps[0].loc
  let source
  if(error.origin._source) {
    source = error.origin._source._value
    if(isCssModule) {
      const matched = source.match(/"sourcesContent":\["([^"]+)"\]/)
      if(matched) {
        source = matched[1].replace(/\\n/g, '\n')
        isCssSourceMapEnabled = true
      }
    }
  } else {
    /**
     * multi module
     */
    source = error.origin.dependencies.find(dep => dep === deps[0])._source || ''
  }

  const message = error.message
  const name = error.name
  const fmt = formatLocation(location).split(':')
  const regexp = /Module not found: Error: Can't resolve '([^']+)' in '([^']+)'/
  const moduleName = message.match(regexp)[1]
  const sourceLocation = source && isCssModule && isCssSourceMapEnabled
        ? resolveCssLocation(source, moduleName)
        : location
  const codeFrameOptions = {
    highlightCode: colors
  }
  const codeFrame = source ? codeFrameColumns(source, sourceLocation, codeFrameOptions) : ''
  const isMissModule = error.missing.find(s => /node_modules/.test(s))
  const isBuildinModule = ~buildins.indexOf(moduleName)

  let reasons = []
  /**
   * test module was a nodejs buildin lib
   */
  if(isMissModule) {
    if(isBuildinModule) {
      const frame = `\
// webpack.config.js
{
  target: 'node'
}`
      reasons = [
        format(lang.moduleNotFound.nodejsBuildIn, moduleName, highlight(frame))
      ]
    } else {
      const _moduleName = moduleName.split('/')
      const moduleNameMain = moduleName.startsWith('@') ? _moduleName.slice(0, 2).join('/') : _moduleName[0]
      if(/\//.test(moduleName) && 2 !== _moduleName.length) {
        const frame = `\
// webpack.config.js
{
  resolve: {
    alias: {
      '${moduleNameMain}': path.resolve('${moduleNameMain}')
    }
  }
}`
        reasons = [
          format(lang.moduleNotFound.forgetToInstall, moduleNameMain, moduleNameMain),
          format(lang.moduleNotFound.configureAlias, frame)
        ]
      } else {
        reasons = [
          format(lang.moduleNotFound.forgetToInstall, moduleName, moduleName)
        ]
      }
    }
  }

  /**
   * output string
   */
  const filePath = `@ ${!isCssModule ? file : formtCssModuleFileName(file)}:${fmt[0]},${fmt[1].split('-')[1]}`
  let output = [message, codeFrame, filePath].join('\n\n')
  const reasonsLen = reasons.length
  if(reasonsLen) {
    output += `\n\n${chalk.bold('Reasons')}:\n\n`
    if(1 === reasonsLen) {
      output += reasons[0]
    } else {
      output += reasons.map(
        (item, index) => String(index + 1) + '. ' + item
      ).join('\n')
    }
  }

  return output
}
