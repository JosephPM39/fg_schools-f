import * as React from 'react';
import { Tabs } from '../containers/Tabs';
import { Modal } from '../containers/Modal'

export const SchoolFormModal = () => {
  const list = [
    {
      label: 'De años anteriores',
      content: <>'Años anteriores'</>
    },
    {
      label: 'Nueva',
      content: <>'escuela nueva'</>
    }
  ]
  return (
    <Modal btnLabel='Agregar escuela' title={`Agregar escuela`}>
      <Tabs data={list} orientation='horizontal' idPrefix='sections' />
    </Modal>
  );
}
