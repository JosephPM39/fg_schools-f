import * as React from 'react';
import { ITitle, IGroup, ISectionProm } from '../api/models_school';
import { Tabs } from '../containers/Tabs';
import { GroupContext, TitleContext } from '../context/api/schools';

interface Params {
  sectionProms: ISectionProm[]
}

interface Section {
  sectionPromId?: ISectionProm['id']
  title?: ITitle
  group?: IGroup
}

export const SectionsTabs = (params: Params) => {
  const [sections, setSections] = React.useState<Array<Section>>([])
  const [list, setList] = React.useState<Array<{label: string, content: JSX.Element}>>([])
  const useTitle = React.useContext(TitleContext)
  const useGroup = React.useContext(GroupContext)

  React.useEffect(() => {
    const getData = async () => {
      const sectionsBuilt = await Promise.all(
        params.sectionProms.map(
          async (prom) => ({
            sectionPromId: prom.id,
            title: await useTitle?.findOne({id: prom.titleId}),
            group: await useGroup?.findOne({id: prom.groupId})
          })
        )
      )
      if (sectionsBuilt) {
        setSections(sectionsBuilt)
      }
    }
    getData()
  }, [useGroup, useTitle, useGroup?.data?.length, useTitle?.data?.length, params.sectionProms])

  React.useEffect(() => {
    const getSection = (prom: ISectionProm) => {
      return sections.find((s) => s.sectionPromId === prom.id)
    }

    const getSectionName = (section?: Section) => {
      return `${section?.title?.name} - ${section?.group?.name}`
    }

    const fillTabsData = () => {
      return params.sectionProms.map((prom) => ({
        label: getSectionName(getSection(prom)),
        content: <>{prom.id}</>
      }))
    }
    const res = fillTabsData()
    setList(res)
  }, [sections, params.sectionProms])

  return <Tabs data={list} orientation='vertical' idPrefix='sections' />
}

