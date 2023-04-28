import * as Fs from 'fs'
import * as ReadLine from 'readline'

async function getPathType (path: string) {
  try {
    const stat = await Fs.promises.stat(path)
    if (stat.isFile()) return 1
    if (stat.isDirectory()) return 2
  } catch (err) { }
  return 0
}

export async function isDirectory (dir: string) {
  return await getPathType(dir) === 2
}

export async function isFile (filepath: string) {
  return await getPathType(filepath) === 1
}

type ReadLineOptions = { targetFile: string; destFile: string; replacer?: (line: string) => string }
/** 复制文件 */
export async function copyFile (options: ReadLineOptions) {
  return new Promise(resolve => {
    const ws = Fs.createWriteStream(options.destFile)
    const rl = ReadLine.createInterface(Fs.createReadStream(options.targetFile, { encoding: 'utf8' }))

    rl.on('line', line => {
      const str = options.replacer ? options.replacer(line) : line
      ws.write(str + '\n')
    })

    rl.once('close', () => {
      ws.close()
      resolve(null)
    })
  })
}

/**
 * 前缀交集
 * `['a','b','ab','bc']` -> `["ab", "bc"]`
 */
export function prefixIntersection (arr: string[]) {
  arr = arr.filter(Boolean)
  const len = arr.length

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (i === j || arr[i] === '' || arr[j] === '') continue
      if (arr[i].toLowerCase().indexOf(arr[j].toLowerCase()) === 0) {
        arr.splice(j, 1, '')
      }
    }
  }
  return arr.filter(Boolean)
}
