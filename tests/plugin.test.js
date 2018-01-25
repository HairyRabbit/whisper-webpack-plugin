/**
 * @jest
 */

beforeEach(() => {
  console.log = jest.fn()
})

test('constructor', () => {
  const Plugin = require('../src/plugin').default
  expect(new Plugin())
})

test('default options', () => {
  const Plugin = require('../src/plugin').default
  const plugin = new Plugin()
  expect(plugin.options).toEqual({
    warnings: true,
    colors: true,
    reasons: true,
    checkSilent: true
  })
})

test('should check or not check silent mode', () => {
  const Plugin = require('../src/plugin').default
  const plugin = new Plugin()
  const compiler = {
    plugin: jest.fn()
  }
  const log1 = jest.fn()
  plugin.reportSilent = log1
  plugin.apply(compiler)
  expect(log1).toBeCalled()
  plugin.options.checkSilent = false
  const log2 = jest.fn()
  plugin.reportSilent = log2
  plugin.apply(compiler)
  expect(log2).not.toBeCalled()
})

test('should log start compile', () => {
  const Plugin = require('../src/plugin').default
  const plugin = new Plugin()
  const startLog = jest.fn()
  const compiler = {
    plugin: (str) => {
      if('compile' === str) {
        startLog()
      }
    }
  }
  plugin.apply(compiler)
  expect(startLog).toBeCalled()
})

test('should reset errors', () => {
  const Plugin = require('../src/plugin').default
  const plugin = new Plugin()
  const compiler = {
    plugin: (str, cb) => {
      if('after-emit' === str) {
        cb({ errors: [ 'foo', 'bar'] }, jest.fn())
      }
    }
  }
  plugin.apply(compiler)
  expect(plugin.errors).toEqual(['foo', 'bar'])
})

test('should push to tasks', () => {
  const Plugin = require('../src/plugin').default
  const plugin = new Plugin()
  const stats = {}
  stats.toJson = jest.fn(() => {
    return {
      hash: 42,
      warnings: [],
      assets: []
    }
  })
  const compiler = {
    options: { context: 'foo' },
    plugin: (str, cb) => {
      if('done' === str) {
        cb(stats)
      }
    }
  }
  plugin.apply(compiler)
  expect(plugin.tasks.length).toBe(1)
})
