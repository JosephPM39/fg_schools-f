import { GridRenderCellParams } from "@mui/x-data-grid"
import { useState } from "react"
import { IOrder } from "../../api/models_school"
import { OrderType } from "../../api/models_school/store/order.model"
import { Dialog } from "../../containers/Dialog"
import { TableOrder } from "./TableOrder"
import { OnClickNestedParams } from "./TableOrder/types"
import { TableOrderProducts } from './TableOrderProducts'
import { useGetComboPerOrders } from "./TableOrder/useGetCombosPerOrder"

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
  const [openCombos, setOpenCombos] = useState<boolean>(false)
  const [rowSelected, setRowSelected] = useState<GridRenderCellParams<any, IOrder>>()

  const onClickNested = (p: OnClickNestedParams) => {
    if (p.field === 'combo') {
      setRowSelected(p.renderParams)
      setOpenCombos(true)
    }
  }

  return <>
    <Dialog
      noButton
      title="Detalles del combo"
      state={[openCombos, setOpenCombos]}
      actions={{omitCancel: true}}
    >
      <ComboDetails {...rowSelected} />
    </Dialog>
    <TableOrder {...params} onClickNested={onClickNested}/>
  </>
}
