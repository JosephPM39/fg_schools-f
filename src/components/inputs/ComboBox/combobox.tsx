import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { IBaseModel } from '../../../api/models_school/base.model'
import { isLazyOption, LazyOption, Option, Params } from './types'

export const ComboBox = <
  T extends IBaseModel = IBaseModel,
  KV extends keyof T = 'id',
  O extends Option<T> | LazyOption<T, KV> = Option<T>
>(params: Params<T, KV, O>) => {
  const { options, id, label, size, name, onToggleOpen = () => {}, isLoading, required } = params
  const { onChange: extOnChange, onSearch, searchMaxLength, defaultValue, renderOption } = params
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<O | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (!defaultValue || isLoading) return
    setValue(defaultValue)
  }, [defaultValue, isLoading])

  useEffect(() => {
    onToggleOpen(open)
  }, [open])

  useEffect(() => {
    if (!extOnChange) return
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

  const isOptionEqualToValue = (option: O, value: O) => {
    const label = option.label === value.label
    const dataValue = option.value === value.value
    // console.log('O: ', option, ' V: ', value)
    if (isLazyOption<T, KV>(option) && isLazyOption<T, KV>(value)) {
      const index = option.index === value.index
      /* console.log({
        label,
        dataValue,
        index
      }) */
      return label && index && dataValue
    }
    console.log({
      label,
      dataValue
    })
    return label && dataValue
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
      defaultValue={defaultValue}
      isOptionEqualToValue={isOptionEqualToValue}
      renderOption={renderOption}
      loading={isLoading}
      loadingText='Cargando...'
      ListboxProps={{
        role: 'list-box'
      }}
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
          required={required}
          inputProps={{
            ...p.inputProps,
            maxLength: searchMaxLength ?? 254
          }}
        />
      )}
    />
  </>
}
