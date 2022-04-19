import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import InputField from 'components/InputField'
import { WalletButton, Header, HeaderRight } from 'components/layouts'
import { InputLabel } from './InputLabel'
import { Contract, useLocalSubgraph, DEFAULT_MAPPING, newSubgraph } from 'hooks/local-subgraphs'
import { useEditorState } from 'hooks/editor-state'
import { SelectedContract } from './SelectedContract'
import Button from '../Button'

const Root = styled.div`
  background-color: '#2F3237';
  min-height: 100vh;
`

const PrimaryFill = styled.section`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  margin: 64px auto;
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
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  max-width: 250px;
  align-self: center;
  text-align: center;
`

const ContractInput = styled(InputField)`
  background: url('/Icon/ico-magnifying-glass.svg') no-repeat right;
  background-size: 16px;
  background-position-x: calc(100% - 20px);
  width: 100%;
  color: #b0b0b0;
  background-color: #252528;
  border: solid 1px #181818;
  box-sizing: border-box;
  padding: 20px;
  padding-right: 55px;
  border-radius: 4px;
  margin: 16px 0;

  &:focus-visible {
    outline: 0;
    border-color: white;
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

export type ExtendedContract = Contract & { errorMessage?: string }

const ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i

export const NewSubgraph = () => {
  const CHAIN_ID = '1'

  const [subgraphId, setSubgraphId] = useEditorState<string | null>('subgraph-file')
  const { subgraph, saveContracts } = useLocalSubgraph(subgraphId)
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
          ...prev,
          {
            name: '',
            addresses: { [CHAIN_ID]: contractAddress },
            abi: null,
            startBlocks: {},
            source: 'etherscan',
            events: [],
          },
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
    setStarted(true)
  }, [])

  if (!started) {
    return null
  }

  const updateSelectedContract = (address: string, newProps: any) =>
    setSelectedContracts(prev =>
      prev.map(p => (p.addresses[CHAIN_ID] === address ? { ...p, ...newProps } : p))
    )

  const handleOnExit = () => {
    if (confirm('Are you sure you wanna exit without saving?')) {
      return router.back()
    }
  }

  const save = () => {
    let id = subgraphId
    if (subgraph) {
      saveContracts(selectedContracts)
    } else {
      id = newSubgraph({ contracts: selectedContracts })
    }
    setSubgraphId(id)
    router.push('/editor/subgraph')
  }

  return (
    <Root style={{ background: '#2F3237' }}>
      <Header size={64} order={1}>
        <HeaderRight>
          <WalletButton />
        </HeaderRight>
      </Header>
      <PrimaryFill style={{ width: 610 }}>
        <Title>Configure your contracts & events</Title>

        <InputLabel>Protocols</InputLabel>
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
            mappingFunctionNames={mappingFunctionNames}
            fnExtractionLoading={fnExtractionLoading}
          />
        ))}

        <ButtonsContainer>
          <Button fullWidth={false} className="exit" onClick={handleOnExit}>
            Exit
          </Button>

          <Button fullWidth={false} variant="outline" className="save" onClick={save}>
            Save
          </Button>
        </ButtonsContainer>
      </PrimaryFill>
    </Root>
  )
}

export default NewSubgraph
