import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { IGroup } from "../../api/models_school"

interface params {
  onSelect: (select?: IGroup) => void
  list: Array<IGroup>
  defaultValue?: IGroup['id']
}


export const SelectGroup = ({onSelect, defaultValue, list}: params) => {
  const [group, setGroup] = useState<IGroup | undefined>()

  useEffect(() => {
    onSelect(group)
  }, [group])

  const find = (id: IGroup['id']) => {
    if (!id) return undefined
    return list.find((e) => e.id === id)
  }

  const handleChange = (e: SelectChangeEvent) => {
    const groupFinded = find(e.target.value as IGroup['id'])
    setGroup(groupFinded)
  }

  const defaultId = (id: IGroup['id']) => {
    const ep = find(id)
    if (ep?.id) return ep.id
    if (group && !find(group.id)) setGroup(undefined)
    return ''
  }

  return (
    <FormControl fullWidth size='small'>
      <InputLabel id="group-select-label">&#8288;Grupo</InputLabel>
      <Select
        fullWidth
        labelId="group-select-label"
        id="group-select"
        name='group_id'
        value={defaultId(defaultValue) ?? ''}
        label="&#8288;Grupo"
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-group-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {list.map(
          (group, index) => <MenuItem
            value={group.id}
            key={`menu-item-group-${index}`}
          >
            {group.name}
          </MenuItem>
        )}
        <MenuItem value='new' key={`menu-item-group-new`}>
          Nuevo
        </MenuItem>
      </Select>
    </FormControl>
  )
}
