export async function compileAs(tsCode: string) {
  const sources: any = { [`input.ts`]: tsCode }
  var argv = ['--outFile', 'binary', '--textFile', 'text']
  // @ts-ignore
  const asc: any = await import('assemblyscript/asc')
  const output: any = {}
  const result = await asc.main(argv.concat(Object.keys(sources)), {
    readFile: (name: string) =>
      Object.prototype.hasOwnProperty.call(sources, name) ? sources[name] : null,
    writeFile: (name: string, contents: string) => {
      output[name] = contents
    },
    listFiles: () => [],
  })
  return Object.assign(result, output)
}
