/**
 * highlight code frame, from @babel/code-frame
 *
 * @flow
 */

import jsTokens, { matchToToken } from "js-tokens"
import esutils from "esutils"
import chalk from "chalk"

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/
const BRACKET = /^[()[\\]{}]$/
const JSX_TAG = /^[a-z][\w-]*$/i

function getTokenType(match) {
  const [offset, text] = match.slice(-2)
  const token = matchToToken(match)
  if (token.type === "name") {
    if (esutils.keyword.isReservedWordES6(token.value)) {
      return "keyword"
    }
    if (
      JSX_TAG.test(token.value) &&
        // $FlowFixMe
      (text[offset - 1] === "<" || text.substr(offset - 2, 2) == "</")
    ) {
      return "jsx_tag"
    }
    if (token.value[0] !== token.value[0].toLowerCase()) {
      return "capitalized"
    }
  }
  if (token.type === "punctuator" && BRACKET.test(token.value)) {
    return "bracket"
  }
  if (
    token.type === "invalid" &&
    (token.value === "@" || token.value === "#")
  ) {
    return "punctuator"
  }
  return token.type
}

export default function highlightCodeFrame(code: string): string {
  const defs = {
    keyword: chalk.cyan,
    capitalized: chalk.yellow,
    jsx_tag: chalk.yellow,
    punctuator: chalk.yellow,
    // bracket:  intentionally omitted.
    number: chalk.magenta,
    string: chalk.green,
    regex: chalk.magenta,
    comment: chalk.grey,
    invalid: chalk.white.bgRed.bold,
    gutter: chalk.grey,
    marker: chalk.red.bold,
    message: chalk.red.bold,
  }
  return code.replace(jsTokens, function(...args) {
    const type = getTokenType(args)
    // $FlowFixMe
    const colorize = defs[type]
    if (colorize) {
      return args[0]
        .split(NEWLINE)
        .map(str => colorize(str))
        .join("\n")
    } else {
      return args[0]
    }
  })
}
