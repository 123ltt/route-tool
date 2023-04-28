import * as Fs from 'fs'
import * as Path from 'path'
import { createInterface } from 'readline'
import { isFile } from './util'

export default async (ignoreRule: string) => {
  const ignoreFile = Path.join(process.cwd(), '.gitignore')
  if (await isFile(ignoreFile)) {
    const rs = Fs.createReadStream(ignoreFile, { encoding: 'utf8' })
    const rl = createInterface(rs)

    let isExist = false
    const handler = (line: string) => {
      if (line.trim() === ignoreRule) {
        isExist = true
        rl.removeListener('line', handler)
        rl.close()
        rs.close()
      }
    }

    rl.on('line', handler)

    rl.on('close', async () => {
      if (!isExist) {
        await Fs.promises.appendFile(ignoreFile, `\n${ignoreRule}\n`, 'utf8')
      }
    })
  }
}
