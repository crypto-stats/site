export function addImport(code: string, file: string, item: string): string {
  const IMPORT_REGEX = /import {\s*([\w]+(?:,\s*[\w]+)*)\s*} from (?:'|")([\w/]+)(?:'|");?/g

  let result: RegExpExecArray | null
  let lastImportPos = 0

  while ((result = IMPORT_REGEX.exec(code)) !== null) {
    lastImportPos = result.index + result[0].length + 1

    if (result[2] === file) {
      // File already imported

      const importedTokens = result[1].split(',')
      for (const token of importedTokens) {
        if (token.trim() === item) {
          // Import already exists, so return input code
          return code
        }
      }

      // Add item to existing import
      const slicePoint = result.index + result[0].indexOf(result[1]) + result[1].length
      return code.slice(0, slicePoint) + `, ${item}` + code.slice(slicePoint)
    }
  }

  // Add new import after the last existing import
  return (
    code.slice(0, lastImportPos) +
    `import { ${item} } from '${file}';\n` +
    code.slice(lastImportPos)
  )
}
