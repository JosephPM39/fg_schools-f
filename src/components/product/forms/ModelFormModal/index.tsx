import { Form } from './form'
import { IModel } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../../../BaseDataTable/BaseFormModal'
import { IBaseModel } from '../../../../api/models_school/base.model'
export { Form as ModelForm }

type Params<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'>

export const ModelFormModal = (params: Params<IModel>) => {
  return (
    <BaseFormModal {...params as any} Form={Form} name='Modelo'/>
  )
}
