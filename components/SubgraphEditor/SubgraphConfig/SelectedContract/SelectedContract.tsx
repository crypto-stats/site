import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Files, Plus, Trash2 } from 'lucide-react'
import ReactTooltip from 'react-tooltip'

import { Contract, ContractEvent } from 'hooks/local-subgraphs'
import { EventRow } from './EventRow'
import { ErrorState } from 'components/SubgraphEditor/atoms'
import { generateContractFile } from 'utils/graph-file-generator'
import EditableText from 'components/SubgraphEditor/atoms/EditableText'

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
  }
`

const IconBtn = styled.button<{ active?: boolean }>`
  color: ${({ active }) => (active ? '#ffffff' : '#bbbbbb')};
  border: none;
  background: transparent;
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

const EtherscanLink = styled.a`
  display: inline-block;
  background-image: url(/etherscan-logo-light-circle.svg);
  height: 16px;
  width: 16px;
  opacity: 0.5;
  background-size: 100%;
  margin-left: 6px;
  vertical-align: middle;

  &:hover {
    opacity: 0.8;
  }
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
  setJumpToLine: React.Dispatch<React.SetStateAction<string | null>>
}

export const SelectedContract = (props: SelectedContractProps) => {
  const {
    contract: { addresses, name, source, errorMessage, abi, startBlocks, events, isTemplate },
    createMappingFn,
    deleteContract,
    fnExtractionLoading,
    mappingFunctionNames,
    updateContract,
    compileError,
    setJumpToLine,
  } = props

  useEffect(() => {
    if (mappingFunctionNames.length > 0) {
      const missingFns = events.reduce(
        (acc: number[], e, i) => (!mappingFunctionNames.includes(e.handler) ? [...acc, i] : acc),
        []
      )

      if (missingFns.length > 0) {
        updateContract({
          events: events.map((p, i) =>
            missingFns.includes(i) ? { handler: '', signature: p.signature } : p
          ),
        })
      }
    }
  }, [mappingFunctionNames])

  const inputRef = useRef<HTMLInputElement>(null)

  const [newEvent, setNewEvent] = useState({ show: false, signature: '' })
  const [metadataLoading, setMetadataLoading] = useState(false)
  const [eventsFromAbi, setEventsFromAbi] = useState<string[]>([])
  const [parseABIError, setParseABIError] = useState<string | null>(null)

  useEffect(() => {
    if (abi) {
      try {
        setEventsFromAbi(parseEventsFromAbi(abi))
      } catch (e: any) {
        setEventsFromAbi([])
        setParseABIError(e.message)
      }
    } else {
      setEventsFromAbi([])
    }
  }, [abi])

  const contractHasEvents = eventsFromAbi.length > 0

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
    if (abi) {
      setParseABIError(null)
      generateContractFile(name, abi).catch(e => setParseABIError(e.message))
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
          <EditableText
            value={name || 'Unnamed Contract'}
            onChange={name => updateContract({ name })}
          />

          <IconBtn data-tip="Remove contract" onClick={deleteContract}>
            <Trash2 size={16} />
          </IconBtn>
          <IconBtn
            data-tip="Data Source Template"
            active={isTemplate}
            onClick={() => updateContract({ isTemplate: !isTemplate })}
            disabled={metadataLoading}
          >
            <Files size={16} />
          </IconBtn>
          <ReactTooltip />
        </div>
        {!isTemplate && (
          <>
            <span className="address">
              {addresses[CHAIN_ID]}
              <EtherscanLink href={`https://etherscan.io/address/${addresses[CHAIN_ID]}`} target="etherscan" />
            </span>
            {metadataLoading ? <span>Fetching contract metadata...</span> : null}
            {startBlocks[CHAIN_ID] ? (
              <span className="address">Deployed on block {startBlocks[CHAIN_ID]}</span>
            ) : null}
          </>
        )}
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
        </StatusContainer>
      </Header>
      {compileError ? (
        <ErrorState>
          Please fix all compiler errors in the schema and mapping files before managing events
        </ErrorState>
      ) : null}
      {parseABIError && <ErrorState>Error parsing ABI: {parseABIError}</ErrorState>}

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
              setJumpToLine={setJumpToLine}
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
              setJumpToLine={setJumpToLine}
            />
          )}

          <NewEventBtnContainer>
            <ActionButton
              disabled={!contractHasEvents}
              onClick={() => setNewEvent({ show: true, signature: '' })}
              {...(contractHasEvents
                ? {}
                : {
                    disabled: true,
                    title: 'Contract has no events defined',
                  })}
            >
              <Plus size={12} style={{ marginRight: 4 }} />
              New
            </ActionButton>
          </NewEventBtnContainer>
        </EventHandlerContainer>
      ) : null}
    </Root>
  )
}
