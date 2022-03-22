import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'react-feather'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  display: flex;
`

const BaseButton = styled.button`
  border: none;
  padding: var(--spaces-2) var(--spaces-3);
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 14px;
  outline: none;

  &:hover {
    background-color: #3390fa;
  }
`

const PrimaryButton = styled(BaseButton)<{ full: boolean }>`
  font-family: 'Inter';
  display: flex;
  border-radius: 4px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 17px;
  transition: 150ms ease;

  ${({ full }) =>
    full
      ? ''
      : `
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  `}
`

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 43px;
  left: 0;
  right: 0;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  border-bottom-left-radius: 4px;
`

const DropdownButtonElement = styled(BaseButton)``

const DropdownArrow = styled(BaseButton)`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left: solid 1px #3390fa;
`

interface Option {
  label: string
  value: string
  onClick: () => void
}

interface DropdownButtonProps {
  options: Option[]
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ options }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const hasMultiple = options.length > 1

  useEffect(() => {
    if (dropdownOpen) {
      const listener = () => setDropdownOpen(false)
      window.document.body.addEventListener('click', listener)
      return () => window.document.body.removeEventListener('click', listener)
    }
  }, [dropdownOpen])

  if (options.length === 0) {
    return null
  }

  return (
    <Container>
      <PrimaryButton full={!hasMultiple} onClick={options[0].onClick}>
        {options[0].label}
      </PrimaryButton>
      {hasMultiple && (
        <DropdownArrow onClick={() => setDropdownOpen(!dropdownOpen)}>
          <ChevronDown />
        </DropdownArrow>
      )}
      {dropdownOpen && (
        <Dropdown>
          {options.slice(1).map((option: Option) => (
            <DropdownButtonElement key={option.value} onClick={option.onClick}>
              {option.label}
            </DropdownButtonElement>
          ))}
        </Dropdown>
      )}
    </Container>
  )
}

export default DropdownButton
