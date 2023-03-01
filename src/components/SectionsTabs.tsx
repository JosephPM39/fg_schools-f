import { Box, Typography } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { ITitle, IGroup, ISectionProm } from '../api/models_school';
import { OrderType } from '../api/models_school/store/order.model';
import { Tabs } from '../containers/Tabs';
import { GroupContext, TitleContext } from '../context/api/schools';
import { Orders } from './Orders';

interface Params {
  sectionProms: ISectionProm[]
}

interface Section {
  sectionPromId?: ISectionProm['id']
  title?: ITitle
  group?: IGroup
}

export const SectionsTabs = (params: Params) => {
  const [sections, setSections] = useState<Array<Section>>([])
  const [list, setList] = useState<Array<{label: string, content: JSX.Element}>>([])
  const useTitle = useContext(TitleContext)
  const useGroup = useContext(GroupContext)

  useEffect(() => {
    const getData = async () => {
      const sectionsBuilt = await Promise.all(
        params.sectionProms.map(
          async (prom) => ({
            sectionPromId: prom.id,
            title: await useTitle?.findOne({id: prom.titleId}) ?? undefined,
            group: await useGroup?.findOne({id: prom.groupId}) ?? undefined
          })
        )
      )
      if (sectionsBuilt) {
        setSections(sectionsBuilt)
      }
    }
    getData()
  }, [useGroup, useTitle, useGroup?.data?.length, useTitle?.data?.length, params.sectionProms])

  useEffect(() => {
    const getSection = (prom: ISectionProm) => {
      return sections.find((s) => s.sectionPromId === prom.id)
    }

    const getSectionName = (section?: Section) => {
      const title = section?.title?.name
      const group = section?.group?.name
      if (!title || !group) return 'cargando...'
      return `${title} - ${group}`
    }

    const fillTabsData = () => {
      return params.sectionProms.map((prom) => ({
        label: getSectionName(getSection(prom)),
        content: <Orders sectionPromId={prom.id} type={OrderType.SCHOOL} />
      }))
    }
    const res = fillTabsData()
    setList(res)
  }, [sections, params.sectionProms])

  if (params.sectionProms.length < 1) {
    return <Box display='flex' width='100%' height='100%' justifyContent='center' alignItems='stretch'>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <Typography variant='h5'>Sin secciones</Typography>
        <Typography variant='subtitle1'>Agregue (o habilite) una</Typography>
      </Box>
    </Box>
  }

  return <Tabs data={list} orientation='horizontal' idPrefix='sections' />
}

