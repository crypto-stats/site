import Select, { GroupBase, Props } from 'react-select'

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: 'calc(50% - 8px - 14px)',
    borderRight: '1px solid #979797',
  }),
  control: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    backgroundColor: 'inherit',
    border: `1px var(--color-dark-800)`,
    minHeight: 'fit-content',
    ...(state.isFocused && {
      borderRadius: '0px',
    }),
  }),
  group: (provided: any) => ({ ...provided, padding: '12px 0px' }),
  groupHeading: (provided: any) => ({
    ...provided,
    textTransform: 'inherit',
    color: '#d3d3d3',
    padding: '0px 8px',
  }),
  input: (provided: any) => ({ ...provided, padding: 0, margin: 0 }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#252528',
    color: 'var(--color-white)',
    width: 'max-content',
    minWidth: '100%',
    padding: 0,
  }),
  option: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    ...(state.isFocused && { backgroundColor: '#0477f4', cursor: 'pointer' }),
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--color-white)',
  }),
  indicatorsContainer: () => ({ '&:hover': { color: 'var(--color-white)' } }),
  indicatorContainer: (provided: any) => ({ ...provided, padding: '0px 8px' }),
  valueContainer: (provided: any) => ({ ...provided, padding: '8px' }),
}

export function Dropdown<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  const { value, onChange, options, name, placeholder } = props

  return (
    <Select
      components={{ IndicatorSeparator: () => null }}
      value={value}
      name={name}
      onChange={onChange}
      options={options}
      styles={customStyles}
      placeholder={placeholder}
      {...props}
    />
  )
}
