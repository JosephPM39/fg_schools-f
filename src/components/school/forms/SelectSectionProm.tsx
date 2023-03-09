import { useEffect, useState } from 'react'
import { ISectionProm, ITitle, IGroup } from '../../../api/models_school'
import { useGroup } from '../../../hooks/api/schools/useGroup'
import { useTitle } from '../../../hooks/api/schools/useTitle'
import { SelectFromList } from '../../inputs/SelectFromList'

interface Params {
  onSelect: (select?: ISectionProm) => void
  list: ISectionProm[]
  defaultValue?: ISectionProm['id']
  paginationNext: (p: { limit: number, offset: number }) => void
  count: number
}

export const SelectSectionProm = (params: Params) => {
  const {
    onSelect,
    defaultValue,
    list: defaultList,
    paginationNext,
    count
  } = params
  const [list, setList] = useState<ISectionProm[]>([])
  const useTitles = useTitle()
  const useGroups = useGroup()

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all(defaultList.map(async (item): Promise<ISectionProm> => {
        if (item.title && item.group) return item

        const title = await useTitles.findOne({ id: item.titleId }) ?? {}
        const group = await useGroups.findOne({ id: item.groupId }) ?? {}
        return {
          ...item,
          title: title as ITitle,
          group: group as IGroup
        }
      }))
      setList(res)
    }
    void getData()
  }, [defaultList, useTitles.data, useGroups.data])

  const nameFormat = (section: ISectionProm) => {
    return `${section.title.name} - ${section.group.name}`
  }

  return <SelectFromList
    id="section-prom"
    name="section_prom_id"
    title="Sección"
    itemNameFormat={nameFormat}
    paginationNext={paginationNext}
    count={count}
    list={list}
    defaultValue={defaultValue}
    onSelect={onSelect}
  />
}
