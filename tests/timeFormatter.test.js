/**
 * @jest
 */

test('should be ms', () => {
  const format = require('../src/timeFormatter').default
  expect(format(42)).toBe('42ms')
})

test('should be s and ms', () => {
  const format = require('../src/timeFormatter').default
  expect(format(1042)).toBe('1s 42ms')
})

test('should be min', () => {
  const format = require('../src/timeFormatter').default
  expect(format(60001)).toBe('1min 1ms')
})

test('should be h', () => {
  const format = require('../src/timeFormatter').default
  expect(format(3600000)).toBe('1h')
})

test('should be 0ms', () => {
  const format = require('../src/timeFormatter').default
  expect(format(0)).toBe('0ms')
})
