import { Form } from './form'
import { IProduct } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../../../BaseDataTable/BaseFormModal'
import { IBaseModel } from '../../../../api/models_school/base.model'
export { Form as ModelForm }

type Params<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'>

export const ProductFormModal = (params: Params<IProduct>) => {
  return (
    <BaseFormModal {...params as any} Form={Form} name='Product'/>
  )
}
