import { addImport } from 'utils/source-code-utils'

describe('addImport', () => {
  it('will add an import to an empty file', () => {
    const result = addImport('', 'dir/file', 'Entity')

    expect(result).toEqual("import { Entity } from 'dir/file';\n")
  })

  it('will add an import to an file with code', () => {
    const startingCode = `import { Thing } from 'dir/otherFile';

new Thing();
`
    const result = addImport(startingCode, 'dir/file', 'Entity')

    expect(result).toEqual(`import { Thing } from 'dir/otherFile';
import { Entity } from 'dir/file';

new Thing();
`)
  })

  it('will add an import to an existing import', () => {
    const startingCode = `import { Thing } from 'dir/file';

new Thing();
`
    const result = addImport(startingCode, 'dir/file', 'Entity')

    expect(result).toEqual(`import { Thing, Entity } from 'dir/file';

new Thing();
`)
  })

  it('should do nothing if the import already exists', () => {
    const startingCode = `import { Entity, Other } from 'dir/file';

new Entity();
`
    const result = addImport(startingCode, 'dir/file', 'Entity')

    expect(result).toEqual(`import { Entity, Other } from 'dir/file';

new Entity();
`)
  })
})
