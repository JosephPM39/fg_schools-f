import { FormControl, InputLabel, MenuItem, MenuItemProps, Select as SelectM, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import { IBaseModel } from '../../../api/models_school/base.model'
import { LazyOption, Option, SelectParams } from './types'

export const Select = <
  T extends IBaseModel,
  KV extends keyof T = 'id',
  O extends Option<T> | LazyOption<T, KV> = Option<T>
>(params: SelectParams<T, KV, O>) => {
  const {
    id,
    name,
    label,
    defaultValue,
    onChange: onChangeExt,
    options,
    required
  } = params
  const [value, setValue] = useState<O | null>(null)

  const Render = (props: { option: O } & MenuItemProps) => {
    if (!params.renderOption) {
      return <MenuItem {...props}/>
    }
    return params.renderOption(props)
  }

  useEffect(() => {
    if (!defaultValue) return
    setValue(defaultValue)
  }, [])

  useEffect(() => {
    if (!onChangeExt) return
    onChangeExt(value)
  }, [value])

  const onChange = (e: SelectChangeEvent) => {
    const valueId = e.target.value
    const option = options.find((o) => o.value === valueId) ?? null
    setValue(option)
  }
  return (
    <FormControl fullWidth>
      <InputLabel id={`select-list-label-${id}`}>{label}</InputLabel>
      <SelectM
        labelId={`select-list-label-${id}`}
        id={`select-list-${id}`}
        value={String(value?.value ?? '')}
        name={name}
        label={label}
        required={required}
        onChange={onChange}
      >
        <MenuItem key='asdf' value="test">Test</MenuItem>
        {params.options.map((option: O, index) => <Render key={index} value={String(option.value)} children={option.label} option={option} />)}
      </SelectM>
    </FormControl>
  )
}
