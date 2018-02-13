/**
 * @jest
 */

test('shold find location', () => {
  const resolve = require('../src/cssSourceLocationResolver').default
  expect(resolve(`
.foo {
  composes: bar from './bar'
}
`, './bar')).toEqual({ start: { line: 3, column: 3 }, end: { line: 3, column: 28 }})
})

test('shold throw when not match moduleName', () => {
  const resolve = require('../src/cssSourceLocationResolver').default
  const runner = () => {
    resolve(`
.foo {
  composes: bar from './bar'
}
`, './baz')
  }
  expect(runner).toThrow()
})

test('shold throw when not match composes decl', () => {
  const resolve = require('../src/cssSourceLocationResolver').default
  const runner = () => {
    resolve(`
.foo {
  color: red
}
`, './baz')
  }
  expect(runner).toThrow()
})
