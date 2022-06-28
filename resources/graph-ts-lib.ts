// This file loads all AssemblyScript files from the @graphprotocol/graph-ts package into memory,
// and puts them into a mapping by their filename.

// @ts-ignore
const context = require.context(
  '!raw-loader!node_modules/@graphprotocol/graph-ts',
  true,
  /node_modules\/@graphprotocol\/graph-ts.+\.ts$/
)

const graphLibFiles: { [fileName: string]: string } = {}

for (let filename of context.keys()) {
  graphLibFiles[filename] = context(filename).default
}

export default graphLibFiles
