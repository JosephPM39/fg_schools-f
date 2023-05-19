import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { ISectionProm } from '../../../api/models_school'
import { useSectionProm } from '../../../hooks/api/schools/useSectionProm'
import { SelectGroup } from './SelectGroup'
import { SelectTitle } from './SelectTitle'

interface Params {
  idForUpdate?: ISectionProm['id']
  // schoolPromId: ISchoolProm['id']
}

export const SectionInputs = (params: Params) => {
  const { idForUpdate } = params
  // const [titleList, setTitleList] = useState<Array<ITitle>>([])
  // const [groupList, setGroupList] = useState<Array<IGroup>>([])
  // const [titleSelected, setTitleSelected] = useState<ITitle>()
  // const [groupSelected, setGroupSelected] = useState<IGroup>()
  const [sectionSelected, setSectionSelected] = useState<ISectionProm | null>(null)
  const useSectionProms = useSectionProm()

  useEffect(() => {
    if (idForUpdate) {
      void useSectionProms.findOne({ id: idForUpdate }).then((res) => {
        setSectionSelected(res)
      })
    }
  }, [useSectionProms.data, idForUpdate])

  /* useEffect(() => {
    const getData = async () => {
      const sections = await useSectionProms.findBy({ schoolPromId: schoolPromId })
      if (!sections) return
      const groups: Array<IGroup> = []
      const titles: Array<ITitle> = []

      sections.forEach((section) => {
        useTitles.findOne({id: section.titleId}).then((res) => {
          if (!res) return
          titles.push(res)
        })
        useGroups.findOne({id: section.groupId}).then((res) => {
          if (!res) return
          groups.push(res)
        })
      })

      setGroupList(groups)
      setTitleList(titles)
    }
    getData()
  }, [idForUpdate, schoolPromId, useTitles.data, useGroups.data, useSectionProms.data])
  */

  /* const onSelectTitle = (title?: ITitle) => {
    // setTitleSelected(title)
  }

  const onSelectGroup = (group?: IGroup) => {
    // setGroupSelected(group)
  } */

  return <div>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <SelectTitle
          defaultValue={sectionSelected?.titleId}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectGroup
          defaultValue={sectionSelected?.groupId}
        />
      </Grid>
    </Grid>
  </div>
}
