import { NextApiRequest, NextApiResponse } from 'next'
import { handleErrors } from 'utils/api-endpoints'
import * as asc from '@graphprotocol/graph-cli/node_modules/assemblyscript/cli/asc'
import graphLibFiles from 'resources/graph-ts-lib'

const createExitHandler = (inputFile: string) => () => {
  throw new Error(`The AssemblyScript compiler crashed when compiling this file: '${inputFile}'
Suggestion: try to comment the whole file and uncomment it little by little while re-running the graph-cli until you isolate the line where the problem happens.
Also, please contact us so we can make the CLI better by handling errors like this. You can reach out in any of these links:
- Discord channel: https://discord.gg/eM8CA6WA9r
- Github issues: https://github.com/graphprotocol/graph-cli/issues`)
}

const setupExitHandler = (exitHandler: () => void) => process.addListener('exit', exitHandler)

const removeExitHandler = (exitHandler: () => void) => process.removeListener('exit', exitHandler)

// Important note, the `asc.main` callback function parameter is synchronous,
// that's why this function doesn't need to be `async` and the throw works properly.
const assemblyScriptCompiler = (argv: string[], options: asc.APIOptions) => {
  let errorText = ''
  const errorStream = {
    write(chunk: any) {
      errorText += chunk.toString()
      return true
    },
  }

  const _options = {
    ...options,
    stderr: errorStream,
  }

  asc.main(argv, _options, err => {
    if (err) {
      throw new Error(`${err}\n${errorText}`)
    }
    return 0
  })
}

const compilerDefaults = {
  stdout: process.stdout,
  stderr: process.stdout,
}

// You MUST call this function once before compiling anything.
// Internally it just delegates to the AssemblyScript compiler
// which just delegates to the binaryen lib.
const ready = async () => {
  await asc.ready
}

const compile = (inputFile: string, libraries: { [fileName: string]: string }) => {
  const exitHandler = createExitHandler(inputFile)

  setupExitHandler(exitHandler)

  const sources: any = { [`input.ts`]: inputFile }

  const compilerArgs = [
    '--explicitStart',
    '--exportRuntime',
    '--runtime',
    'stub',
    'input.ts',
    'node_modules/@graphprotocol/graph-ts/global/global.ts',
    // '--baseDir',
    // __dirname,
    '--lib',
    `${process.env.PWD}/node_modules`,
    '--outFile',
    'output',
    '--optimize',
    '--debug',
    '--traceResolution',
  ]

  const output: any = {}

  assemblyScriptCompiler(compilerArgs, {
    ...compilerDefaults,
    readFile: name => {
      try {
        if (sources[name]) {
          return sources[name]
        }
        if (libraries[name]) {
          return libraries[name]
        }

        if (name.indexOf('node_modules/@graphprotocol/graph-ts') === 0) {
          return graphLibFiles[name]
        }
        if (name.indexOf('@graphprotocol/graph-ts') === 0) {
          return graphLibFiles[`node_modules/${name}`]
        }
      } catch (e) {
        return null
      }
      return null
    },
    writeFile: (name, contents) => {
      output[name] = contents
    },
    listFiles: () => [],
  })

  // only if compiler succeded, that is, when the line above doesn't throw
  removeExitHandler(exitHandler)

  return output
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Only POST requests allowed')
    }

    const { file, libraries } = req.body

    if (typeof file !== 'string') {
      throw new Error(`File must be a string`)
    }
    if (typeof libraries !== 'object') {
      throw new Error(`Libraries must be a dictionary of strings`)
    }
    for (const fileName in libraries) {
      if (typeof libraries[fileName] !== 'string') {
        throw new Error(`Library ${fileName} must be a string`)
      }
    }

    await ready()

    const output = await compile(file, libraries)

    const outputBase64 = Buffer.from(output.output).toString('base64')

    res.json({ success: true, bytecode: outputBase64 })
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message,
    })
  }
}

export default handleErrors(handler)
