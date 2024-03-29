import { GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { IOrder } from '../../../api/models_school'
import { OrderType } from '../../../api/models_school/store/order.model'
import { Dialog } from '../../../containers/Dialog'
import { TableOrder } from './TableOrder'
import { OnClickNestedParams } from './TableOrder/types'
import { TableOrderProducts } from './TableOrderProducts'
import { useGetComboPerOrders } from './TableOrder/useGetCombosPerOrder'
import { useOrder } from '../../../hooks/api/store/useOrder'
import { PaymentDialog } from './PaymentDialog'
import { Gallery } from '../../photos/Gallery'

type Params = {
  type: OrderType
  sectionPromId: NonNullable<IOrder['sectionPromId']>
}

const ComboDetails = (params: Partial<GridRenderCellParams<any, IOrder>>) => {
  const orderId = params?.row?.id
  const studentName = params.row?.student?.nickName
  const { isCustom, comboPerOrders } = useGetComboPerOrders(orderId)

  return <TableOrderProducts
    {...isCustom ? { orderId } : { comboId: comboPerOrders?.at(0)?.comboId }}
    studentName={studentName ?? ''}
  />
}

export const Orders = (params: Params) => {
  const useOrders = useOrder({ initFetch: false })
  const [orders, setOrders] = useState<IOrder[] | null>([])

  const [isLoading, setIsLoading] = useState(true)
  const [openCombos, setOpenCombos] = useState<boolean>(false)
  const [openPayments, setOpenPayments] = useState<boolean>(false)
  const [openPhotos, setOpenPhotos] = useState<boolean>(false)
  const [rowSelected, setRowSelected] = useState<GridRenderCellParams<any, IOrder>>()
  const [needRefresh, setNeedRefresh] = useState(true)

  useEffect(() => {
    if (!needRefresh) return
    void useOrders.fetch({ searchBy: { ...params } })
      .then((res) => {
        setOrders(res.data)
        setNeedRefresh(false)
      })
  }, [params, needRefresh])

  useEffect(() => {
    if (orders == null) return setIsLoading(false)
    const loading = orders.length < 1 || useOrders.needFetchNext
    setIsLoading(loading)
  }, [orders, useOrders.needFetchNext])

  const onClickNested = (p: OnClickNestedParams) => {
    if (p.field === 'combo') {
      setRowSelected(p.renderParams)
      setOpenCombos(true)
      return
    }

    if (p.field === 'payment') {
      setRowSelected(p.renderParams)
      setOpenPayments(true)
    }

    if (p.field === 'photo') {
      setRowSelected(p.renderParams)
      setOpenPhotos(true)
    }
  }

  useEffect(() => {
    if (openCombos) return
    setRowSelected(undefined)
  }, [openCombos])

  return <>
    <Dialog
      noButton
      title="Detalles del combo"
      state={[openCombos, setOpenCombos]}
      actions={{ omitCancel: true }}
    >
      <ComboDetails {...rowSelected} />
    </Dialog>
    <PaymentDialog
      noButton
      studentName={rowSelected?.row.student?.nickName ?? 'Cargando...'}
      state={[openPayments, setOpenPayments]}
      title={`Pagos de: ${rowSelected?.row.student?.nickName ?? 'Cargando...'}`}
      orderId={rowSelected?.row.id}
    />
    <Dialog
      noButton
      title='Galería de fotos'
      state={[openPhotos, setOpenPhotos]}
      actions={{ omitCancel: true }}
    >
      <Gallery orderId={rowSelected?.row.id} includePrivate/>
    </Dialog>
    <TableOrder
      {...params}
      list={orders}
      onNeedRefresh={() => setNeedRefresh(true)}
      onClickNested={onClickNested}
      isLoading={isLoading}
      onPagination={(limit, offset) => {
        useOrders.launchNextFetch({ limit, offset })
      }}
      count={useOrders.metadata?.count ?? 0}
    />
  </>
}
