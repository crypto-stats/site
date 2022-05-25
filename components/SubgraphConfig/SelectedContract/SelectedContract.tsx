import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { SingleValue } from 'react-select'
import { Plus, Trash2 } from 'lucide-react'

import { Contract, ContractEvent, DEFAULT_MAPPING } from 'hooks/local-subgraphs'
import { EventRow } from './EventRow'

const Root = styled.div`
  margin-bottom: 24px;
  font-size: 12px;
`

const Header = styled.div`
  padding: 16px 0px;
  display: flex;
  flex-direction: column;
  color: var(--color-white);

  > .address {
    margin-top: 4px;
    font-size: 14px;
    color: #8f8f8f;
  }

  > .top {
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    .delete-link {
      &:hover {
        cursor: pointer;
      }
    }
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
  margin: 16px 0px;

  .labels {
    display: grid;
    grid-template-columns: repeat(2, 43%);
    color: #d3d3d3;
    margin-bottom: 6px;

    > span {
      padding: 0px 8px;
    }
  }
`

const NewEventBtnContainer = styled.div`
  padding: 10px 8px;
  border-bottom: 1px solid #979797;
`
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  color: var(--color-primary);
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  width: fit-content;
  font-weight: bold;
`

const CHAIN_ID = 1

function parseEventsFromAbi(abi: any[]) {
  return abi
    .filter((el: any) => el.type === 'event')
    .map(
      e =>
        `${e.name}(${e.inputs
          .map((ei: any) => `${ei.indexed ? 'indexed ' : ''}${ei.type} ${ei.name}`)
          .join(', ')})`
    )
}

export type EventHandler = ContractEvent & { editing: boolean }

interface SelectedContractProps {
  contract: Contract & { errorMessage?: string }
  deleteContract: (address: string) => void
  fnExtractionLoading: boolean
  mappingFunctionNames: string[]
  saveEvent: (contractAddress: string, newEvent: ContractEvent, eventIndex: number) => void
  subgraphMappings?: { [name: string]: string }
  updateContract: (address: string, newProps: any) => void
}

export const SelectedContract = (props: SelectedContractProps) => {
  const {
    contract: { addresses, name, source, errorMessage, abi, startBlocks, events },
    deleteContract,
    fnExtractionLoading,
    mappingFunctionNames,
    saveEvent,
    subgraphMappings = {},
    updateContract,
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const eventsFromAbi = abi ? parseEventsFromAbi(abi) : []
  const contractHasEvents = eventsFromAbi.length > 0

  const [eventHandlers, setEventHandlers] = useState<EventHandler[]>([
    { signature: '', handler: '', editing: true },
  ])

  const fetchMetadata = async () => {
    const metadataReq = await fetch(
      `https://miniscan.xyz/api/contract?network=ethereum&address=${addresses[CHAIN_ID]}`
    )
    const metadata = await metadataReq.json()

    if (!metadata.error) {
      updateContract(addresses[CHAIN_ID], {
        abi: JSON.parse(metadata.data.ABI),
        startBlocks: { [CHAIN_ID]: parseInt(metadata.data.StartBlock) },
        name: metadata.data.ContractName,
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

  // when unmounted, remove all unfinished event handlers
  useEffect(() => {
    return () => {
      updateContract(addresses[CHAIN_ID], {
        events: eventHandlers.filter(eh => eh.handler !== '' || eh.signature !== ''),
      })
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      setEventHandlers(events.map(e => ({ ...e, editing: false })))
    }
  }, [fnExtractionLoading])

  const eventsFromAbiSelectOptions = eventsFromAbi.map(efa => ({
    label: efa,
    value: efa,
  }))
  const getMappingFunctionsSelectOptions = (id: number) => {
    const eventName = eventHandlers[id].signature.split('(')[0].replace(' ', '')
    const newFnNameTemplate = `handle${eventName}`
    const fnOccurrenceCount = mappingFunctionNames.filter(mfn =>
      mfn.includes(newFnNameTemplate)
    ).length
    const newFnName =
      fnOccurrenceCount === 0 ? newFnNameTemplate : `${newFnNameTemplate}${fnOccurrenceCount + 1}`

    return [
      {
        label: 'Create new',
        options: [{ label: newFnName, value: newFnName }],
      },
      {
        label: 'Map to existing functions',
        options: mappingFunctionNames.map(mfn => ({
          label: mfn,
          value: mfn,
        })),
      },
    ]
  }

  const deleteEventHandler = (idx: number) =>
    setEventHandlers(prev => {
      const newEvents = prev.filter((_, i) => idx !== i)
      return newEvents.length > 0 ? newEvents : [{ signature: '', handler: '', editing: true }]
    })

  const saveEventHandler = (idx: number) => {
    const event = eventHandlers[idx]

    if (event.signature && event.handler) {
      saveEvent(addresses[CHAIN_ID], event, idx)
      toggleEditing(idx)
    }
  }

  const toggleEditing = (idx: number) =>
    setEventHandlers(prev =>
      prev.map((pe, pei) => (pei === idx ? { ...pe, editing: !pe.editing } : pe))
    )

  const getHandleSelectOptionChangeFn =
    (idx: number) =>
    (key: 'signature' | 'handler') =>
    (newValue: SingleValue<{ label: string; value: string }>) => {
      setEventHandlers(prev =>
        prev.map((p, i) => (i === idx ? { ...p, [key]: newValue!.value } : p))
      )
    }

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

  const showUploadButton = errorMessage || source === 'custom'

  return (
    <Root>
      <Header>
        <div className="top">
          <span className="contract-title">{name || 'No name'}</span>
          <Trash2
            className="delete-link"
            size={16}
            onClick={() => deleteContract(addresses[CHAIN_ID])}
          />
        </div>
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
          <span>ABI</span>
          <span>Map</span>
        </div>
        {eventHandlers.map((eh, idx) => (
          <EventRow
            key={idx}
            handleSelectOptionChange={getHandleSelectOptionChangeFn(idx)}
            eventsOptions={eventsFromAbiSelectOptions}
            mappingFnsOptions={getMappingFunctionsSelectOptions(idx)}
            fnExtractionLoading={fnExtractionLoading}
            toggleEditing={() => toggleEditing(idx)}
            saveEventHandler={() => saveEventHandler(idx)}
            deleteEventHandler={() => deleteEventHandler(idx)}
            eventHandler={eh}
          />
        ))}

        <NewEventBtnContainer>
          <ActionButton
            disabled={
              !contractHasEvents ||
              !eventHandlers[eventHandlers.length - 1].handler ||
              !eventHandlers[eventHandlers.length - 1].signature
            }
            onClick={() =>
              setEventHandlers(prev => [...prev, { signature: '', handler: '', editing: true }])
            }
            {...(!contractHasEvents && {
              disabled: true,
              title: 'Contract has no events defined',
            })}>
            <Plus size={12} style={{ marginRight: 4 }} />
            New
          </ActionButton>
        </NewEventBtnContainer>
      </EventHandlerContainer>
    </Root>
  )
}
