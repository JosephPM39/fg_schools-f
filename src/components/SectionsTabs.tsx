import * as React from 'react';
import { IProm, ITitle, IGroup } from '../api/models_school';
import { Tabs } from '../containers/Tabs';
import { ApiContext } from '../context/ApiContext';

interface Params {
  proms: IProm[]
}

interface Section {
  promId?: IProm['id']
  title?: ITitle
  group?: IGroup
}

export const SectionsTabs = (params: Params) => {
  const [sections, setSections] = React.useState<Array<Section>>([])
  const [list, setList] = React.useState<Array<{label: string, content: JSX.Element}>>([])
  const api = React.useContext(ApiContext)

  React.useEffect(() => {
    const getData = async () => {
      const sectionsBuilt = await Promise.all(
        params.proms.map(
          async (prom) => ({
            promId: prom.id,
            title: await api?.useTitle.findOne({id: prom.titleId}),
            group: await api?.useGroup.findOne({id: prom.groupId})
          })
        )
      )
      if (sectionsBuilt) {
        setSections(sectionsBuilt)
      }
    }
    if (sections?.length < 1) getData()
  })

  React.useEffect(() => {
    const getSection = (prom: IProm) => {
      return sections.find((s) => s.promId === prom.id)
    }

    const getSectionName = (section?: Section) => {
      return `${section?.title?.name} - ${section?.group?.name}`
    }

    const fillTabsData = () => {
      return params.proms.map((prom) => ({
        label: getSectionName(getSection(prom)),
        content: <>{prom.id}</>
      }))
    }
    const res = fillTabsData()
    setList(res)
  }, [sections, params.proms])

  return <Tabs data={list} orientation='vertical' idPrefix='sections' />
}

