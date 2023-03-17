import { HTMLAttributes, MouseEvent, useEffect, useState } from 'react'
import { IBaseModel } from '../../../api/models_school/base.model'
import { ByOperator } from '../../../api/validations/query'
import { useDebounce } from '../../../hooks/useDebouce'
import { useNearScreen } from '../../../hooks/useNearScreen'
import { ComboBox } from './combobox'
import { LazyParams, LazyOption } from './types'

export const ComboBoxLazy = <
  T extends IBaseModel = IBaseModel,
  KV extends keyof T = 'id'
>(params: LazyParams<T, KV>) => {
  const {
    itemLabelBy, itemValueBy = 'id' as KV,
    omitCreateOption, onChange: extOnChange,
    hook, searchMaxLength, onCreacte,
    id, defaultValue: dvId, ...rest
  } = params
  const [options, setOptions] = useState<Array<LazyOption<T, KV>>>([])
  const [optionSelected, setOptionSelected] = useState<LazyOption<T, KV> | null>()
  const [defaultValue, setDefaulValue] = useState<LazyOption<T, KV>>()
  const [searchValue, setSearchValue] = useState<string>('')
  const [items, setItems] = useState<T[]>([])
  const { debounce } = useDebounce()

  const RenderOption = ({ params, value }: { params: HTMLAttributes<HTMLLIElement>, value: LazyOption<T, KV> }) => {
    const { element, show } = useNearScreen()

    useEffect(() => {
      if (!show) return
      if (value.value !== 'loader') return
      debounce(() => hook.launchNextFetch(), 100)
    }, [show, value])

    const onClick = (e: MouseEvent<HTMLLIElement>) => {
      if (value.value === 'new') {
        if (!onCreacte) return
        return onCreacte()
      }
      if (value.value === 'loader') {
        return
      }
      if (params.onClick) return params?.onClick(e)
    }

    return <li ref={element} {...params} onClick={onClick}>
      {value.label}
    </li>
  }

  const newOp: LazyOption<T, KV> = {
    label: 'Nuevo',
    value: 'new',
    index: -1
  }

  useEffect(() => {
    const getData = async () => {
      if (searchValue === optionSelected?.label) return
      if (searchValue === newOp.label) return

      if (dvId && !defaultValue) {
        console.log(dvId, 'default value')
        const res = await hook.findOne({ id: dvId })
        if (!res) return
        console.log('setting')
        const value: LazyOption<T, KV> = {
          label: String(res[itemLabelBy]),
          value: res[itemValueBy],
          index: 0
        }
        setDefaulValue(value)
        setOptions([...options, value])
        return setOptionSelected(value)
      }

      console.log(searchValue.length, 'length', searchValue)

      const searchBy: T = {
        [itemLabelBy]: `%${searchValue}%`
      } as unknown as T

      const isWithSearch = searchValue.length > 0

      if (!isWithSearch) {
        return await hook.fetch({})
      }

      const conf = {
        searchBy,
        query: { byoperator: ByOperator.like }
      }

      await hook.fetch(conf)
    }
    void getData()
  }, [searchValue, dvId])

  useEffect(() => {
    const op = items.map((item, index): LazyOption<T, KV> => {
      return {
        label: String(item[itemLabelBy]),
        value: item[itemValueBy],
        index
      }
    })
    const rest = ((hook.metadata?.count ?? 0) - op.length)
    const fill: LazyOption<T, KV> = ({
      label: 'Cargando...',
      value: 'loader',
      index: (op.length + 1)
    })
    if (omitCreateOption && rest < 1) {
      return setOptions(op)
    }
    if (omitCreateOption) {
      return setOptions([...op, fill])
    }
    if (rest < 1) return setOptions([newOp, ...op])
    return setOptions([newOp, ...op, fill])
  }, [items])

  useEffect(() => {
    if (dvId && !defaultValue) return
    setItems(hook.data)
  }, [hook.data, dvId, defaultValue])

  useEffect(() => {
    if (optionSelected?.value === 'new') return
    if (optionSelected?.value === 'loader') return
    if (!extOnChange) return
    extOnChange(optionSelected?.value)
  }, [optionSelected])

  const onChangeCB = (op: LazyOption<T, KV> | null) => {
    setOptionSelected(op)
  }

  const onSearch = (search: string) => {
    if (search === searchValue) return
    debounce(() => setSearchValue(search), 500)
  }

  return <ComboBox<T, KV, LazyOption<T, KV>>
    onChange={onChangeCB}
    onSearch={onSearch}
    renderOption={(p, v) => {
      return <RenderOption key={v.index} params={p} value={v}/>
    }}
    searchMaxLength={searchMaxLength}
    defaultValue={defaultValue}
    options={options}
    id={`lazy-${id}`}
    {...rest}
  />
}
