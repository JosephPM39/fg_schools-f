import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { IBaseModel } from '../../../api/models_school/base.model'
import { ByOperator } from '../../../api/validations/query'
import { useBase } from '../../../hooks/api/useBase'

interface Option<T extends IBaseModel> {
  label: string
  value: T['id']
}

interface Params<
  T extends IBaseModel,
  KV extends keyof T = 'id',
  O extends Option<T> | LazyOption<T, KV> = Option<T>
> {
  id: string
  label: string
  options: O[]
  size?: 'small' | 'medium'
  onToggleOpen?: (open: boolean) => void
  onChange: (op: O | null) => void
  onSearch: (s: string) => void
  searchMaxLength?: number
}

export const ComboBox = <
  T extends IBaseModel = IBaseModel,
  KV extends keyof T = 'id',
  O extends Option<T> | LazyOption<T, KV> = Option<T>
>(params: Params<T, KV, O>) => {
  const { options, id, label, size, onToggleOpen = () => {} } = params
  const { onChange: extOnChange, onSearch, searchMaxLength } = params
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<O | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')

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

  return <Autocomplete
    value={value}
    onChange={onChange}
    inputValue={searchValue}
    onInputChange={onSearchValueChange}
    isOptionEqualToValue={(o, v) => o.label === v.label}
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
          maxLength: searchMaxLength ?? 254
        }}
      />
    )}
  />
}

interface LazyOption<T extends IBaseModel, KV extends keyof T = 'id'> {
  label: string
  id: T[KV] | 'new' | 'load'
  index: number
}

interface LazyParams<T extends IBaseModel, KV extends keyof T = 'id'>
  extends Omit<Params<T>, 'options' | 'onToggleOpen' | 'onChange' | 'onSearch'> {
  itemLabelBy: keyof T
  itemValueBy: KV
  onChange: (item?: T[KV]) => void
  defaultValue: T[KV]
  omitCreateOption?: true
  hook: ReturnType<typeof useBase<T>>
}

export const ComboBoxLazy = <
  T extends IBaseModel = IBaseModel,
  KV extends keyof T = 'id'
>(params: LazyParams<T, KV>) => {
  const { id, label, size } = params
  const { itemLabelBy, itemValueBy } = params
  const { onChange: extOnChange, hook, searchMaxLength } = params
  const [options, setOptions] = useState<Array<LazyOption<T, KV>>>([])
  const [needNextPag, setNeedNextPag] = useState(false)
  const [optionSelected, setOptionSelected] = useState<LazyOption<T, KV> | null>()
  const [searchValue, setSearchValue] = useState<string>('')
  const [items, setItems] = useState<T[]>([])

  useEffect(() => {
    if (searchValue === optionSelected?.label) return

    const searchBy: T = {
      [itemLabelBy]: searchValue
    } as unknown as T

    const isWithSearch = Object.keys(searchBy).length > 0

    if (!isWithSearch || searchValue.length < 1) {
      void hook.fetch({}).then((res) => {
        if (!res.data) return
        setItems(res.data)
      })
      return
    }

    const conf = {
      searchBy,
      query: { byoperator: ByOperator.like }
    }

    void hook.fetch(conf).then((res) => {
      const op = res.data?.map((item, index): LazyOption<T, KV> => {
        return {
          label: String(item[itemLabelBy]),
          id: item[itemValueBy],
          index
        }
      })
      if (!op) return
      setOptions(op)
    })
  }, [searchValue])

  useEffect(() => {
    const op = items.map((item, index): LazyOption<T, KV> => {
      return {
        label: String(item[itemLabelBy]),
        id: item[itemValueBy],
        index
      }
    })
    setOptions(op)
  }, [items])

  useEffect(() => {
    if (optionSelected?.id === 'new') return
    if (optionSelected?.id === 'load') return
    extOnChange(optionSelected?.id)
  }, [optionSelected])

  const newOption = () => {

  }

  const onChangeCB = (op: LazyOption<T, KV> | null) => {
    if (op?.id === 'new') {
      return newOption()
    }
    if (op?.id === 'load') {
      if (needNextPag) return
      return setNeedNextPag(true)
    }
    setOptionSelected(op)
  }

  const onSearch = (search: string) => {
    setSearchValue(search)
  }

  return <ComboBox<T, KV, LazyOption<T, KV>>
    onChange={onChangeCB}
    onSearch={onSearch}
    searchMaxLength={searchMaxLength}
    options={options}
    id={`lazy-${id}`}
    label={label}
    size={size}
  />
}
