import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { BaseTable } from './../../BaseDataTable/BaseTable'
import { useCombo } from '../../../hooks/api/store/useCombo'
import { ComboFormModal } from '../forms/ComboFormModal'
import { ICombo } from '../../../api/models_school'
import { IconButton } from '@mui/material'
import { OpenInFull } from '@mui/icons-material'
import { useState } from 'react'

import { Dialog, DialogParams } from '../../../containers/Dialog'
import { BtnContainer, BtnPropsContainer, NoBtnContainer } from '../../../containers/types'
import { TableProductCombo } from './TableProductCombo'

type Params = {
  comboId: ICombo['id']
} & Omit<DialogParams, 'children'> & (BtnContainer | BtnPropsContainer | NoBtnContainer)

export const ProductsDialog = (params: Params) => {
  const { comboId, ...dialogParams } = params
  return <Dialog {...dialogParams}>
    <TableProductCombo comboId={comboId} />
  </Dialog>
}

export const TableCombo = () => {
  const useCombos = useCombo()
  const [rowSelected, setRowSelected] = useState<GridRenderCellParams<any, ICombo>>()
  const [openProducts, setOpenProducts] = useState<boolean>(false)

  const ProductsButton = (p: GridRenderCellParams<any, ICombo>) => {
    const onClick = () => {
      setRowSelected(p)
      setOpenProducts(true)
    }
    return <IconButton onClick={onClick} color='primary'>
      <OpenInFull />
    </IconButton>
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      type: 'string',
      disableExport: true,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Nombre',
      type: 'string',
      flex: 1
    },
    {
      field: 'products',
      headerName: 'Productos',
      type: 'actions',
      disableExport: true,
      renderCell: (p: GridRenderCellParams<any, ICombo>) => <ProductsButton {...p} />,
      width: 65
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean'
    }
  ]

  return <>
    <ProductsDialog
      noButton
      state={[openProducts, setOpenProducts]}
      title={`Productos del combo: ${rowSelected?.row.name ?? 'Cargando...'}`}
      comboId={rowSelected?.row.id}
    />
    <BaseTable
      FormModal={ComboFormModal}
      hook={useCombos}
      name='Colores'
      columns={columns}
    />
  </>
}
