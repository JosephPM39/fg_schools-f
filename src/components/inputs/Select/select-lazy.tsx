import { MouseEvent, useEffect, useState } from 'react'
import { IBaseModel } from '../../../api/models_school/base.model'
import { useDebounce } from '../../../hooks/useDebouce'
import { useNearScreen } from '../../../hooks/useNearScreen'
import { Select } from './select'
import { LazyOption, SelectLazyParams } from './types'
import { MenuItem, MenuItemProps } from '@mui/material'

function isFunctionItemLabel<
  T extends IBaseModel,
  KV extends keyof T
> (item: SelectLazyParams<T, KV>['itemLabelBy']): item is ((item: T) => string | Promise<string>) {
  return !!(typeof item === 'function')
}

export const SelectLazy = <
  T extends IBaseModel = IBaseModel,
  KV extends keyof T = 'id'
>(params: SelectLazyParams<T, KV>) => {
  const {
    hook,
    paginate,
    onChange: extOnChange,
    defaultValue: dvId,
    omitCreateOption,
    itemLabelBy,
    itemValueBy = 'id',
    onCreate,
    ...selectParams
  } = params

  const [options, setOptions] = useState<Array<LazyOption<T, KV>>>([])
  const [optionSelected, setOptionSelected] = useState<LazyOption<T, KV> | null>()
  const [defaultValue, setDefaulValue] = useState<LazyOption<T, KV>>()
  const [items, setItems] = useState<T[]>([])
  const { debounce } = useDebounce()

  useEffect(() => {
    const getData = async () => {
      if (defaultValue) return
      if (!dvId) return
      console.log(dvId, 'default value')
      const res = await hook.findOne({ id: dvId })
      if (!res) return
      console.log('setting')
      const value: LazyOption<T, KV> = {
        label: await getLabel(res, itemLabelBy),
        value: res[itemValueBy] as T[KV],
        index: 0
      }
      setDefaulValue(value)
      setOptions([...options, value])
      return setOptionSelected(value)
    }
    void getData()
  }, [options, defaultValue])

  useEffect(() => {
    const getData = async () => {
      const op: Array<LazyOption<T, KV>> = await Promise.all(items.map(async (item, index) => {
        return {
          label: await getLabel(item, itemLabelBy),
          value: item[itemValueBy] as T[KV],
          index
        }
      }))
      const rest = ((paginate?.count ?? hook.metadata?.count ?? 0) - op.length)
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
    }
    void getData()
  }, [items])

  useEffect(() => {
    if (dvId && !defaultValue) return
    setItems(hook.data)
  }, [hook.data, dvId, defaultValue])

  useEffect(() => {
    if (optionSelected?.value === 'new') return
    if (optionSelected?.value === 'loader') return
    if (!optionSelected?.value) return
    if (!extOnChange) return
    const ext = async () => {
      const item = await hook.findOne({ [itemValueBy]: optionSelected.value })
      extOnChange(item ?? undefined)
    }
    void ext()
  }, [optionSelected])

  const getLabel = async (item: T, itemLabelBy: SelectLazyParams<T, KV>['itemLabelBy']): Promise<string> => {
    if (isFunctionItemLabel(itemLabelBy)) {
      return await itemLabelBy(item)
    }
    return String(item[itemLabelBy])
  }

  const newOp: LazyOption<T, KV> = {
    label: 'Nuevo',
    value: 'new',
    index: -1
  }

  const RenderOption = (props: { option: LazyOption<T, KV> } & MenuItemProps) => {
    const { option } = props
    const { element, show } = useNearScreen()
    useEffect(() => {
      if (!show) return
      if (option.value !== 'loader') return
      debounce(() => {
        if (paginate) return paginate.next()
        return hook.launchNextFetch()
      }, 100)
    }, [show])

    const onClick = (e: MouseEvent<HTMLLIElement>) => {
      if (option.value === 'new') {
        e.preventDefault()
        if (!onCreate) return
        return onCreate()
      }
      if (option.value === 'loader') {
        e.preventDefault()
        return
      }
      if (props.onClick) {
        props.onClick(e)
      }
    }
    return <MenuItem {...props} ref={element} onClick={onClick} />
  }

  return <Select<T, KV, LazyOption<T, KV>>
    {...selectParams}
    onChange={(op) => {
      setOptionSelected(op)
    }}
    defaultValue={defaultValue}
    options={options}
    renderOption={RenderOption}
  />
}
