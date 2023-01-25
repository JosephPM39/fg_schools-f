import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { ISchoolProm } from "../../api/models_school"

interface params {
  onSelect: (selected?: ISchoolProm) => void
  list: ISchoolProm[]
}

export const SelectSchoolProm = (params: params) => {
  const { onSelect, list } = params
  const [selected, setSelected] = useState<ISchoolProm>()

  useEffect(() => {
    onSelect(selected)
  }, [selected, onSelect])

  const find = (id: ISchoolProm['id']) => {
    return list.find((e) => e.id === id)
  }

  const findSPName = (id: ISchoolProm['id']) => {
    const prom = find(id)
    if (!prom) return 'Desconocido'
    return `${prom.school?.name} (Código: ${prom.school?.code})`
  }

  const handleChange = (e: SelectChangeEvent) => {
    const prom = find(e.target.value as ISchoolProm['id'])
    setSelected(prom)
  }

  const defaultId = (id: ISchoolProm['id']) => {
    const ep = find(id)
    if (ep) return id
    if (selected && !find(selected.id)) setSelected(undefined)
    return ''
  }

  return (
    <FormControl required fullWidth>
      <InputLabel id="school-prom-select-label">&#8288;Escuela</InputLabel>
      <Select
        fullWidth
        labelId="school-prom-select-label"
        id="school-prom-select"
        value={defaultId(selected?.id)}
        label="&#8288;Escuela"
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-school-prom-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {list.map(
          (sp, index) => <MenuItem
            value={sp.id}
            key={`menu-item-school-prom-${index}`}
          >
            {findSPName(sp.id)}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}
