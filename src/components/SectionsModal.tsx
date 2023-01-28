import { ISchoolProm, ISectionProm } from '../api/models_school';
import { SchoolsCardData } from './types';
import { SectionsTabs } from './SectionsTabs';
import { BtnProps, Modal } from '../containers/Modal'
import { useContext, useEffect, useState } from 'react';
import { SectionPromContext } from '../context/api/schools';

interface Params {
  initOpen: boolean,
  schoolProm: ISchoolProm,
  cardData?: SchoolsCardData
  btnProps: BtnProps['btnProps']
}

export const SectionsModal = (params: Params) => {
  const [proms, setProms] = useState<Array<ISectionProm>>([])
  const useSectionProm = useContext(SectionPromContext)

  useEffect(() => {
    const getData = async () => {
      const res = await useSectionProm?.findBy({
        schoolPromId: params.schoolProm.id
      })
      if (res && res?.length > 0) setProms(res)
    }
    if (proms.length < 1) getData()
  }, [params.schoolProm.id, proms.length, useSectionProm?.data])

  return (
    <Modal fullScreen btnProps={params.btnProps} title={`Escuela: ${params.cardData?.school?.name}`}>
      <SectionsTabs sectionProms={proms} />
    </Modal>
  );
}
