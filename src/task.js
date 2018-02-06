/**
 * webpack build task
 *
 * @flow
 */

import chalk from 'chalk'
import { getTable } from 'console.table'
import formatBytes from './byteFormatter'
import formatTime from './timeFormatter'
import renderModuleNotFoundError from './moduleNotFoundRender'

type TaskType = 'init' | 'inc'
type TaskResult = 'done' | 'fail'

export default class Task {
  id: number
  type: TaskType;
  prevCost: number;
  cost: number;
  assets: Array<Object>;
  result: TaskResult;
  warnings: Array<string>;
  errors: Array<Error>;
  shorter: Function;
  stats: any;

  constructor(id: number,
              type: TaskType,
              prevCost: number,
              cost: number,
              result: TaskResult,
              assets: Array<Object>,
              warnings: Array<string>,
              errors: Array<Error>,
              shorter: Function,
              stats: any) {
    this.id = id
    this.type = type
    this.prevCost = prevCost
    this.cost = cost
    this.result = result
    this.assets = assets
    this.warnings = warnings
    this.errors = errors
    this.shorter = shorter
    this.stats = stats
  }

  toString(printWarning?: boolean = true): string {
    const isDone = 'done' === this.result
    const flag = isDone ? 'Done' : 'Ooops'
    const build = 'init' === this.type ? 'initial build' : 'incremental build'
    const abs = formatTime(Math.abs(this.prevCost - this.cost))
    const diff = !this.prevCost ? '' : ' ' + (this.prevCost > this.cost ? chalk.green('-' + abs) : chalk.red('+' + abs))
    const action = isDone ? 'Generate files' : 'Errors'
    const errs = this.errors.length
    const warns = this.warnings.length
    const header =  `${flag}, \
${build} ${formatTime(this.cost)}${diff}, \
${chalk.bold[warns > 0 ? 'red' : 'blue'](warns)} warnings \
${chalk.bold[errs > 0 ? 'red' : 'blue'](errs)} errors, \
${action}:\n
`
    /**
     * print assents or error
     */
    const body = isDone
          ? getTable(this.assets.map(asset => {
            const name = asset.name
            const size = formatBytes(asset.size)
            const chunks = asset.chunkNames.join(' ')
            return { name, size, chunks }
          })).replace(/(-+)/g, (_, a) => {
            return chalk.blue(a)
          })
          : this.errors.map((err, idx) => {
            if('ModuleNotFoundError' === err.name) {
              err = renderModuleNotFoundError(err, this.shorter)
            } else {
              err = err.toString()
            }
            return String(idx + 1) + '. ' + err + '\n'
          }).join('\n')

    let str = header + body

    if(false === printWarning || 0 === this.warnings.length) {
      return str
    }

    /**
     * print warnings
     */
    str += `Warnings:\n`
    str += this.warnings.map((warn, idx) => {
      return String(idx + 1) + '. ' + warn
    }).join('\n')

    return str
  }
}
