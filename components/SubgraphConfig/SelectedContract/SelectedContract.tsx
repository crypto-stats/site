import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { SingleValue } from 'react-select'
import { Plus, Trash2, Edit, Search } from 'lucide-react'

import { Contract, Event } from 'hooks/local-subgraphs'
import { SolidSvg } from 'components/layouts'
import { Dropdown } from '../../atoms'

const Root = styled.div`
  margin-bottom: 24px;
  font-size: 12px;

  .delete-link {
    &:hover {
      cursor: pointer;
    }
  }
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
    display: flex;
    justify-content: space-between;
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

const EventRow = styled.div`
  display: flex;
  margin-bottom: -1px;
  align-items: center;
  border-top: 1px solid #979797;
  border-bottom: 1px solid #979797;
  width: 100%;

  > .actionBtnsContainer {
    display: flex;
    justify-content: space-between;
    color: #979797;
    min-width: 60px;
    padding: 0px 12px;

    > svg {
      &:hover {
        cursor: pointer;
      }
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
  color: #0477f4;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  width: fit-content;
  font-weight: bold;
`

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const formatGroupLabel = (data: any) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
  </div>
)

const CHAIN_ID = 1

interface SelectedContractProps {
  contract: Contract & { errorMessage?: string }
  deleteContract: (address: string) => void
  fnExtractionLoading: boolean
  mappingFunctionNames: string[]
  updateContract: (address: string, newProps: any) => void
}

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

export const SelectedContract = (props: SelectedContractProps) => {
  const {
    contract: { addresses, name, source, errorMessage, abi, startBlocks, events },
    updateContract,
    mappingFunctionNames,
    fnExtractionLoading,
    deleteContract,
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const eventsFromAbi = abi ? parseEventsFromAbi(abi) : []
  const contractHasEvents = eventsFromAbi.length > 0
  const eventsFromAbiSelectOptions = eventsFromAbi.map(efa => ({
    label: efa,
    value: efa,
  }))
  const getMappingFunctionsSelectOptions = (id: number) => {
    const eventName = eventHandlers[id].signature.split('(')[0].replace(' ', '')

    return [
      {
        label: 'Create new',
        options: [{ label: `handle${eventName}(event ${eventName})`, value: 'newFunction' }],
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
  const [eventHandlers, setEventHandlers] = useState<Event[]>([{ signature: '', handler: '' }])

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

  const deleteEventHandler = (idx: number) =>
    setEventHandlers(prev => prev.filter((_, i) => idx !== i))

  const showUploadButton = errorMessage || source === 'custom'

  return (
    <Root>
      <Header>
        <div className="top">
          <span className="contract-title">{name || 'No name'}</span>
          <a className="delete-link" onClick={() => deleteContract(addresses[CHAIN_ID])}>
            <SolidSvg path="/Icon/ico-xmark.svg" width={'18px'} height={'18px'} color="#999999" />
          </a>
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
          <EventRow key={idx}>
            <Dropdown
              value={eventsFromAbiSelectOptions.find(efa => efa.value === eh.signature)}
              name="signature"
              onChange={handleSelectOptionChange(idx, 'signature')}
              options={eventsFromAbiSelectOptions}
              placeholder="Choose event"
            />
            <Dropdown
              isDisabled={!eventHandlers[idx].signature}
              isSearchable
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: () => null,
                ...(fnExtractionLoading && { DropdownIndicator: () => null }),
              }}
              value={getMappingFunctionsSelectOptions(idx)
                .reduce((acc: any[], { options }) => [...acc, ...options], [])
                .find(mfs => mfs.value === eh.handler)}
              name="handler"
              onChange={handleSelectOptionChange(idx, 'handler')}
              options={getMappingFunctionsSelectOptions(idx)}
              isLoading={fnExtractionLoading}
              formatGroupLabel={formatGroupLabel}
              placeholder="Declare event handler function"
            />
            <div className="actionBtnsContainer">
              <Search size={12} />
              <Edit size={12} />
              <Trash2 size={12} onClick={() => deleteEventHandler(idx)} />
            </div>
          </EventRow>
        ))}

        <NewEventBtnContainer>
          <ActionButton
            disabled={!contractHasEvents}
            onClick={() => setEventHandlers(prev => [...prev, { signature: '', handler: '' }])}
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
