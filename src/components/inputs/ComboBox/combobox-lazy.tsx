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
    itemLabelBy, itemValueBy,
    omitCreateOption, onChange: extOnChange,
    hook, searchMaxLength,
    id, defaultValue: dvId, ...rest
  } = params
  const [options, setOptions] = useState<Array<LazyOption<T, KV>>>([])
  const [needNextPag, setNeedNextPag] = useState(false)
  const [optionSelected, setOptionSelected] = useState<LazyOption<T, KV> | null>()
  const [defaultValue, setDefaulValue] = useState<LazyOption<T, KV>>()
  const [searchValue, setSearchValue] = useState<string>('')
  const [items, setItems] = useState<T[]>([])
  const { debounce } = useDebounce()

  const RenderOption = ({ params, value }: { params: HTMLAttributes<HTMLLIElement>, value: LazyOption<T, KV> }) => {
    const { element, show } = useNearScreen()

    useEffect(() => {
      if (!show || value.value !== 'unloaded') return
      if (value.index < (items.length - 1)) return
      if ((value.index % 10) !== 0) return
      console.log({ limit: 10, offset: value.index }, 'fetching')
      hook.launchNextFetch({ limit: 10, offset: value.index })
    }, [show])

    const onClick = (e: MouseEvent<HTMLLIElement>) => {
      if (value.value === 'new') {
        return newOption()
      }
      if (value.value === 'load') {
        if (needNextPag) return
        return
        // return setNeedNextPag(true)
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
        setOptionSelected(value)
        return setDefaulValue(value)
      }

      if (searchValue === optionSelected?.label) return
      if (searchValue === newOp.label) return

      const searchBy: T = {
        [itemLabelBy]: `%${searchValue}%`
      } as unknown as T

      const isWithSearch = Object.keys(searchBy).length > 0

      if (!isWithSearch || searchValue.length < 1) {
        await hook.fetch({})
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
    const frest = rest > 0 ? rest : 0
    console.log(frest, 'length res', op.length)
    const fill: Array<LazyOption<T, KV>> = Array.from(new Array(frest)).map((_, index) => ({
      label: 'Cargando...',
      value: 'unloaded',
      index: (index + op.length)
    }))
    if (omitCreateOption) {
      return setOptions([...op, ...fill])
    }
    return setOptions([newOp, ...op, ...fill])
  }, [items])

  useEffect(() => {
    if (dvId && !defaultValue) return
    setItems(hook.data)
  }, [hook.data])

  useEffect(() => {
    if (optionSelected?.value === 'new') return
    if (optionSelected?.value === 'unloaded') return
    extOnChange(optionSelected?.value)
  }, [optionSelected])

  useEffect(() => {
    if (!needNextPag) return
    console.log('cargar mas')
    // hook.launchNextFetch()
    setNeedNextPag(false)
  }, [needNextPag])

  const newOption = () => {
    console.log('nuevo')
  }

  const onChangeCB = (op: LazyOption<T, KV> | null) => {
    setOptionSelected(op)
  }

  const onSearch = (search: string) => {
    debounce(() => setSearchValue(search), 500)
  }

  return <ComboBox<T, KV, LazyOption<T, KV>>
    onChange={onChangeCB}
    onSearch={onSearch}
    renderOption={(p, v) => {
      console.log(v.index, ' ? ', v.value)
      return <RenderOption key={v.index} params={p} value={v}/>
    }}
    searchMaxLength={searchMaxLength}
    defaultValue={defaultValue}
    options={options}
    id={`lazy-${id}`}
    {...rest}
  />
}
