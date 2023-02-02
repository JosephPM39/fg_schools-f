import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { ISchoolProm } from "../../api/models_school"

interface params {
  onSelect?: (selected?: ISchoolProm) => void
  list: ISchoolProm[]
}

export const SelectSchoolProm = (params: params) => {
  const { onSelect = () => {}, list } = params
  const [selected, setSelected] = useState<ISchoolProm>()

  useEffect(() => {
    onSelect(selected)
  }, [selected, onSelect])

  const find = (id: ISchoolProm['schoolId']) => {
    return list.find((e) => e.schoolId === id)
  }

  const findSPName = (id: ISchoolProm['schoolId']) => {
    const prom = find(id)
    if (!prom) return 'Desconocido'
    return `${prom.school?.name} (Código: ${prom.school?.code})`
  }

  const handleChange = (e: SelectChangeEvent) => {
    const prom = find(e.target.value as ISchoolProm['schoolId'])
    setSelected(prom)
  }

  const defaultId = (id: ISchoolProm['schoolId']) => {
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
        name="school_id"
        value={defaultId(selected?.schoolId)}
        label="&#8288;Escuela"
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-school-prom-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {list.map(
          (sp, index) => <MenuItem
            value={sp.schoolId}
            key={`menu-item-school-prom-${index}`}
          >
            {findSPName(sp.schoolId)}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}
