import { useEffect, useState } from "react"
import { CustomError, ErrorType } from "../../api/handlers/errors"
import { ISectionProm } from "../../api/models_school"
import { useGroup } from "../../hooks/api/schools/useGroup"
import { useTitle } from "../../hooks/api/schools/useTitle"
import { SelectFromList } from "../inputs/SelectFromList"

interface params {
  onSelect: (select?: ISectionProm) => void
  list: Array<ISectionProm>
  defaultValue?: ISectionProm['id']
}


export const SelectSectionProm = ({onSelect, defaultValue, list: defaultList}: params) => {
  const [list, setList] = useState<Array<ISectionProm>>([])
  const useTitles = useTitle()
  const useGroups = useGroup()

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

  const nameFormat = (section: ISectionProm) => {
    return `${section.title.name} - ${section.group.name}`
  }

  return <SelectFromList
    id="section-prom"
    name="section_prom_id"
    title="Sección"
    itemNameFormat={nameFormat}
    list={list}
    defaultValue={defaultValue}
    onSelect={onSelect}
  />
}
