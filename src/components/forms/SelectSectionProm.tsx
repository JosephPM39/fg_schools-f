import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { CustomError, ErrorType } from "../../api/handlers/errors"
import { ISectionProm } from "../../api/models_school"
import { useGroup } from "../../hooks/api/schools/useGroup"
import { useTitle } from "../../hooks/api/schools/useTitle"

interface params {
  onSelect: (select?: ISectionProm) => void
  list: Array<ISectionProm>
  defaultValue?: ISectionProm['id']
}


export const SelectSectionProm = ({onSelect, defaultValue, list: defaultList}: params) => {
  const [section, setSection] = useState<ISectionProm | undefined>()
  const [list, setList] = useState<Array<ISectionProm>>([])
  const useTitles = useTitle()
  const useGroups = useGroup()

  useEffect(() => {
    onSelect(section)
  }, [section])

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all(defaultList.map(async (item) => {
        if (item.title && item.group) return item

        const title = await useTitles.findOne({ id: item.titleId })
        const group = await useGroups.findOne({ id: item.groupId})
        if (!title || !group) throw new CustomError(ErrorType.apiResponse, 'Api problems')
        return {
          ...item,
          title,
          group
        }
      }))
      setList(res)
    }
    getData()
  }, [defaultList, useTitles.data, useGroups.data])

  const find = (id: ISectionProm['id']) => {
    if (!id) return undefined
    return list.find((e) => e.id === id)
  }

  const handleChange = (e: SelectChangeEvent) => {
    const sectionFinded = find(e.target.value as ISectionProm['id'])
    setSection(sectionFinded)
  }

  const defaultId = (id: ISectionProm['id']) => {
    const ep = find(id)
    if (ep?.id) return ep.id
    if (section && !find(section.id)) setSection(undefined)
    return ''
  }

  return (
    <FormControl fullWidth size='small'>
      <InputLabel id="section-select-label">&#8288;Sección</InputLabel>
      <Select
        fullWidth
        labelId="section-select-label"
        id="section-select"
        name='section_id'
        defaultValue={defaultValue}
        value={defaultId(section?.id) ?? ''}
        label="&#8288;Sección"
        onChange={handleChange}
        required
      >
        <MenuItem value={''} key={`menu-item-section-null`}>
          {list.length < 1 ? 'No hay registros' : 'Sin seleccionar'}
        </MenuItem>
        {list.map(
          (section, index) => <MenuItem
            value={section.id}
            key={`menu-item-section-${index}`}
          >
            {section.title.name} {section.group.name}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}
