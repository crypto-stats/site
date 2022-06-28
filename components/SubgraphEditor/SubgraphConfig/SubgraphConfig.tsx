import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Info } from 'lucide-react'

import { InputLabel, InputField, ErrorState } from '../atoms'
import { Contract, useLocalSubgraph, DEFAULT_MAPPING, SubgraphData } from 'hooks/local-subgraphs'
import { EDITOR_TYPES, useEditorState } from 'hooks/editor-state'
import { SelectedContract } from './SelectedContract'
import { Dropdown } from '../../atoms'
import { addImport } from 'utils/source-code-utils'
import { generateContractFile, generateSchemaFile } from 'utils/graph-file-generator'

const Root = styled.div`
  min-height: 100vh;
  padding-bottom: 60px;
  background-color: #212121;
`

const PrimaryFill = styled.section`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  padding: 32px;
`

const Title = styled.h3`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  max-width: 250px;
  margin: 0px;
  margin-bottom: 24px;
`

const InfoMsg = styled.span`
  display: inline-flex;
  gap: 12px;
  align-items: center;
  color: var(--color-white);
  font-size: 12px;
`

const ContractInput = styled(InputField)`
  background: url('/Icon/ico-magnifying-glass.svg') no-repeat right;
  background-size: 16px;
  background-position-x: calc(100% - 20px);
`

const ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i

interface TErrorState {
  address?: string
  compiler?: string
}

interface SubgraphConfigProps {
  setJumpToLine: React.Dispatch<React.SetStateAction<string | null>>
}

export const SubgraphConfig = (props: SubgraphConfigProps) => {
  const { setJumpToLine } = props

  const CHAIN_ID = '1'

  const [subgraphId] = useEditorState<string | null>(EDITOR_TYPES['subgraph-file'])
  const { subgraph, saveContracts, saveMapping, update } = useLocalSubgraph(subgraphId)
  const [contractAddress, setContractAddress] = useState('')
  const [started, setStarted] = useState(false)
  const [errorState, setErrorState] = useState<TErrorState>({
    address: undefined,
    compiler: undefined,
  })

  const [mappingFunctionNames, setMappingFunctionNames] = useState<string[]>([])
  const [fnExtractionLoading, setFnExtractionLoading] = useState(false)

  const updateErrorState = (key: keyof TErrorState, message?: string) => {
    setErrorState(prev => ({ ...prev, [key]: message }))
  }

  const updateContractAddress = (address: string) => {
    updateErrorState('address')
    if (!subgraph) {
      throw new Error('No subgraph')
    }
    const alreadySelected = subgraph.contracts.find(sc => sc.addresses[CHAIN_ID] === address)
    if (ADDRESS_REGEX.test(address)) {
      if (!alreadySelected) {
        const newContract: Contract = {
          name: '',
          addresses: { [CHAIN_ID]: address },
          abi: null,
          startBlocks: {},
          source: 'etherscan',
          events: [],
        }
        saveContracts([newContract, ...subgraph.contracts])
        setContractAddress('')
      } else {
        updateErrorState('address', `Contract ${address} already added`)
      }
    } else {
      setContractAddress(address)
      updateErrorState('address', `Contract "${address}" is not a valid contract`)
    }
  }

  const loadFunctionsFromMappingCode = async (subgraph: SubgraphData) => {
    setFnExtractionLoading(true)
    const { compileAs, loadAsBytecode } = await import('utils/as-compiler')

    const libraries: { [name: string]: string } = {}

    for (const contract of subgraph.contracts) {
      const code = await generateContractFile(contract.abi)
      libraries[`contracts/${contract.name}.ts`] = code
    }

    libraries['schema/index.ts'] = await generateSchemaFile(subgraph.schema)

    try {
      const bytecode = await compileAs(subgraph.mappings[DEFAULT_MAPPING], { libraries })
      const module = await loadAsBytecode(bytecode)
      const exports = WebAssembly.Module.exports(module.module)
      const functionNames = exports
        .filter(_export => _export.kind === 'function')
        .map(_export => _export.name)
      setMappingFunctionNames(functionNames)
      setFnExtractionLoading(false)
      updateErrorState('compiler')
    } catch (err: any) {
      updateErrorState('compiler', err.message)
    }
  }

  useEffect(() => {
    if (subgraph?.mappings[DEFAULT_MAPPING]) {
      loadFunctionsFromMappingCode(subgraph)
    }
  }, [])

  useEffect(() => {
    setStarted(true)
  }, [])

  if (!started) {
    return null
  }

  const updateSelectedContract = (address: string, newProps: any) => {
    if (!subgraph) {
      throw new Error('No subgraph')
    }
    saveContracts(
      subgraph.contracts.map(contract =>
        contract.addresses[CHAIN_ID] === address ? { ...contract, ...newProps } : contract
      )
    )
  }

  const deleteSelectedContract = (address: string) => {
    if (!subgraph) {
      throw new Error('No subgraph')
    }
    saveContracts(subgraph.contracts.filter(contract => contract.addresses[CHAIN_ID] !== address))
  }

  const createMappingFn = (fnName: string, eventName: string, contractName: string) => {
    const newFn = `\nexport function ${fnName}(event: ${eventName}):void {}\n`
    const mappingCode =
      addImport(subgraph!.mappings[DEFAULT_MAPPING], `contracts/${contractName}`, eventName) + newFn
    saveMapping(DEFAULT_MAPPING, mappingCode)
  }

  return (
    <Root>
      <PrimaryFill style={{ width: 610 }}>
        <Title>Configuration</Title>
        <InfoMsg>
          <Info size={16} />
          Configure the network, contracts and event handlers you want to work with.
        </InfoMsg>
        <div style={{ margin: '32px 0px' }}>
          <InputLabel>Network</InputLabel>
          <Dropdown
            components={{ DropdownIndicator: () => null }}
            openMenuOnClick={false}
            openMenuOnFocus={false}
            menuIsOpen={false}
            inputValue={'Ethereum mainnet'}
            customStyles={{
              valueContainer: {
                backgroundColor: '#2a2d30',
                padding: 10,
                borderRadius: 4,
                fontSize: 14,
                '&:hover': { cursor: 'not-allowed' },
              },
            }}
          />
        </div>

        <InputLabel>Version</InputLabel>
        <InputField
          placeholder="Subgraph version number"
          name="version"
          value={subgraph?.version || ''}
          onChange={version => update(_subgraph => ({ ..._subgraph, version }))}
        />

        <Title>Contracts</Title>
        <InputLabel>Add contract</InputLabel>
        <ContractInput
          placeholder="Paste here the contract address"
          name="contractAddress"
          value={contractAddress}
          onChange={updateContractAddress}
        />
        {errorState.address ? <ErrorState>{errorState.address}</ErrorState> : null}
        {subgraph?.contracts.map(sc => (
          <SelectedContract
            key={`${subgraphId}-${sc.addresses[CHAIN_ID]}`}
            contract={sc}
            updateContract={(newProps: Partial<Contract>) =>
              updateSelectedContract(sc.addresses[CHAIN_ID], newProps)
            }
            deleteContract={() => deleteSelectedContract(sc.addresses[CHAIN_ID])}
            createMappingFn={(fnName: string, eventName: string) =>
              createMappingFn(fnName, eventName, sc.name)
            }
            mappingFunctionNames={mappingFunctionNames}
            fnExtractionLoading={fnExtractionLoading}
            compileError={errorState.compiler}
            setJumpToLine={setJumpToLine}
          />
        ))}
      </PrimaryFill>
    </Root>
  )
}
