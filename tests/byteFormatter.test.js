/**
 * @jest
 */

test('should be bytes', () => {
  const format = require('../src/byteFormatter').default
  expect(format(42)).toBe('42 B')
})

test('should be KB, keep 2 digits', () => {
  const format = require('../src/byteFormatter').default
  expect(format(1042)).toBe('1.04 KB')
})

test('should be KB, keep 3 digits', () => {
  const format = require('../src/byteFormatter').default
  expect(format(1042, 3)).toBe('1.042 KB')
})

test('should be MB', () => {
  const format = require('../src/byteFormatter').default
  expect(format(1024000)).toBe('1.00 MB')
})
