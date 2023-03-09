import { Form } from './form'
import { IType } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../BaseFormModal'
import { IBaseModel } from '../../../../api/models_school/base.model'
export { Form as ModelForm }

type Params<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'>

export const TypeFormModal = (params: Params<IType>) => {
  return (
    <BaseFormModal {...params as any} Form={Form} name='Tipo'/>
  )
}
