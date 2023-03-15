import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { IBaseModel } from '../../../api/models_school/base.model'
import { LazyOption, Option, Params } from './types'

export const ComboBox = <
  T extends IBaseModel = IBaseModel,
  KV extends keyof T = 'id',
  O extends Option<T> | LazyOption<T, KV> = Option<T>
>(params: Params<T, KV, O>) => {
  const { options, id, label, size, name, onToggleOpen = () => {}, isLoading } = params
  const { onChange: extOnChange, onSearch, searchMaxLength, defaultValue, renderOption } = params
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<O | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (!defaultValue) return
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    onToggleOpen(open)
  }, [open])

  useEffect(() => {
    extOnChange(value)
  }, [value])

  useEffect(() => {
    onSearch(searchValue)
  }, [searchValue])

  const onChange = (_: any, newValue: O | null) => {
    setValue(newValue)
  }

  const onSearchValueChange = (_: any, newSearch: string) => {
    setSearchValue(newSearch)
  }

  return <>
    <input
      name={name}
      type='text'
      value={String(value?.value ?? '')}
      onChange={() => {}}
      hidden
    />
    <Autocomplete
      value={value}
      onChange={onChange}
      inputValue={searchValue}
      onInputChange={onSearchValueChange}
      isOptionEqualToValue={(o, v) => o.label === v.label}
      renderOption={renderOption}
      loading={isLoading}
      loadingText='Cargando...'
      ListboxProps={{
        role: 'list-box'
      }}
      disablePortal
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      size={size}
      id={`combobox-${id}`}
      renderInput={(p) => (
        <TextField
          {...p}
          label={label}
          inputProps={{
            ...p.inputProps,
            maxLength: searchMaxLength ?? 254
          }}
        />
      )}
    />
  </>
}
