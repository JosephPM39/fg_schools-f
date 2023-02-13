import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { ITitle } from "../../api/models_school"

interface params {
  onSelect: (select?: ITitle) => void
  list: Array<ITitle>
  defaultValue?: ITitle['id']
}


export const SelectTitle = ({onSelect, defaultValue, list}: params) => {
  const [title, setTitle] = useState<ITitle | undefined>()

  useEffect(() => {
    onSelect(title)
  }, [title])

  const find = (id: ITitle['id']) => {
    if (!id) return undefined
    return list.find((e) => e.id === id)
  }

  const handleChange = (e: SelectChangeEvent) => {
    const titleFinded = find(e.target.value as ITitle['id'])
    setTitle(titleFinded)
  }

  const defaultId = (id: ITitle['id']) => {
    const ep = find(id)
    if (ep?.id) return ep.id
    if (title && !find(title.id)) setTitle(undefined)
    return ''
  }

  return (
    <FormControl fullWidth size='small'>
      <InputLabel id="title-select-label">&#8288;Título</InputLabel>
      <Select
        fullWidth
        labelId="title-select-label"
        id="title-select"
        name='title_id'
        value={defaultId(defaultValue) ?? ''}
        label="&#8288;Título"
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-title-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {list.map(
          (title, index) => <MenuItem
            value={title.id}
            key={`menu-item-title-${index}`}
          >
            {title.name}
          </MenuItem>
        )}
        <MenuItem value='new' key={`menu-item-title-new`}>
          Nuevo
        </MenuItem>
      </Select>
    </FormControl>
  )
}
