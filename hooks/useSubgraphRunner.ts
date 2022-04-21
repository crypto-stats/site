import { useEffect, useState } from 'react'
import { generateContractFile, generateContractHelpers, generateSchemaASHelpers, generateSchemaFile } from 'utils/graph-file-generator'
import { DEFAULT_MAPPING, SubgraphData } from './local-subgraphs'

// @ts-ignore
import helperCode from '!raw-loader!resources/graph-as-helper-code.txt'

export enum CompileState {
  UNCOMPILED,
  COMPILING,
  READY,
  OUTDATED,
}

export const useSubgraphRunner = (subgraph: SubgraphData | null) => {
  const [compileState, setCompileState] = useState(CompileState.UNCOMPILED)

  useEffect(() => {
    setCompileState(CompileState.OUTDATED)
  }, [subgraph])

  const compile = async () => {
    if (!subgraph) {
      return
    }
    try {
      const { compileAs } = await import('utils/as-compiler')
    
      const libraries: { [name: string]: string } = {}
    
      let mappingCode = subgraph.mappings[DEFAULT_MAPPING] + '\n' + helperCode

      for (const contract of subgraph.contracts) {
        const code = await generateContractFile(contract.abi)
        libraries[`contracts/${contract.name}.ts`] = code
        mappingCode += generateContractHelpers(contract.name, contract.abi)
      }

      libraries['schema/index.ts'] = await generateSchemaFile(subgraph.schema)

      mappingCode += await generateSchemaASHelpers(subgraph.schema)
      console.log(mappingCode)
    
      const { binding, binary } = await compileAs(mappingCode, { libraries, bindings: true })
      console.log(binding)
      const binding2 = binding!
        .replace('{ exports }', '{ instance: { exports } }')
        .replace(/Bytes,/g, 'imports.Bytes,')
        .replace(/BigInt,/g, 'imports.Bytes,')
        .replace(/Address,/g, 'imports.Address,')

      const mod = await import(/* webpackIgnore: true */`data:text/javascript;charset=utf-8,${encodeURIComponent(binding2)}`)
      console.log(mod)

      class Address extends Uint8Array {}
      class BigInt extends Uint8Array {}
      class Bytes extends Uint8Array {}

      const i = await mod.instantiate(binary, {
        conversion: {
          typeConversion: {
            stringToH160(s: string) {
              return i.makeAddress(s)
            },
            bytesToHex(bytes: Uint8Array) {
              return '0x' + Buffer.from(bytes).toString('hex');
            },
          },
        },
        numbers: {},
        index: {
          store: {
            set(type: string, id: string, ref: any) {
              console.log(`Creating ${type} with id ${id}`, ref)
              //@ts-ignore
              console.log(i.getPair(ref))
              // window.mem = Buffer.from(i.memory.buffer).toString('hex')
            },
          },
        },
        json: {
          json: {
            fromBytes(bytes: Uint8Array) {
              console.log(bytes, Buffer.from(bytes).toString())
              return JSON.parse(Buffer.from(bytes).toString())
            },
          },
        },
        Address,
        BigInt,
        Bytes,
      })
      console.log(i)
      i.test()

      //@ts-ignore
      window.mod = i
      //@ts-ignore
      window.toHex = b => '0x' + Buffer.from(b).toString('hex');
      // i.handlePairCreated({ params: {}, transaction: { from: { toHex: () => '' } } })

      const block = i.___cs_generate_eth_block({
        hash: i.___cs_generate_Bytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
        parentHash: i.___cs_generate_Bytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
        unclesHash: i.___cs_generate_Bytes('0x'),
        author: i.___cs_generate_Address('0x0000000000000000000000000000000000000000'),
        stateRoot: i.___cs_generate_Bytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
        transactionsRoot: i.___cs_generate_Bytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
        receiptsRoot: i.___cs_generate_Bytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
        number: i.___cs_generate_BigInt(0),
        gasUsed: i.___cs_generate_BigInt(0),
        gasLimit: i.___cs_generate_BigInt(0),
        timestamp: i.___cs_generate_BigInt(0),
        difficulty: i.___cs_generate_BigInt(0),
        totalDifficulty: i.___cs_generate_BigInt(0),
        size: i.___cs_generate_BigInt(0),
        baseFeePerGas: i.___cs_generate_BigInt(0),
      })
      
      const tx = i.___cs_generate_eth_tx({
        hash: i.___cs_generate_Bytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
        index: i.___cs_generate_BigInt(0),
        from: i.___cs_generate_Address('0x0000000000000000000000000000000000000000'),
        to: i.___cs_generate_Address('0x0000000000000000000000000000000000000000'),
        value: i.___cs_generate_BigInt(0),
        gasLimit: i.___cs_generate_BigInt(0),
        gasPrice: i.___cs_generate_BigInt(0),
        input: i.___cs_generate_Bytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
        nonce: i.___cs_generate_BigInt(0),
      })

      const params = i.___cs_generate_EventParamArray_from_JSON(JSON.stringify([
        { name: 'pair', type: 'address', value: '0x0000000000000000000000000000000000000000' },
        { name: 'token0', type: 'address', value: '0x0000000000000000000000000000000000000000' },
        { name: 'token1', type: 'address', value: '0x0000000000000000000000000000000000000000' },
      ]))

      const event = i.___cs_generate_UniV2Factory_PairCreated(
        i.___cs_generate_Address('0x0000000000000000000000000000000000000000'),
        i.___cs_generate_BigInt(0), // block log index
        i.___cs_generate_BigInt(0), // tx log index
        null, // Logtype
        block,
        tx,
        params,
      )
      console.log(event)
    } catch (e: any) {
      console.error(e)
    }
  }

  return {
    compileState,
    compile,
  }
}
