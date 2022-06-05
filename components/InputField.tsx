import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface InputFieldProps {
  name: string
  value: string
  onChange: (val: string | any) => void
  // it's better to pass in the whole event, not only the value in case we need other props from the event
  // this is here for backward compatibility
  overrideOnChange?: boolean
  className?: string
  disabled?: boolean
  placeholder?: string
}

const InputField = (props: InputFieldProps) => {
  const {
    name,
    value,
    onChange,
    disabled,
    className,
    placeholder,
    overrideOnChange = false,
  } = props

  if (name.toLowerCase().indexOf('date') !== -1) {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={value && value.length > 0 ? new Date(value) : null}
        className={className}
        onChange={(date: Date) => {
          const pad = (num: number) => num.toString().padStart(2, '0')
          onChange([date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-'))
        }}
        name={name}
        disabled={disabled}
      />
    )
  }

  return (
    <input
      value={value}
      className={className}
      onChange={overrideOnChange ? onChange : (e: any) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      name={name}
    />
  )
}

export default InputField
