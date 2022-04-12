// @ts-ignore
import asc from 'assemblyscript/asc'
// @ts-ignore
const context = require.context(
  '!raw-loader!node_modules/@graphprotocol/graph-ts',
  true,
  /node_modules\/@graphprotocol\/graph-ts.+\.ts$/
)
const files: any = {}

for (let filename of context.keys()) {
  files[filename] = context(filename)
}

interface CompilerOptions {
  libraries?: { [name: string]: string }
}

export async function compileAs(tsCode: string, { libraries }: CompilerOptions = {}) {
  const sources: any = {
    'input.ts': tsCode,
  }
  var argv = ['--outFile', 'binary', '--textFile', 'text']

  const output: any = {}
  const result = await asc.main([...argv, ...Object.keys(sources)], {
    readFile: (name: string) => {
      console.log(`Loading ${name}`)
      if (name in sources) {
        return sources[name]
      }
      if (libraries && name in libraries) {
        return libraries[name]
      }
      if (
        libraries &&
        name.startsWith('node_modules/') &&
        name.substring('node_modules/'.length) in libraries
      ) {
        return libraries[name.substring('node_modules/'.length)]
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

  return output.binary
}

export async function loadAsBytecode(bytecode: Uint8Array) {
  const imports = {
    env: {
      memoryBase: 0,
      tableBase: 0,
      memory: new WebAssembly.Memory({
        initial: 256,
        maximum: 512,
      }),
      table: new WebAssembly.Table({
        initial: 0,
        maximum: 0,
        element: 'anyfunc',
      }),
      abort: () => null,
    },
    conversion: {
      'typeConversion.bytesToHex': () => null,
      'typeConversion.bigIntToString': () => null,
    },
    numbers: {
      'bigDecimal.toString': () => null,
    },
    index: {
      'store.set': () => null,
    },
  }

  const module = await WebAssembly.instantiate(bytecode, imports)
  return module
}
