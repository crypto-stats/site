import styled from 'styled-components'
import { Trash2, Search } from 'lucide-react'
import { Dropdown } from '../../../atoms'
import { ContractEvent } from 'hooks/local-subgraphs'

const Root = styled.div`
  display: flex;
  margin-bottom: -1px;
  align-items: center;
  border-top: 1px solid #979797;
  border-bottom: 1px solid #979797;
  width: 100%;
`

const ActionBtnsContainer = styled.div<{ editing?: boolean }>`
  display: flex;
  justify-content: ${({ editing }) => (editing ? 'center' : 'space-between')};
  color: var(--color-primary);
  min-width: 60px;
  padding: 0px 12px;

  > svg {
    &:hover {
      cursor: pointer;
    }
  }

  > .delete {
    color: #ff0000;
  }
`

const customStyles = {
  container: { width: 'calc(50% - 8px - 14px)', borderRight: '1px solid #979797' },
}

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

interface EventRowProps {
  handleUpdate: (newEvent: ContractEvent) => void
  createMappingFn: (fnName: string, eventName: string) => void
  deleteEventHandler: () => void
  eventHandler: ContractEvent
  fnExtractionLoading: boolean
  eventsOptions: { label: string; value: string }[]
  mappingFns: string[]
  eventName: string
}

export const EventRow = (props: EventRowProps) => {
  const {
    handleUpdate,
    createMappingFn,
    deleteEventHandler,
    eventHandler,
    eventsOptions,
    fnExtractionLoading,
    mappingFns,
    eventName,
  } = props

  const newFnNameTemplate = `handle${eventName}`
  const fnOccurrenceCount = mappingFns.filter(mfn => mfn.includes(newFnNameTemplate)).length
  const newFnName =
    fnOccurrenceCount === 0 ? newFnNameTemplate : `${newFnNameTemplate}${fnOccurrenceCount + 1}`

  const mappingFnsOptions = [
    {
      label: 'Create new',
      options: [{ label: newFnName, value: newFnName }],
    },
    {
      label: 'Map to existing functions',
      options: mappingFns.map(mfn => ({
        label: mfn,
        value: mfn,
      })),
    },
  ]

  return (
    <Root>
      <Dropdown
        customStyles={customStyles}
        value={{ label: eventHandler.signature, value: eventHandler.signature }}
        name="signature"
        onChange={newVal => handleUpdate({ ...eventHandler, signature: newVal!.label })}
        options={eventsOptions}
        placeholder="Choose event"
      />
      <Dropdown
        customStyles={customStyles}
        isDisabled={!eventHandler.signature}
        isSearchable
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: () => null,
          ...(fnExtractionLoading && { DropdownIndicator: () => null }),
        }}
        value={mappingFnsOptions
          .reduce((acc: any[], { options }) => [...acc, ...options], [])
          .find(mfs => mfs.value === eventHandler.handler)}
        name="handler"
        onChange={newVal => {
          if (newVal!.label == newFnName) {
            createMappingFn(newFnName, eventName)
          }
          handleUpdate({ ...eventHandler, handler: newVal!.label })
        }}
        options={mappingFnsOptions}
        isLoading={fnExtractionLoading}
        formatGroupLabel={formatGroupLabel}
        placeholder="Declare event handler function"
      />
      <ActionBtnsContainer>
        <Search size={16} />
        <Trash2 size={16} onClick={deleteEventHandler} className="delete" />
      </ActionBtnsContainer>
    </Root>
  )
}
