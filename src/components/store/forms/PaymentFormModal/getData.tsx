import { IPayment } from '../../../../api/models_school'
import { v4 as uuidV4 } from 'uuid'
import { getFormValue } from '../../../BaseDataTable/BaseFormModal/getData'

export const getData = (form: FormData): IPayment => {
  return {
    id: getFormValue<string>(form, 'payment_id') ?? uuidV4(),
    orderId: getFormValue<string>(form, 'order_id') ?? '',
    details: getFormValue<string>(form, 'details') ?? '',
    total: parseFloat(getFormValue<string>(form, 'total') ?? '-2'),
    date: getFormValue<Date>(form, 'date') as Date
  }
}
