import styled from 'styled-components'
import { Trash2, Edit, Search, Check } from 'lucide-react'

import { Dropdown } from '../../../atoms'
import { EventHandler } from './SelectedContract'
import { SingleValue } from 'react-select'

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
  deleteEventHandler: () => void
  eventHandler: EventHandler
  eventsOptions: {
    label: string
    value: string
  }[]
  fnExtractionLoading: boolean
  handleSelectOptionChange: (key: 'signature' | 'handler') => (
    newValue: SingleValue<{
      label: string
      value: string
    }>
  ) => void
  mappingFnsOptions: {
    label: string
    options: {
      label: string
      value: string
    }[]
  }[]
  saveEventHandler: () => void
  toggleEditing: () => void
}

export const EventRow = (props: EventRowProps) => {
  const {
    deleteEventHandler,
    eventHandler,
    eventsOptions,
    fnExtractionLoading,
    handleSelectOptionChange,
    mappingFnsOptions,
    saveEventHandler,
    toggleEditing,
  } = props

  return (
    <Root>
      <Dropdown
        customStyles={customStyles}
        isDisabled={!eventHandler.editing}
        value={eventsOptions.find(efa => efa.value === eventHandler.signature)}
        name="signature"
        onChange={handleSelectOptionChange('signature')}
        options={eventsOptions}
        placeholder="Choose event"
      />
      <Dropdown
        customStyles={customStyles}
        isDisabled={!eventHandler.signature || !eventHandler.editing}
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
        onChange={handleSelectOptionChange('handler')}
        options={mappingFnsOptions}
        isLoading={fnExtractionLoading}
        formatGroupLabel={formatGroupLabel}
        placeholder="Declare event handler function"
      />
      <ActionBtnsContainer editing={eventHandler.editing}>
        {eventHandler.editing ? (
          <Check size={16} color="#ffffff" onClick={saveEventHandler} />
        ) : (
          <>
            <Search size={16} />
            <Edit size={16} onClick={toggleEditing} />
            <Trash2 size={16} onClick={deleteEventHandler} className="delete" />
          </>
        )}
      </ActionBtnsContainer>
    </Root>
  )
}
