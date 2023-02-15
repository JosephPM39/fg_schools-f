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
    name,
    size
  } = params
  const [selected, setSelected] = useState<T>()

  const getItemName = (item: T) => {
    if (isWithProp(params)) {
      return String(item[params.itemNameBy])
    }
    return params.itemNameFormat(item)
  }

  useEffect(() => {
    onSelect(selected)
  }, [selected])

  const find = (id: T['id']) => {
    if (!id) return undefined
    return list.find((e) => e.id === id)
  }

  const handleChange = (e: SelectChangeEvent) => {
    const item = find(e.target.value as T['id'])
    setSelected(item)
  }

  const defaultId = (id: T['id']) => {
    const ep = find(id)
    if (ep?.id) return ep.id
    if (selected && !find(selected.id)) setSelected(undefined)
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
        value={defaultId(selected?.id) ?? ''}
        label={`&#8288;${title}`}
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-${id}-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {list.map(
          (item, index) => <MenuItem
            value={item.id}
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
