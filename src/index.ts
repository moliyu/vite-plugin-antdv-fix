import fs from 'fs'
import type { Plugin } from 'vite'
import type { Options } from './types'

const pluginName = 'vite-plugin-antdv-fix'
let fixPath = [
  'calendar/index.js',
  // 'date-picker/createPicker.js',
  // 'date-picker/RangePicker.js',
  // 'date-picker/WeekPicker.js',
  '_util/moment-util.js',
  'locale-provider/index.js',
  // 'statistic/Countdown.js',
  // 'statistic/utils.js'
]
const cache: Map<string, string> = new Map

const antdvFix = (options: Options = {}): Plugin => {
  if (options.files) fixPath = [...options.files, ...fixPath]
  return {
    name: pluginName,
    configResolved(config) {
      if (!config.optimizeDeps.esbuildOptions) {
        config.optimizeDeps.esbuildOptions = {}
      }
      if (!config.optimizeDeps.esbuildOptions.plugins) {
        config.optimizeDeps.esbuildOptions.plugins = []
      }
      config.optimizeDeps.esbuildOptions.plugins.push({
        name: pluginName,
        setup(build) {
          build.onLoad(
            {
              filter: /\.js$/
            },
            args => {
              const path = args.path.replace(/\\/g, '/')
              if (fixPath.some(item => path.endsWith(item))) {
                let contents: string = ''
                if (cache.has(path)) {
                  contents = cache.get(path)!
                } else {
                  const source = fs.readFileSync(path, 'utf-8')
                  contents = source.replace(`import * as moment`, 'import moment')
                  cache.set(path, contents)
                }
                return {
                  contents
                }
              } else {
                return {
                  loader: 'js',
                }
              }
            }
          )
        }
      })

      // 修复打包后require is not defined
      if (process.env.NODE_ENV === 'production') {
        if (!config.build.commonjsOptions) {
          config.build.commonjsOptions = {}
        }
        config.build.commonjsOptions.transformMixedEsModules = true

      }
    },
    transform(code, id) {
      if (fixPath.some(item => id.endsWith(item))) {
        code = code.replace(`import * as moment`, 'import moment')
      }
      return {
        code,
        map: null
      }
    }
  }
}

export default antdvFix