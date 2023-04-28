import { promises as Fs } from 'fs'
import * as Path from 'path'
import { APIPrefix } from '../index'
import { isDirectory, copyFile } from '../util'
import gitIgnore from '../gitIgnore'

export default async (prefix: APIPrefix) => {
  const destDir = Path.join(process.cwd(), 'src/plugins/request')

  if (!await isDirectory(destDir)) {
    await Fs.mkdir(destDir, { recursive: true })
  }

  const arr: [string, string][] = []
  if (typeof prefix === 'function') {
    arr.push(...prefix(true), ...prefix(false))
  } else {
    arr.push(...prefix)
  }
  const mapping: {[key:string]: string[]} = {}
  arr.forEach(([key, val]) => {
    mapping[key] = mapping[key] || []
    mapping[key].push(val)
  })

  const replaceContent = Object.entries(mapping).map(([key, val]) => `  /** ${key} -> ${val.join(' | ')} */\n  ${key}: fn;`).join('\n')
  await copyFile({
    targetFile: Path.join(__dirname, '../../tpl/request.d.ts'),
    destFile: Path.join(destDir, 'index.d.ts'),
    replacer: str => str.replace(/__PREFIX__/g, replaceContent)
  })
  await gitIgnore('src/plugins')
}
