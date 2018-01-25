/**
 * main plugin
 *
 * @flow
 */

import chalk from 'chalk'
import RequestShortener from "webpack/lib/RequestShortener"
import Task from './task'
import type { Options } from './'
import type { Compiler } from 'webpack/lib/Compiler'

const defaultOptions: Options = {
  warnings: true,
  colors: true,
  reasons: true,
  checkSilent: true
}

export default class WhisperWebpackPlugin {
  options: Options;
  errors: Array<*>;
  initBuild: boolean;
  tasks: Array<Task>;

  /**
   * @TODO: compare the init build when server restart, or crashed and restart again
   */
  constructor(options: Options) {
    this.options = {
      ...defaultOptions,
      ...options
    }
    this.errors = []
    this.tasks = []
    this.initBuild = true
  }

  apply(compiler: Compiler): void {
    if(this.options.checkSilent) {
      this.reportSilent(compiler.options)
    }

    compiler.plugin('compile', () => {
      console.log('Webpack compiling...')
    })

    compiler.plugin('after-emit', (compilation, callback) => {
      this.errors = compilation.errors
      callback()
    })

    compiler.plugin('done', stats => {
      const json = stats.toJson({
        colors: this.options.colors,
        errorDetails: false
      })

      const warnings = json.warnings
      const time = json.time
      const hash = json.hash
      const assets = json.assets
      const hasErrors = this.errors.length > 0
      const shorter = new RequestShortener(compiler.options.context);

      const task = new Task(
        hash,
        this.initBuild ? 'init' : 'inc',
        this.tasks.length > 1 ? this.tasks[this.tasks.length - 1].cost : 0,
        time,
        hasErrors ? 'fail' : 'done',
        assets,
        warnings,
        this.errors,
        shorter
      )

      if(true === this.initBuild) {
        this.initBuild = false
      }

      this.tasks.push(task)

      console.log(task.toString(this.options.warnings))
    })
  }

  reportSilent(options: Object): void {
    let silent = true
    if(options.devServer) {
      if(!options.devServer.quite) {
        if('none' !== options.devServer.stats) {
          silent = false
        }
      }
    } else {
      if('none' !== options.stats) {
        silent = false
      }
    }

    if(false === silent) {
    console.log(`webpack not works on silent mode, check your webpack.config.js:
if use webpack-dev-server:

{
  quite: ${chalk.blue('true')}
}

or use webpack on watch mode:

{
  stats: ${chalk.green(`'none'`)}
}
`)
    }
  }
}
