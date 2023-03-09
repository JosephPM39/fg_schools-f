import { Form } from './form'
import { ISize } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../BaseFormModal'
import { IBaseModel } from '../../../../api/models_school/base.model'
export { Form as ModelForm }

type Params<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'>

export const SizeFormModal = (params: Params<ISize>) => {
  return (
    <BaseFormModal {...params as any} Form={Form} name='Tamaño'/>
  )
}
