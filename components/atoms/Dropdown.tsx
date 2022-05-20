import Select, { CSSObjectWithLabel, GroupBase, Props } from 'react-select'

const getStylesObject = (styles: { [key: string]: CSSObjectWithLabel } = {}) => ({
  container: (provided: any) => ({
    ...provided,
    ...(styles.container ?? {}),
  }),
  control: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    backgroundColor: 'inherit',
    border: `1px var(--color-dark-800)`,
    minHeight: 'fit-content',
    ...(state.isFocused && {
      borderRadius: '0px',
    }),
    ...(styles.control ?? {}),
  }),
  group: (provided: any) => ({ ...provided, padding: '12px 0px', ...(styles.group ?? {}) }),
  groupHeading: (provided: any) => ({
    ...provided,
    textTransform: 'inherit',
    color: '#d3d3d3',
    padding: '0px 8px',
    ...(styles.groupHeading ?? {}),
  }),
  input: (provided: any) => ({
    ...provided,
    padding: 0,
    margin: 0,
    color: 'var(--color-white)',
    ...(styles.input ?? {}),
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: '#252528',
    color: 'var(--color-white)',
    width: 'max-content',
    minWidth: '100%',
    padding: 0,
    ...(styles.menuList ?? {}),
  }),
  option: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    ...(state.isFocused && { backgroundColor: '#0477f4', cursor: 'pointer' }),
    ...(styles.option ?? {}),
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--color-white)',
    ...(styles.singleValue ?? {}),
  }),
  indicatorsContainer: () => ({
    '&:hover': { color: 'var(--color-white)' },
    ...(styles.indicatorsContainer ?? {}),
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '10px 8px',
    ...(styles.valueContainer ?? {}),
  }),
})

export function Dropdown<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  customStyles,
  ...props
}: Props<Option, IsMulti, Group> & { customStyles: { [key: string]: CSSObjectWithLabel } }) {
  return (
    <Select
      components={{ IndicatorSeparator: () => null }}
      {...props}
      styles={getStylesObject(customStyles)}
    />
  )
}
