import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { IBaseModel } from "../../api/models_school/base.model"
import { useNearScreen } from "../../hooks/useNearScreen"

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
  list: Array<T>
  defaultValue?: T['id']
  valueBy?: keyof T
  size?: 'small' | 'medium'
  paginationNext: () => void
  count: number
}

type Params<T extends IBaseModel> = BaseParams<T> & (WithFormat<T> | WithProp<T>)

function isWithProp<T extends IBaseModel>(p: Params<T>): p is BaseParams<T> & WithProp<T> {
  return typeof (p as BaseParams<T> & WithProp<T>).itemNameBy !== 'undefined'
}

interface ItemParams {
  value?: string,
  key?: string
  children?: string
  paginationNext?: () => void
}

const Item = (params: ItemParams) => {
  const { value, key, children, paginationNext } = params
  const { show, element } = useNearScreen()

  useEffect(() => {
    if (!show || value) return
    if (!paginationNext) return
    paginationNext()
  }, [show])

  return (
    <MenuItem
      ref={element}
      value={value ?? ''}
      key={`menu-item-${key}`}
    >
      {children}
    </MenuItem>
  )
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
    paginationNext,
    count
  } = params
  const [selected, setSelected] = useState<T>()
  const [items, setItems] = useState<Array<JSX.Element>>([])

  useEffect(() => {
    const itms: Array<JSX.Element> = []
    for (let i = 0; i < count; i++) {
      const item = list.at(i)
      itms.push(
        <Item
          value={String(item?.[valueBy])}
          key={`${id}-${i}`}
          paginationNext={paginationNext}
        >
          {item ? getItemName(item) : 'Cargando...'}
        </Item>
      )
    }
    setItems(itms)
  }, [list, count])

  const getItemName = (item: T) => {
    if (isWithProp(params)) {
      return String(item[params.itemNameBy])
    }
    return params.itemNameFormat(item)
  }

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
    if (selected && !find(selected[valueBy as keyof T])) setSelected(undefined)
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
        MenuProps={{ PaperProps: { sx: { maxHeight: 250 }} }}
        defaultValue={defaultValue}
        value={defaultId(selected?.[valueBy]) ?? ''}
        label={`${title}`}
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-${id}-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {items}
        {!omitCreateOption && <MenuItem value='new' key={`menu-item-${id}-new`}>
          Nuevo
        </MenuItem>}
      </Select>
    </FormControl>
  )
}
