import { GridRenderCellParams } from '@mui/x-data-grid'
import { ICombo, IOrder } from '../../../../api/models_school'

export type CombosByOrders = Array<{
  combos?: Array<Partial<ICombo>>
  orderId: IOrder['id']
}>

export type NestedField = 'combo' | 'photo' | 'payment'

export type OnClickNestedParams = {
  renderParams: GridRenderCellParams<any, IOrder>
  field: NestedField
}
