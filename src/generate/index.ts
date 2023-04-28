import { promises as Fs } from 'fs'
import * as Path from 'path'
import { isDirectory, copyFile } from '../util'

const arr = [
  {
    tpl: 'staticRoute.d.ts',
    dest: Path.resolve('src/plugins/staticRoute/index.d.ts')
  }
]

export default async function bootstrap () {
  for (const item of arr) {
    const target = Path.join(__dirname, '../../tpl', item.tpl)
    const p = Path.parse(item.dest)
    if (!await isDirectory(p.dir)) {
      await Fs.mkdir(p.dir, { recursive: true })
    }
    await copyFile({
      targetFile: target,
      destFile: item.dest
    })
  }
}
