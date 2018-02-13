/**
 * find css source location
 *
 * @flow
 */

import { parse } from 'postcss'

type Position = {
  line: number,
  column: number
}

type Location = {
  start: Position,
  end: Position
}

export default function resolveCssLocation(source: string, moduleName: string): Location {
  const root = parse(source)
  let out
  root.walkDecls(decl => {
    const { prop, value, source: src } = decl
    if('composes' !== prop) {
      return
    }

    if(!~value.indexOf(moduleName)) {
      throw new Error(`moduleName not matched, ${moduleName} <=> ${value}`)
    }

    out = {
      start: src.start,
      end: src.end
    }
  })

  if(!out) {
    throw new Error(`moduleName not found composes decl, ${moduleName}`)
  }

  return out
}
