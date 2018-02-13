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
  division: boolean
}

export { default as default } from './plugin'
