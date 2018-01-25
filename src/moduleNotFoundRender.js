/**
 * ModuleNotFound render
 *
 * @flow
 */

import assert from 'assert'
import { codeFrameColumns } from '@babel/code-frame'
import formatLocation from "webpack/lib/formatLocation"
import type { ModuleNotFoundError } from 'webpack/lib/ModuleNotFoundError'

export default function moduleNotFoundRender(error: ModuleNotFoundError, shorter: Function, colors?: boolean = true): string {
  const file = error.origin.readableIdentifier(shorter)
  const deps = error.dependencies
  assert(deps.length === 1)
  const location = deps[0].loc
  const source = error.origin._source._value
  const message = error.message
  const name = error.name
  const fmt = formatLocation(location).split(':')
  const regexp = /Module not found: Error: Can't resolve '([^']+)' in '([^']+)'/
  const moduleName = message.match(regexp)[1]
  const codeFrame = codeFrameColumns(source, location, {
    highlightCode: colors
  })
  const isMissModule = error.missing.find(s => /node_modules/.test(s))
  const reasons = isMissModule ? [
    `Forget to install "${moduleName}"? Try to run "yarn add ${moduleName}"`,
    `Forget to configure "resolve.alias"? Add it to your webpack options:

// webpack.config.js
{
  resolve: {
    alias: {
      '${moduleName}': {path/to/${moduleName}}
    }
  }
}
`
  ] : []

  return `\
${message}

${codeFrame}

@ ${file}:${fmt[0]},${fmt[1].split('-')[1]}

Reasons:

${reasons.map((item, index) => String(index + 1) + '. ' + item).join('\n')}
`
}
