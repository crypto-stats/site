import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Select, { SingleValue } from 'react-select'

import { Contract, Event } from 'hooks/local-subgraphs'
import Button from '../Button'

const Root = styled.div`
  background-color: #25252a;
  margin-bottom: 24px;
`

const Header = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  color: var(--color-white);
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

  .labels {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    gap: 8px;
    text-transform: uppercase;
    color: #d3d3d3;
    font-size: 12px;
    margin-bottom: 6px;
  }
`

const EventRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`

const customStyles = {
  container: (provided: any) => ({ ...provided, width: 'calc(50% - 8px)' }),
  control: (provided: any) => ({
    ...provided,

    backgroundColor: 'var(--color-dark-800)',
    border: `1px var(--color-dark-800)`,
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--color-white)',
  }),
  indicatorsContainer: () => ({ '&:hover': { color: 'var(--color-white)' } }),
}

const CHAIN_ID = 1

interface SelectedContractProps {
  contract: Contract & { errorMessage?: string }
  updateContract: (address: string, newProps: any) => void
  mappingFunctionNames: string[]
  fnExtractionLoading: boolean
}

function parseEventsFromAbi(abi: any[]) {
  return abi
    .filter((el: any) => el.type === 'event')
    .map(
      e =>
        `${e.name}(${e.inputs
          .map((ei: any) => `${ei.indexed ? 'indexed ' : ''}${ei.type}`)
          .join(', ')})`
    )
}

export const SelectedContract = (props: SelectedContractProps) => {
  const {
    contract: { addresses, name, source, errorMessage, abi, startBlocks, events },
    updateContract,
    mappingFunctionNames,
    fnExtractionLoading,
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const eventsFromAbi = abi ? parseEventsFromAbi(abi) : []
  const contractHasEvents = eventsFromAbi.length > 0
  const eventsFromAbiSelectOptions = eventsFromAbi.map(efa => ({
    label: efa,
    value: efa,
  }))
  const mappingFunctionsSelectOptions = mappingFunctionNames.map(mfn => ({
    label: mfn,
    value: mfn,
  }))
  const [eventHandlers, setEventHandlers] = useState<Event[]>([{ signature: '', handler: '' }])
  console.log(eventHandlers)

  const fetchMetadata = async () => {
    const metadataReq = await fetch(`/api/etherscan/${addresses[CHAIN_ID]}/metadata`)
    const metadata = await metadataReq.json()

    if (metadata.isContract) {
      updateContract(addresses[CHAIN_ID], {
        abi: metadata.abi,
        startBlocks: { [CHAIN_ID]: metadata.deployBlock },
        name: metadata.name,
      })
    } else if (metadata.success === false) {
      updateContract(addresses[CHAIN_ID], {
        errorMessage: metadata.error,
        source: 'custom',
      })
    }
  }

  useEffect(() => {
    if (!abi && source === 'etherscan') {
      fetchMetadata()
    }
  }, [addresses, abi, source])

  useEffect(() => {
    updateContract(addresses[CHAIN_ID], {
      events: eventHandlers.filter(eh => eh.handler !== '' && eh.signature !== ''),
    })
  }, [eventHandlers])

  useEffect(() => {
    if (events.length > 0) {
      setEventHandlers(events)
    }
  }, [fnExtractionLoading])

  const handleFileUploadChange = (e: any) => {
    const [file] = e.target.files
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (evt: any) {
      updateContract(addresses[CHAIN_ID], {
        abi: JSON.parse(evt.target.result),
        source: 'custom',
        name: file.name.split('.')[0],
        errorMessage: null,
      })
    }
    reader.onerror = function () {}
  }

  const handleSelectOptionChange =
    (idx: number, key: 'signature' | 'handler') =>
    (newValue: SingleValue<{ label: string; value: string }>) => {
      setEventHandlers(prev =>
        prev.map((p, i) => (i === idx ? { ...p, [key]: newValue!.value } : p))
      )
    }

  const showUploadButton = errorMessage || source === 'custom'

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
        <div className="labels">
          <span>From ABI</span>
          <span>Map on</span>
        </div>
        {eventHandlers.map((eh, idx) => (
          <EventRow key={idx}>
            <Select
              components={{ IndicatorSeparator: () => null }}
              value={eventsFromAbiSelectOptions.find(efa => efa.value === eh.signature)}
              name="signature"
              onChange={handleSelectOptionChange(idx, 'signature')}
              options={eventsFromAbiSelectOptions}
              styles={customStyles}
            />
            <Select
              components={{
                IndicatorSeparator: () => null,
                ...(fnExtractionLoading && { DropdownIndicator: () => null }),
              }}
              value={mappingFunctionsSelectOptions.find(mfs => mfs.value === eh.handler)}
              name="handler"
              onChange={handleSelectOptionChange(idx, 'handler')}
              options={mappingFunctionsSelectOptions}
              styles={customStyles}
              isLoading={fnExtractionLoading}
            />
          </EventRow>
        ))}

        <Button
          disabled={!contractHasEvents}
          fullWidth={false}
          variant="outline"
          className="new-event-handler-btn"
          onClick={() => setEventHandlers(prev => [...prev, { signature: '', handler: '' }])}
          {...(!contractHasEvents && { disabled: true, title: 'Contract has no events defined' })}>
          Add new event handler
        </Button>
      </EventHandlerContainer>
    </Root>
  )
}
