import { Form } from './form'
import { IPayment } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../../../BaseDataTable/BaseFormModal'
export { Form as ModelForm }

export type FormModalParams = Omit<BaseFormModalParams<IPayment>, 'Form' | 'name'>

export const PaymentFormModal = (params: FormModalParams) => {
  return (
    <BaseFormModal {...params as any} Form={Form} name='Pago'/>
  )
}
