/**
 * mini webpack stats reporter plugin
 *
 * @flow
 */

export type Options = {
  warnings: boolean,
  colors: boolean,
  reasons: boolean,
  checkSilent: boolean,
  lang: 'zh'
}

export { default as default } from './plugin'
