import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Select from 'react-select'

import { Contract } from 'hooks/local-subgraphs'
import Button from '../Button'
import { useEtherscanDeployBlock } from 'hooks/useEtherscanAbi'

const Root = styled.div`
  background-color: #25252a;
  margin-bottom: 24px;
`

const Header = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  background-color: var(--color-dark-800);

  > .address {
    margin-top: 4px;
    font-size: 14px;
  }
`

const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 14px;

  > .status-message {
    color: #b4b4b4;
  }

  > .upload-link {
    color: #728efd;
  }
`

const EventHandlerContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 24px;

  .new-event-handler-btn {
    max-width: 220px;
    align-self: center;
    margin: 8px 0px;
    background-color: #37373c;

    &:hover {
      background-color: var(--color-primary);
    }
  }
`

const EventRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`

const customStyles = {
  container: (provided: any) => ({ ...provided, width: 'calc(50% - 8px)' }),
  option: (provided, state) => ({
    ...provided,
  }),
  control: provided => ({
    ...provided,

    backgroundColor: 'var(--color-dark-800)',
    border: `1px var(--color-dark-800)`,
  }),
  singleValue: provided => ({
    ...provided,
    color: 'var(--color-white)',
  }),
  indicatorSeparator: () => {},
  indicatorsContainer: () => ({ '&:hover': { color: 'var(--color-white)' } }),
}

const CHAIN_ID = 1

interface SelectedContractProps {
  contract: Contract & { errorMessage?: string }
  updateContract: (address: string, newProps: any) => void
  mappingFunctionNames: string[]
}

function parseEventsFromAbi(abi: any[]) {
  return abi
    .filter(el => el.type === 'event')
    .map(
      e =>
        `${e.name}(${e.inputs.map(ei => `${ei.indexed ? 'indexed ' : ''}${ei.type}`).join(', ')})`
    )
}

export const SelectedContract = (props: SelectedContractProps) => {
  const {
    contract: { addresses, name, source, errorMessage, abi, startBlocks },
    updateContract,
    mappingFunctionNames,
  } = props

  console.log(props.contract)

  const inputRef = useRef<HTMLInputElement>(null)
  const [eventHandlers, setEventHandlers] = useState([])

  const { deployBlock } = useEtherscanDeployBlock(startBlocks[CHAIN_ID] ? null : addresses[CHAIN_ID])

  useEffect(() => {
    if (deployBlock && deployBlock !== startBlocks[CHAIN_ID]) {
      updateContract(addresses[CHAIN_ID], {
        ...props.contract,
        startBlocks: { [CHAIN_ID]: deployBlock },
      })
    }
  }, [deployBlock])

  const handleFileUploadChange = (e: any) => {
    const [file] = e.target.files
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (evt: any) {
      updateContract(addresses[CHAIN_ID], {
        ...props.contract,
        abi: JSON.parse(evt.target.result),
        source: 'custom',
        errorMessage: null,
      })
    }
    reader.onerror = function () {}
  }

  const showUploadButton = errorMessage || source === 'custom'
  const eventsFromAbi = abi ? parseEventsFromAbi(abi) : []
  console.log({ abi })

  return (
    <Root>
      <Header>
        <span className="contract-title">{name || 'No name'}</span>
        <span className="address">{addresses[CHAIN_ID]}</span>
        {startBlocks[CHAIN_ID] ? (
          <span className="address">Deployed on block {startBlocks[CHAIN_ID]}</span>
        ) : null}
        <StatusContainer>
          <span className="status-message">
            {errorMessage
              ? errorMessage
              : `${
                  source === 'etherscan'
                    ? 'ABI automatically fetched from etherscan'
                    : 'ABI uploaded manually'
                }`}
          </span>
          {showUploadButton ? (
            <>
              <input
                type="file"
                name="abi"
                style={{ display: 'none' }}
                ref={inputRef}
                accept="application/JSON"
                multiple={false}
                onChange={handleFileUploadChange}
              />
              <a className="upload-link" href="#" onClick={() => inputRef.current?.click()}>
                Manually upload
              </a>
            </>
          ) : null}
        </StatusContainer>
      </Header>
      <EventHandlerContainer>
        <EventRow>
          {}
          <Select
            // styles={customStyles}
            options={eventsFromAbi.map(efa => ({ label: efa, value: efa, onClick: () => {} }))}
          />
          <Select
            // styles={customStyles}
            options={mappingFunctionNames.map(mfn => ({
              label: mfn,
              value: mfn,
              onClick: () => {},
            }))}
          />
        </EventRow>

        <Button fullWidth={false} variant="outline" className="new-event-handler-btn">
          Add new event handler
        </Button>
      </EventHandlerContainer>
    </Root>
  )
}
