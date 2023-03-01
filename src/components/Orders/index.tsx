import { IOrder } from "../../api/models_school"
import { OrderType } from "../../api/models_school/store/order.model"
import { TableOrder } from "./Table"

type Params = {
  type: OrderType.STUDIO
} | {
  type: OrderType.SCHOOL
  sectionPromId: IOrder['sectionPromId']
}

export const Orders = (params: Params) => {
  return <TableOrder {...params}/>
}
