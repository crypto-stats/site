export function getSourceCID(file?: string | null) {
  if (!file) {
    return null
  }

  const result = /exports\.sourceFile = '([\w\d]{46})';/.exec(file)

  return result ? result[1] : null
}
