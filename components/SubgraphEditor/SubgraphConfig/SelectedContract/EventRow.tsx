import styled from 'styled-components'
import { Trash2, Search } from 'lucide-react'
import ReactTooltip from 'react-tooltip'
import { Dropdown } from '../../../atoms'
import { ContractEvent, DEFAULT_MAPPING } from 'hooks/local-subgraphs'
import { useEditorState, EDITOR_TYPES } from 'hooks/editor-state'

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
      color: #6f6f6f;
    }
  }

  > .disabled {
    color: #424242;
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

interface ReceiptIconProps {
  size: number
  onClick: () => void
  className: string
  tooltip?: string
}

const ReceiptIcon: React.FC<ReceiptIconProps> = ({ size, onClick, className, tooltip }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={size}
    height={size}
    fill="currentColor"
    onClick={onClick}
    className={className}
    data-tip={tooltip}
    style={{ outline: 'none' }}>
    <path
      d="M128,0C57.313,0,0,57.313,0,128v384l0,0h32l32-32l32,32h32l32-32l32,32h32l32-32l32,32h32l32-32l32,32V128
      C384,57.313,441.313,0,512,0H128z M352,128v306.75L306.75,480h-5.5L256,434.719L210.75,480h-5.5L160,434.75L114.75,480h-5.5
      L64,434.75l-32,32V128c0-52.938,43.063-96,96-96h256.063C363.938,58.75,352,92,352,128z M64,320h160v32H64V320z M64,256h160v32H64
      V256z M64,192h160v32H64V192z M320,352h-32v-32h32V352z M320,288h-32v-32h32V288z M320,224h-32v-32h32V224z"
    />
  </svg>
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
  setJumpToLine: React.Dispatch<React.SetStateAction<string | null>>
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
    setJumpToLine,
  } = props

  const [, setTab] = useEditorState(EDITOR_TYPES['subgraph-tab'], 'config')

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

  const selectedFnExists = mappingFns.indexOf(eventHandler.handler) !== -1

  const handleFnLookup = () => {
    setTab(DEFAULT_MAPPING)

    setJumpToLine(eventHandler.handler)
  }
  const toggleReceipt = () => handleUpdate({ ...eventHandler, receipt: !eventHandler.receipt })

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
        <Search
          size={16}
          {...(eventHandler.handler && selectedFnExists && { onClick: handleFnLookup })}
        />
        <Trash2 size={16} onClick={deleteEventHandler} className="delete" />
        <ReceiptIcon
          onClick={toggleReceipt}
          size={16}
          className={eventHandler.receipt ? 'enabled' : 'disabled'}
          tooltip={`${eventHandler.receipt ? 'Disable' : 'Enable'} transaction receipts`}
        />
        <ReactTooltip />
      </ActionBtnsContainer>
    </Root>
  )
}
