import { ISchool, ISchoolProm, ISectionProm } from '../../api/models_school'
import { SectionsTabs } from './SectionsTabs'
import { Modal } from '../../containers/Modal'
import { useContext, useEffect, useState } from 'react'
import { SectionPromContext } from '../../context/api/schools'
import { BtnPropsContainer } from '../../containers/types'
import { SectionPromFormModal } from './forms/SectionPromFormModal'
import { Button } from '@mui/material'

interface Params {
  initOpen: boolean
  schoolProm: ISchoolProm
  school?: ISchool | null
  btnProps: BtnPropsContainer['btnProps']
}

export const SectionsModal = (params: Params) => {
  const {
    schoolProm,
    school
  } = params
  const [proms, setProms] = useState<ISectionProm[]>([])
  const useSectionProm = useContext(SectionPromContext)

  useEffect(() => {
    const getData = async () => {
      const res = await useSectionProm?.findBy({
        schoolPromId: schoolProm.id
      })
      setProms(res ?? [])
    }
    void getData()
  }, [params.schoolProm, proms.length])

  return (
    <Modal
      fullScreen
      btnProps={params.btnProps}
      title={`Escuela: ${school?.name ?? 'Cargando...'}`}
      actionsToolbar={<SectionPromFormModal btn={
        <Button variant='contained' color='info'> Agregar Sección </Button>
      } schoolId={school?.id} />}
    >
      <SectionsTabs sectionProms={proms} />
    </Modal>
  )
}
