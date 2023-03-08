import { Form } from './form'
import { IColor } from '../../../../api/models_school';
import { BaseFormModal, BaseFormModalParams } from '../BaseFormModal';
import { IBaseModel } from '../../../../api/models_school/base.model';
export { Form as ModelForm }

type Params<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form'>

export const ColorFormModal = (params: Params<IColor>) => {
  return (
    <BaseFormModal {...params as any} Form={Form}/>
  )
}
