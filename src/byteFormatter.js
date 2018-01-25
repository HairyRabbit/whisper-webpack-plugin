/**
 * format byte string
 *
 * @flow
 */

export default function format(raw: string | number, digits?: number = 2): string {
  const byteStack = ['B', 'KB', 'MB', 'MB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let input = parseInt(raw)
  let unit = byteStack.shift()
  let flag = 1000
  while(input >= flag) {
    input = input / flag
    unit = byteStack.shift()
    flag = 1024
  }

  if('B' === unit) {
    return input + ' ' + unit
  }

  return input.toFixed(digits) + ' ' + unit
}
