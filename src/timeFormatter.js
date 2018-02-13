/**
 * time string
 *
 * @flow
 */

export default function format(raw: string | number): string {
  let input = parseInt(raw)
  let h, min, s, ms

  if(input >= 3600000) {
    h = parseInt(input / 3600000)
    input = input - h * 3600000
  }

  if(input >= 60000) {
    min = parseInt(input / 60000)
    input = input - min * 60000
  }

  if(input >= 1000) {
    s = parseInt(input / 1000)
    input = input - s * 1000
  }

  ms = input

  let str = []

  if(h) {
    str.push(String(h) + 'h')
  }

  if(min) {
    str.push(String(min) + 'min')
  }

  if(s) {
    str.push(String(s) + 's')
  }

  if(((h || min || s) && ms) || !(h || min || s)) {
    str.push(String(ms) + 'ms')
  }

  return str.join(' ')
}
