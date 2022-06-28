import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Plus, Trash2 } from 'lucide-react'

import { Contract, ContractEvent } from 'hooks/local-subgraphs'
import { EventRow } from './EventRow'
import { ErrorState } from 'components/SubgraphEditor/atoms'

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

interface SelectedContractProps {
  contract: Contract & { errorMessage?: string }
  createMappingFn: (fnName: string, eventName: string) => void
  deleteContract: () => void
  fnExtractionLoading: boolean
  mappingFunctionNames: string[]
  subgraphMappings?: { [name: string]: string }
  updateContract: (newProps: Partial<Contract>) => void
  compileError?: string
  setLineOfCursor: React.Dispatch<React.SetStateAction<number>>
}

export const SelectedContract = (props: SelectedContractProps) => {
  const {
    contract: { addresses, name, source, errorMessage, abi, startBlocks, events },
    createMappingFn,
    deleteContract,
    fnExtractionLoading,
    mappingFunctionNames,
    updateContract,
    compileError,
    setLineOfCursor,
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const eventsFromAbi = abi ? parseEventsFromAbi(abi) : []
  const contractHasEvents = eventsFromAbi.length > 0

  const [newEvent, setNewEvent] = useState({ show: false, signature: '' })
  const [metadataLoading, setMetadataLoading] = useState(false)

  const fetchMetadata = async () => {
    setMetadataLoading(true)
    const metadataReq = await fetch(
      `https://miniscan.xyz/api/contract?network=ethereum&address=${addresses[CHAIN_ID]}`
    )
    const metadata = await metadataReq.json()

    const contractSourceCodeNotVerified =
      metadata?.data?.ABI === 'Contract source code not verified'

    if (!metadata.error && !contractSourceCodeNotVerified) {
      updateContract({
        abi: JSON.parse(metadata.data.ABI),
        startBlocks: { [CHAIN_ID]: parseInt(metadata.data.StartBlock) },
        name: metadata.data.ContractName,
      })
    } else if (metadata.success === false || contractSourceCodeNotVerified) {
      updateContract({
        // errorMessage: metadata.error,
        source: 'custom',
      })
    }

    setMetadataLoading(false)
  }

  useEffect(() => {
    if (!abi && source === 'etherscan') {
      fetchMetadata()
    }
  }, [addresses, abi, source])

  // useEffect(() => {
  //   if (events.length > 0) {
  //     setEventHandlers(events.map(e => ({ ...e, editing: false })))
  //   }
  // }, [fnExtractionLoading])

  const eventsFromAbiSelectOptions = eventsFromAbi.map(efa => ({
    label: efa,
    value: efa,
  }))

  const deleteEventHandler = (idx: number) => {
    const newEvents = [...events.slice(0, idx), ...events.slice(idx + 1)]
    updateContract({ events: newEvents })
    if (newEvents.length === 0) {
      setNewEvent({ show: true, signature: '' })
    }
  }

  const handleFileUploadChange = (e: any) => {
    const [file] = e.target.files
    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = function (evt: any) {
      updateContract({
        abi: JSON.parse(evt.target.result),
        source: 'custom',
        name: file.name.split('.')[0],
        // errorMessage: null,
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
          <Trash2 className="delete-link" size={16} onClick={() => deleteContract()} />
        </div>
        <span className="address">{addresses[CHAIN_ID]}</span>
        {metadataLoading ? <span>Fetching contract metadata...</span> : null}
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
                    : 'ABI upload manually'
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
      {compileError ? (
        <ErrorState>
          Please fix all compiler errors in the schema and mapping files before managing events
        </ErrorState>
      ) : null}

      {!contractHasEvents ? (
        <ErrorState>
          {showUploadButton ? 'Please upload the ABI manually' : 'Contract has no events'}
        </ErrorState>
      ) : null}

      {!compileError && contractHasEvents ? (
        <EventHandlerContainer>
          <div className="labels">
            <span>ABI</span>
            <span>Map</span>
          </div>
          {events.map((eh, idx) => (
            <EventRow
              key={`${eh.handler}-${idx}`}
              handleUpdate={(newEvent: ContractEvent) =>
                updateContract({
                  events: events.map((p, i) => (i === idx ? newEvent : p)),
                })
              }
              createMappingFn={createMappingFn}
              eventsOptions={eventsFromAbiSelectOptions}
              mappingFns={mappingFunctionNames}
              eventName={eh.signature.split('(')[0].replace(' ', '')}
              fnExtractionLoading={fnExtractionLoading}
              deleteEventHandler={() => deleteEventHandler(idx)}
              eventHandler={eh}
              setLineOfCursor={setLineOfCursor}
            />
          ))}

          {newEvent.show && (
            <EventRow
              handleUpdate={(newEvent: ContractEvent) => {
                updateContract({ events: [...events, newEvent] })
                setNewEvent({ show: false, signature: '' })
              }}
              createMappingFn={() => null}
              eventsOptions={eventsFromAbiSelectOptions}
              mappingFns={[]}
              eventName=""
              fnExtractionLoading={fnExtractionLoading}
              deleteEventHandler={() => setNewEvent({ show: false, signature: '' })}
              eventHandler={{ signature: '', handler: '' }}
              setLineOfCursor={setLineOfCursor}
            />
          )}

          <NewEventBtnContainer>
            <ActionButton
              disabled={!contractHasEvents}
              onClick={() => setNewEvent({ show: true, signature: '' })}
              {...(!contractHasEvents && {
                disabled: true,
                title: 'Contract has no events defined',
              })}>
              <Plus size={12} style={{ marginRight: 4 }} />
              New
            </ActionButton>
          </NewEventBtnContainer>
        </EventHandlerContainer>
      ) : null}
    </Root>
  )
}
