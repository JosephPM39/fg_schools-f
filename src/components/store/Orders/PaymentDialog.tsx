import { IOrder } from "../../../api/models_school"
import { Dialog, DialogParams } from '../../../containers/Dialog'
import { BtnContainer, BtnPropsContainer, NoBtnContainer} from '../../../containers/types'
import { TablePayment } from "../tables/TablePayment"

type Params = {
  orderId: IOrder['id']
} & Omit<DialogParams, 'children'>
& (BtnContainer | BtnPropsContainer | NoBtnContainer)

export const PaymentDialog = (params: Params) => {
  const {orderId, ...dialogParams} = params
  return <Dialog {...dialogParams}>
    <TablePayment orderId={orderId} />
  </Dialog>
}
