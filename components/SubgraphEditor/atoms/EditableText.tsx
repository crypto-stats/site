import { useOnClickOutside } from 'hooks'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

const commonStyles = css`
  color: var(--color-white);
  font-size: 14px;
  padding: 1px 2px;
  font-family: 'Inter', sans-serif;
`

const Display = styled.div`
  ${commonStyles}
  border: solid 1px transparent;

  &:hover {
    background: rgb(63 66 70 / 50%);
  }
`

const InputField = styled.input`
  ${commonStyles}
  border: solid 1px #979797;
  background: transparent;
  outline: none;
`

interface EditableTextProps {
  value: string
  onChange: (newVal: string) => void
  className?: string
  tag?: React.ElementType
}

const EditableText: React.FC<EditableTextProps> = ({ value, className, tag = 'div', onChange }) => {
  const [currentValue, setValue] = useState(value)
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const save = () => {
    if (currentValue !== value) {
      onChange(currentValue)
    }
    setEditing(false)
  }

  useEffect(() => setValue(value), [value])

  useLayoutEffect(() => {
    if (editing && ref.current) {
      ref.current.select()
    }
  }, [editing])

  useOnClickOutside(ref, save)

  if (editing) {
    return (
      <InputField
        ref={ref}
        autoFocus
        value={currentValue}
        onChange={e => setValue(e.target.value)}
        className={className}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            save()
          }
        }}
      />
    )
  }

  return (
    <Display as={tag} className={className} onClick={() => setEditing(true)}>
      {currentValue}
    </Display>
  )
}

export default EditableText
