// @ts-ignore
import asc from 'assemblyscript/asc'
import files from 'resources/graph-ts-lib'

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
        return files[path]
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
      'typeConversion.bytesToString': () => null,
      'typeConversion.bytesToHex': () => null,
      'typeConversion.bigIntToString': () => null,
      'typeConversion.bigIntToHex': () => null,
      'typeConversion.stringToH160': () => null,
      'typeConversion.bytesToBase58': () => null,
    },
    datasource: {
      'dataSource.create': () => null,
      'dataSource.createWithContext': () => null,
      'dataSource.address': () => null,
      'dataSource.network': () => null,
      'dataSource.context': () => null,
    },
    numbers: {
      'bigInt.plus': () => null,
      'bigInt.minus': () => null,
      'bigInt.times': () => null,
      'bigInt.dividedBy': () => null,
      'bigInt.dividedByDecimal': () => null,
      'bigInt.mod': () => null,
      'bigInt.pow': () => null,
      'bigInt.fromString': () => null,
      'bigInt.bitOr': () => null,
      'bigInt.bitAnd': () => null,
      'bigInt.leftShift': () => null,
      'bigInt.rightShift': () => null,
      'bigDecimal.toString': () => null,
      'bigDecimal.fromString': () => null,
      'bigDecimal.plus': () => null,
      'bigDecimal.minus': () => null,
      'bigDecimal.times': () => null,
      'bigDecimal.dividedBy': () => null,
      'bigDecimal.equals': () => null,
    },
    index: {
      'crypto.keccak256': () => null,
      'ens.nameByHash': () => null,
      'log.log': () => null,
      'store.set': () => null,
      'store.get': () => null,
      'store.remove': () => null,
    },
  }

  const module = await WebAssembly.instantiate(bytecode, imports)
  return module
}
