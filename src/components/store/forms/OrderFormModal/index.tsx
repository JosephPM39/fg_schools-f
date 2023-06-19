import { Form } from './form'
import { IOrder } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../../../BaseDataTable/BaseFormModal'
export { Form as ModelForm }

export type FormModalParams = Omit<BaseFormModalParams<IOrder>, 'Form' | 'name'>

export const OrderFormModal = (params: FormModalParams) => {
  return (
    <BaseFormModal {...params as any} Form={Form} name='Orden' noButton fullScreen/>
  )
}
