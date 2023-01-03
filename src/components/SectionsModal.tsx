import * as React from 'react';
import { IProm } from '../api/models_school';
import { SchoolsCardData } from './types';
import { SectionsTabs } from './SectionsTabs';
import { Modal } from '../containers/Modal'

interface Params {
  initOpen: boolean,
  prom: IProm[],
  cardData?: SchoolsCardData
}

export const SectionsModal = (params: Params) => {
  if (!params.prom) return <></>

  return (
    <Modal fullScreen btnProps={{ children: 'Listados' }} title={`Escuela: ${params.cardData?.school?.name}`}>
      <SectionsTabs proms={params.prom} />
    </Modal>
  );
}
