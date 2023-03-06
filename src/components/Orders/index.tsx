import { GridRenderCellParams } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { IOrder } from "../../api/models_school"
import { OrderType } from "../../api/models_school/store/order.model"
import { Dialog } from "../../containers/Dialog"
import { TableOrder } from "./TableOrder"
import { OnClickNestedParams } from "./TableOrder/types"
import { TableOrderProducts } from './TableOrderProducts'
import { useGetComboPerOrders } from "./TableOrder/useGetCombosPerOrder"
import { useOrder } from "../../hooks/api/store/useOrder"
import { PaymentDialog } from "./Payment/PaymentDialog"

type Params = {
  type: OrderType.STUDIO
} | {
  type: OrderType.SCHOOL
  sectionPromId: IOrder['sectionPromId']
}

const ComboDetails = (params: Partial<GridRenderCellParams<any, IOrder>>) => {
  const orderId = params?.row?.id
  const studentName = params.row?.student?.nickName
  const { isCustom, comboPerOrders } = useGetComboPerOrders(orderId)

  return <TableOrderProducts
    { ... isCustom ? { orderId } : { comboId: comboPerOrders?.at(0)?.comboId } }
    studentName={studentName ?? ''}
  />
}

export const Orders = (params: Params) => {

  const useOrders = useOrder({initFetch: false})
  const [orders, setOrders] = useState<Array<IOrder> | null>([])

  const [isLoading, setIsLoading] = useState(true)
  const [openCombos, setOpenCombos] = useState<boolean>(false)
  const [openPayments, setOpenPayments] = useState<boolean>(false)
  const [rowSelected, setRowSelected] = useState<GridRenderCellParams<any, IOrder>>()

  useEffect(() => {
    useOrders.fetch({ searchBy: {...params} })
      .then((res) => {
        setOrders(res.data)
      })
  }, [params])

  useEffect(() => {
    if (!orders) return setIsLoading(false)
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
      state={[openPayments, setOpenPayments]}
      title={`Pagos de: ${rowSelected?.row.student?.nickName}`}
      orderId={rowSelected?.row.id}
    />
    <TableOrder
      {...params}
      list={orders}
      onClickNested={onClickNested}
      isLoading={isLoading}
      onPagination={(limit, offset) => {
        useOrders.launchNextFetch({limit, offset})
      }}
      count={useOrders.metadata?.count ?? 0}
    />
  </>
}
