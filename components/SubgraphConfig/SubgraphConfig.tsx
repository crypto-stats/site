import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Info } from 'lucide-react'

import InputField from 'components/InputField'
import { InputLabel } from './InputLabel'
import { Contract, useLocalSubgraph, DEFAULT_MAPPING, newSubgraph } from 'hooks/local-subgraphs'
import { useEditorState } from 'hooks/editor-state'
import { SelectedContract } from './SelectedContract/SelectedContract'
import { Dropdown } from '../atoms'

const Root = styled.div`
  min-height: 100vh;
  margin-bottom: 60px;
  background-color: #212121;
`

const PrimaryFill = styled.section`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  padding: 32px;
  /* margin: 0px auto; */
  @media (max-width: 700px) {
    & > * {
      display: none;
    }

    &:before {
      content: 'The CryptoStats editor is not available on mobile devices 😢';
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 32px;
      font-size: 24px;
      text-align: center;
    }
  }
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
  width: 100%;
  color: #b0b0b0;
  background-color: #2a2d30;
  border: solid 1px #181818;
  box-sizing: border-box;
  padding: 10px;
  padding-right: 55px;
  border-radius: 4px;
  margin: 4px 0;

  &:focus-visible {
    outline: 0;
    border-color: #2684ff;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;

  > .exit {
    padding: 10px 0px;
    background-color: #37373c;
    color: #8e99ff;
    border: 2px solid #8e99ff;
  }

  > .save {
    color: var(--color-white);
    background-color: #2e53e9;
    border: 1px solid #172e8b;
  }
`

const ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i
const MAPPING_FILENAME = 'mapping.ts'
export type ExtendedContract = Contract & { errorMessage?: string }

export const SubgraphConfig = () => {
  const CHAIN_ID = '1'

  const [subgraphId, setSubgraphId] = useEditorState<string | null>('subgraph-file')
  const { subgraph, saveContracts, saveMapping } = useLocalSubgraph(subgraphId)
  const [contractAddress, setContractAddress] = useState('')
  const [started, setStarted] = useState(false)
  const [selectedContracts, setSelectedContracts] = useState<ExtendedContract[]>(
    subgraph?.contracts || []
  )

  const [mappingFunctionNames, setMappingFunctionNames] = useState<string[]>([])
  const router = useRouter()
  const [fnExtractionLoading, setFnExtractionLoading] = useState(false)
  useEffect(() => {
    const alreadySelected = selectedContracts.find(sc => sc.addresses[CHAIN_ID] === contractAddress)
    if (ADDRESS_REGEX.test(contractAddress)) {
      if (!alreadySelected) {
        setSelectedContracts(prev => [
          {
            name: '',
            addresses: { [CHAIN_ID]: contractAddress },
            abi: null,
            startBlocks: {},
            source: 'etherscan',
            events: [],
          },
          ...prev,
        ])
        setContractAddress('')
      } else {
        alert(`Contract ${contractAddress} already added`)
      }
    }
  }, [contractAddress])

  const loadFunctionsFromMappingCode = async (code: string) => {
    setFnExtractionLoading(true)
    const { compileAs, loadAsBytecode } = await import('utils/as-compiler')
    const bytecode = await compileAs(code)
    const module = await loadAsBytecode(bytecode)
    const exports = WebAssembly.Module.exports(module.module)
    const functionNames = exports
      .filter(_export => _export.kind === 'function')
      .map(_export => _export.name)
    setMappingFunctionNames(functionNames)
    setFnExtractionLoading(false)
  }

  useEffect(() => {
    if (subgraph?.mappings[DEFAULT_MAPPING]) {
      loadFunctionsFromMappingCode(subgraph.mappings[DEFAULT_MAPPING])
    }
  }, [subgraph?.mappings[DEFAULT_MAPPING]])

  useEffect(() => {
    if (subgraph?.contracts && !selectedContracts.length) {
      setSelectedContracts(subgraph.contracts)
    }
  }, [subgraph])

  useEffect(() => {
    setStarted(true)
  }, [])

  if (!started) {
    return null
  }

  const updateSelectedContract = (address: string, newProps: any) =>
    setSelectedContracts(prev =>
      prev.map(p => (p.addresses[CHAIN_ID] === address ? { ...p, ...newProps } : p))
    )

  const deleteSelectedContract = (address: string) =>
    setSelectedContracts(prev => prev.filter(p => p.addresses[CHAIN_ID] !== address))

  const handleOnExit = () => {
    if (confirm('Are you sure you wanna exit without saving?')) {
      return router.back()
    }
  }

  const save = () => {
    let id = subgraphId
    const newFnsToInsert: string[] = []
    const contractsToSave = selectedContracts.map(sc => ({
      ...sc,
      events: sc.events.map((sce, i) => {
        if (sce.handler === 'newFunction') {
          const newFnName = `handle${sce.signature.split('(')[0]}${i}`
          newFnsToInsert.push(`\nexport function ${newFnName}():void {}\n`)
          return { ...sce, handler: newFnName }
        }

        return sce
      }),
    }))

    if (subgraph) {
      saveMapping(
        MAPPING_FILENAME,
        subgraph.mappings[MAPPING_FILENAME].concat(newFnsToInsert.join('m'))
      )
      saveContracts(contractsToSave)
    } else {
      id = newSubgraph({ contracts: contractsToSave })
    }
    setSubgraphId(id)
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
            // aria-disabled
            inputValue={'Ethereum mainnet'}
            styles={{
              valueContainer: (provided: any) => ({
                ...provided,
                backgroundColor: '#2a2d30',
                padding: 10,
                borderRadius: 4,
              }),
            }}
            // options={[{ label: 'Ethereum mainnet', value: CHAIN_ID }]}
          />
        </div>
        <Title>Contracts</Title>
        <InputLabel>Add contract</InputLabel>
        <ContractInput
          placeholder="Paste here the contract address"
          name="contractAddress"
          value={contractAddress}
          onChange={setContractAddress}
        />
        {selectedContracts.map(sc => (
          <SelectedContract
            key={sc.addresses[CHAIN_ID]}
            contract={sc}
            updateContract={updateSelectedContract}
            deleteContract={deleteSelectedContract}
            mappingFunctionNames={mappingFunctionNames}
            fnExtractionLoading={fnExtractionLoading}
          />
        ))}
        {/* <ButtonsContainer>
          <Button fullWidth={false} className="exit" onClick={handleOnExit}>
            Exit
          </Button>

          <Button fullWidth={false} variant="outline" className="save" onClick={save}>
            Save
          </Button>
        </ButtonsContainer> */}
      </PrimaryFill>
    </Root>
  )
}
