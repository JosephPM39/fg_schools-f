import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { IBaseModel } from "../../api/models_school/base.model"

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
  onSelect: (select?: T) => void
  list: Array<T>
  defaultValue?: T['id']
  valueBy?: keyof T
  size?: 'small' | 'medium'
}

type Params<T extends IBaseModel> = BaseParams<T> & (WithFormat<T> | WithProp<T>)

function isWithProp<T extends IBaseModel>(p: Params<T>): p is BaseParams<T> & WithProp<T> {
  return typeof (p as BaseParams<T> & WithProp<T>).itemNameBy !== 'undefined'
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
    size
  } = params
  const [selected, setSelected] = useState<T>()
  console.log('geting name')

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
        defaultValue={defaultValue}
        value={defaultId(selected?.[valueBy]) ?? ''}
        label={`&#8288;${title}`}
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-${id}-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {list.map(
          (item, index) => <MenuItem
            value={String(item[valueBy])}
            key={`menu-item-${id}-${index}`}
          >
            {getItemName(item)}
          </MenuItem>
        )}
        <MenuItem value='new' key={`menu-item-${id}-new`}>
          Nuevo
        </MenuItem>
      </Select>
    </FormControl>
  )
}
