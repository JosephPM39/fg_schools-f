import { ISchool, ISchoolProm, ISectionProm } from '../../api/models_school';
import { SchoolsCardData } from '../types';
import { SectionsTabs } from './SectionsTabs';
import { Modal } from '../../containers/Modal'
import { useContext, useEffect, useState } from 'react';
import { SectionPromContext } from '../../context/api/schools';
import { BtnPropsContainer } from '../../containers/types';
import { SectionPromFormModal } from './forms/SectionPromFormModal';
import { Button } from '@mui/material';

interface Params {
  initOpen: boolean,
  schoolPromId: ISchoolProm['id'],
  school?: ISchool | null,
  btnProps: BtnPropsContainer['btnProps']
}

export const SectionsModal = (params: Params) => {
  const [proms, setProms] = useState<Array<ISectionProm>>([])
  const useSectionProm = useContext(SectionPromContext)

  useEffect(() => {
    const getData = async () => {
      const res = await useSectionProm?.findBy({
        schoolPromId: params.schoolPromId
      })
      if (res && res?.length > 0) setProms(res)
    }
    if (proms.length < 1) getData()
  }, [params.schoolPromId, proms.length, useSectionProm?.data])

  return (
    <Modal
      fullScreen
      btnProps={params.btnProps}
      title={`Escuela: ${params?.school?.name}`}
      actionsToolbar={<SectionPromFormModal btn={
        <Button variant='contained' color='info'> Agregar Sección </Button>
      } schoolId={params?.school?.id} />}
    >
      <SectionsTabs sectionProms={proms} />
    </Modal>
  );
}
