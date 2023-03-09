import { Form } from './form'
import { IBorder } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../BaseFormModal'
import { IBaseModel } from '../../../../api/models_school/base.model'

type Params<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'>

export const BorderFormModal = (params: Params<IBorder>) => {
  return (
    <BaseFormModal {...params as any} Form={Form} name={'Borde'}/>
  )
}
