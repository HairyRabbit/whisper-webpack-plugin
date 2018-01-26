/**
 * i18n
 *
 * @flow
 */

export const en = {
  moduleNotFound: {
    nodejsBuildIn: `wow!! you required %s, it's a nodejs buildin libs, do you develop a nodejs program? The webpack default target was 'web', maybe you need change to 'nodejs':\n\n%s`,
    forgetToInstall: `Forget to install "%s"? Try to run "yarn add %s"`,
    configureAlias: `Forget to configure "resolve.alias"? Add it to your webpack options:\n\n%s`
  }
}
export const zh = {
  moduleNotFound: {
    nodejsBuildIn: `emmmm..., %s 是一个nodejs标准库模块. 难不成是在开发一个nodejs程序么？这样的话，webpack默认的target是'web'，需要将target改成'node':\n\n%s`,
    forgetToInstall: `怕不是忘记安装了 %s？可以通过 "yarn add %s" 来安装`,
    configureAlias: `喔，如果已经安装过的话，这个路径看起来……或者说需要配置alias：\n\n%s`
  }
}
