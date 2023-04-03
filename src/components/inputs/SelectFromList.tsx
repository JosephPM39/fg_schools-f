import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useState } from 'react'
import { IBaseModel } from '../../api/models_school/base.model'
import { useDebounce } from '../../hooks/useDebouce'
import { useNearScreen } from '../../hooks/useNearScreen'

interface WithFormat<T extends IBaseModel> {
  itemNameFormat: (item: T) => string
}

interface WithProp<T extends IBaseModel> {
  itemNameBy: keyof T
}

interface BaseParams<T extends IBaseModel> {
  id: string
  title: string
  name: string
  omitCreateOption?: true
  onSelect: (select?: T) => void
  list: T[]
  defaultValue?: T['id']
  valueBy?: keyof T
  size?: 'small' | 'medium'
  paginationNext?: (params?: { offset?: number, limit?: number }) => void
  count: number
}

type Params<T extends IBaseModel> = BaseParams<T> & (WithFormat<T> | WithProp<T>)

function isWithProp<T extends IBaseModel> (p: Params<T>): p is BaseParams<T> & WithProp<T> {
  return typeof (p as BaseParams<T> & WithProp<T>).itemNameBy !== 'undefined'
}

interface ItemParams {
  valueId: string | 'loader' | 'new'
  key?: string
  children?: string
  index: number
}

export const SelectFromList = <T extends IBaseModel>(params: Params<T>) => {
  const {
    title,
    id,
    onSelect,
    list,
    defaultValue,
    valueBy = 'id' as keyof T,
    name,
    size,
    omitCreateOption,
    paginationNext = () => {},
    count
  } = params
  const [selected, setSelected] = useState<T>()
  const [items, setItems] = useState<JSX.Element[]>([])
  const { debounce } = useDebounce()

  const loadMore = (index: number) => {
    console.log('inited loadMore')
    if (index < (list.length - 1)) return
    paginationNext({
      offset: index,
      limit: 10
    })
  }

  const create = () => {

  }

  const Item = (params: ItemParams) => {
    const { valueId, key, children, index } = params
    const { show, element } = useNearScreen()

    useEffect(() => {
      console.log('value', valueId)
      if (!show) return
      if (valueId === 'loader') {
        console.log('loader')
        return debounce(() => loadMore(index), 500)
      }
      if (valueId === 'new') return create()
    }, [show, valueId, index])

    return (
      <MenuItem
        ref={element}
        value={valueId}
        key={`menu-item-${key ?? ''}`}
      >
        {children}
      </MenuItem>
    )
  }

  const getItemName = (item: T) => {
    if (isWithProp(params)) {
      return String(item[params.itemNameBy])
    }
    return params.itemNameFormat(item)
  }

  useEffect(() => {
    if (list.length < 1) return
    const itms: JSX.Element[] = []
    for (let i = 0; i < list.length; i++) {
      const item = list.at(i)
      itms.push(
        <Item
          valueId={String(item?.[valueBy])}
          key={`${id}-${i}`}
          index={i}
        >
          {(item) ? getItemName(item) : 'Cargando...'}
        </Item>
      )
    }
    if (list.length < count) {
      itms.push(
        <Item
          valueId={'loader'}
          key={`${id}-loader`}
          index={list.length}
        >
          {'Cargando...'}
        </Item>
      )
    }

    setItems(itms)
  }, [list, count, valueBy])

  useEffect(() => {
    onSelect(selected)
  }, [selected])

  const find = <K extends typeof valueBy>(prop: T[K]) => {
    if (!prop) return undefined
    return list.find((e) => e[valueBy] === prop)
  }

  const handleChange = (e: SelectChangeEvent) => {
    const item = find(e.target.value as T[typeof valueBy])
    setSelected(item)
  }

  const defaultId = <K extends typeof valueBy>(prop?: T[K]) => {
    if (!prop) return
    const item = find(prop)
    if (item?.[valueBy]) return String(item[valueBy])
    if (selected && !find(selected[valueBy])) setSelected(undefined)
    return ''
  }

  return (
    <FormControl fullWidth size={size}>
      <InputLabel id={`${id}-select-label`}>&#8288;{title}</InputLabel>
      <Select
        fullWidth
        labelId={`${id}-select-label`}
        id={`${id}-select`}
        name={name}
        defaultValue={defaultValue}
        MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
        value={defaultId(selected?.[valueBy]) ?? ''}
        label={`${title}`}
        onChange={handleChange}
        required
      >
        {!omitCreateOption && <MenuItem value='new' key={`menu-item-${id}-new`}>
          Nuevo
        </MenuItem>}
        <MenuItem value={''} key={`menu-item-${id}-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {items}
      </Select>
    </FormControl>
  )
}
