import { ISchoolProm, ISectionProm } from '../api/models_school';
import { SchoolsCardData } from './types';
import { SectionsTabs } from './SectionsTabs';
import { Modal } from '../containers/Modal'
import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../context/ApiContext';

interface Params {
  initOpen: boolean,
  schoolProm: ISchoolProm,
  cardData?: SchoolsCardData
}

export const SectionsModal = (params: Params) => {
  const [proms, setProms] = useState<Array<ISectionProm>>([])
  const useSectionProm = useContext(ApiContext)?.useSectionProm

  useEffect(() => {
    const getData = async () => {
      const res = await useSectionProm?.findBy({
        schoolPromId: params.schoolProm.id
      })
      if (res && res?.length > 0) setProms(res)
    }
    if (proms.length < 1) getData()
  }, [params.schoolProm.id, proms, useSectionProm])

  if (proms.length < 1) return <>Without data</>

  return (
    <Modal fullScreen btnProps={{ children: 'Listados' }} title={`Escuela: ${params.cardData?.school?.name}`}>
      <SectionsTabs sectionProms={proms} />
    </Modal>
  );
}
