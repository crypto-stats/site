import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface InputFieldProps {
  name: string
  value: string
  onChange: (val: string) => void
  className?: string
  disabled?: boolean
  placeholder?: string
}

const InputField = (props: InputFieldProps) => {
  const { name, value, onChange, disabled, className, placeholder } = props
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
        disabled={disabled}
      />
    )
  }

  return (
    <input
      value={value}
      className={className}
      onChange={(e: any) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder || name}
    />
  )
}

export default InputField
