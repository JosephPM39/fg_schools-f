import { Form } from './form'
import { IOrder, ISectionProm } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../../../BaseDataTable/BaseFormModal'
export { Form as ModelForm }

export type FormModalParams = Omit<BaseFormModalParams<IOrder>, 'Form' | 'name'> & {
  sectionPromId: NonNullable<ISectionProm['id']>
}

export const OrderFormModal = (params: FormModalParams) => {
  return (
    <BaseFormModal {...params as any} Form={(p) => <Form sectionPromId={params.sectionPromId} {...p}/>} name='Orden' noButton fullScreen/>
  )
}
