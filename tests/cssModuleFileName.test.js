/**
 * @jest
 */

test('shold find location', () => {
  const resolve = require('../src/cssModuleFileName').default
  expect(resolve(`foo!bar`)).toBe('bar')
})
