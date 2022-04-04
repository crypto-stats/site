// @ts-ignore
import asc from 'assemblyscript/asc'
// @ts-ignore
const context = require.context('!raw-loader!node_modules/@graphprotocol/graph-ts', true, /node_modules\/@graphprotocol\/graph-ts.+\.ts$/);
const files: any = {};

for (let filename of context.keys()) {
  files[filename] = context(filename);
}

export async function compileAs(tsCode: string) {
  const sources: any = { [`input.ts`]: tsCode }
  var argv = ['--outFile', 'binary', '--textFile', 'text']

  const output: any = {}
  const result = await asc.main(argv.concat(Object.keys(sources)), {
    readFile: (name: string) => {
      console.log(`Loading ${name}`)
      if (name in sources) {
        return sources[name]
      }
      const path = name.charAt(0) === '/' ? name.substring(1) : name
      if (path in files) {
        return files[path].default
      }
      return null
    },
    writeFile: (name: string, contents: string) => {
      console.log('writing', name)
      output[name] = contents
    },
    listFiles: () => [],
  })

  if (result.error) {
    throw new Error(result.stderr.toString())
  }
console.log(result)
  return output.binary
}
