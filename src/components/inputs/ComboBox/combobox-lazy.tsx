import { useEffect, useState } from 'react'
import { IBaseModel } from '../../../api/models_school/base.model'
import { ByOperator } from '../../../api/validations/query'
import { ComboBox } from './combobox'
import { LazyParams, LazyOption } from './types'

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
