import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { IEmployeePosition } from "../../api/models_school"
import { PositionType } from "../../api/models_school/schools/position.model"

interface params {
  onSelect?: (selected?: IEmployeePosition) => void
  list: IEmployeePosition[]
  type: PositionType
}

export const SelectEmployeePosition = (params: params) => {
  const { onSelect = () => {}, list, type } = params
  const [selected, setSelected] = useState<IEmployeePosition>()

  useEffect(() => {
    onSelect(selected)
  }, [selected, onSelect])

  const find = (id: IEmployeePosition['id']) => {
    return list.find((e) => e.id === id)
  }

  const findEPName = (id: IEmployeePosition['id']) => {
    const ep = find(id)
    if (!ep) return 'Desconocido'
    return `${ep.employee?.profesion} ${ep.employee?.firstName} ${ep.employee?.lastName} (${ep?.position?.name})`
  }

  const handleChange = (e: SelectChangeEvent) => {
    const ep = find(e.target.value as IEmployeePosition['id'])
    setSelected(ep)
    onSelect(ep)
  }

  const getLabel = () => {
    if (type === PositionType.PRINCIPAL) return 'Director'
    if (type === PositionType.PROFESOR) return 'Docente'
    return 'Encargado'
  }

  const defaultId = (id: IEmployeePosition['id']) => {
    const ep = find(id)
    if (ep?.id) return ep.id
    if (selected && !find(selected.id)) setSelected(undefined)
    return ''
  }

  return (
    <FormControl required fullWidth>
      <InputLabel id="ep-select-label">&#8288;{getLabel()}</InputLabel>
      <Select
        fullWidth
        labelId="ep-select-label"
        id="ep-select"
        name="employee_position_id"
        value={defaultId(selected?.id)}
        label={getLabel()}
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-ep-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {list.map(
          (ep, index) => <MenuItem
            value={ep.id}
            key={`menu-item-ep-${index}`}
          >
            {findEPName(ep.id)}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}
