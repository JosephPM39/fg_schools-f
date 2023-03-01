import { Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { CustomError, ErrorType } from "../../api/handlers/errors"
import { IGroup, ISchoolProm, ISectionProm, ITitle } from "../../api/models_school"
import { useGroup } from "../../hooks/api/schools/useGroup"
import { useSectionProm } from "../../hooks/api/schools/useSectionProm"
import { useTitle } from "../../hooks/api/schools/useTitle"
import { SelectGroup } from "./SelectGroup"
import { SelectTitle } from "./SelectTitle"

interface Params {
  idForUpdate?: ISectionProm['id']
  // schoolPromId: ISchoolProm['id']
}

export const SectionInputs = (params: Params) => {
  const {idForUpdate} = params
  // const [titleList, setTitleList] = useState<Array<ITitle>>([])
  // const [groupList, setGroupList] = useState<Array<IGroup>>([])
  const [titleSelected, setTitleSelected] = useState<ITitle>()
  const [groupSelected, setGroupSelected] = useState<IGroup>()
  const [sectionSelected, setSectionSelected] = useState<ISectionProm | null>(null)

  const useTitles = useTitle()
  const useGroups = useGroup()
  const useSectionProms = useSectionProm()

  useEffect(() => {
    if (idForUpdate) {
      useSectionProms.findOne({ id: idForUpdate }).then((res) => {
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

  const onSelectTitle = (title?: ITitle) => {
    setTitleSelected(title)
  }

  const onSelectGroup = (group?: IGroup) => {
    setGroupSelected(group)
  }

  return <div>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <SelectTitle
          defaultValue={sectionSelected?.titleId}
          list={useTitles.data}
          onSelect={onSelectTitle}
          count={useTitles.metadata?.count ?? 0}
          paginationNext={useTitles.launchNextFetch}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectGroup
          defaultValue={sectionSelected?.groupId}
          list={useGroups.data}
          onSelect={onSelectGroup}
          count={useGroups.metadata?.count ?? 0}
          paginationNext={useGroups.launchNextFetch}
        />
      </Grid>
    </Grid>
  </div>
}
