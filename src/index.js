/**
 * mini webpack stats reporter plugin
 *
 * @flow
 */

export type Options = {
  warnings: boolean,
  colors: boolean,
  reasons: boolean,
  checkSilent: boolean
}

export { default as default } from './plugin'
