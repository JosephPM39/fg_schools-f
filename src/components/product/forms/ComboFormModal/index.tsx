import { Form } from './form'
import { ICombo } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams } from '../../../BaseDataTable/BaseFormModal'
import { IBaseModel } from '../../../../api/models_school/base.model'
export { Form as ModelForm }

type Params<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'>

export const ComboFormModal = (params: Params<ICombo>) => {
  return (
    <BaseFormModal {...params as any} Form={Form} name='Combo'/>
  )
}
