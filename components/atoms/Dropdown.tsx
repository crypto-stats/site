import Select, { GroupBase, Props } from 'react-select'

const customStyles = {
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
  input: (provided: any) => ({ ...provided, padding: 0, margin: 0, color: 'var(--color-white)' }),
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
  valueContainer: (provided: any) => ({ ...provided, padding: '10px 8px' }),
}

export function Dropdown<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ styles, ...props }: Props<Option, IsMulti, Group>) {
  return (
    <Select
      components={{ IndicatorSeparator: () => null }}
      styles={{ ...customStyles, ...styles }}
      {...props}
    />
  )
}
