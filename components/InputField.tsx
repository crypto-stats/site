import React from 'react'
import DatePicker from 'react-datepicker'
import { CryptoStatsSDK } from '@cryptostats/sdk'
import 'react-datepicker/dist/react-datepicker.css'

interface InputFieldProps {
  name: string
  value: string
  onChange: (val: string) => void
  className?: string
  disabled?: boolean
}

const dateLib = (new CryptoStatsSDK()).date

const InputField: React.FC<InputFieldProps> = ({ name, value, onChange, disabled, className }) => {
  if (name.toLowerCase().indexOf('date') !== -1) {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={value && value.length > 0 ? new Date(value) : null}
        className={className}
        onChange={(date: Date) => onChange(dateLib.formatDate(date))}
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
      placeholder={name}
    />
  )
}

export default InputField
