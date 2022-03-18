import type { CompilerHost, CompilerOptions } from "typescript"

export async function compileTsToJs(tsCode: string) {
  const ts = await import("typescript")

  let content: string | null = null
  const compilerHost: CompilerHost = {
    getSourceFile: (fileName, languageVersion) =>
      ts.createSourceFile(fileName, tsCode, languageVersion),
    getDefaultLibFileName: () => "lib.d.ts",
    writeFile: (_fileName, _content) => {
      content = _content
    },
    getCurrentDirectory: () => "tmp",
    getDirectories: () => [],
    getCanonicalFileName: (fileName: string) => fileName.toLowerCase(),
    getNewLine: () => "\n",
    useCaseSensitiveFileNames: () => false,
    fileExists: () => true,
    readFile: () => tsCode,
    resolveModuleNames: () => [],
  }

  const options: CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2019,
  }
  const program = ts.createProgram(["file.ts"], options, compilerHost)
  program.emit()

  if (!content) {
    throw new Error("No output")
  }

  return content
}
