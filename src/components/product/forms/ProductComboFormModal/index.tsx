import { Form } from './form'
import { IProductCombo } from '../../../../api/models_school'
import { BaseFormModal, BaseFormModalParams, BaseFormParams } from '../../../BaseDataTable/BaseFormModal'
import { IBaseModel } from '../../../../api/models_school/base.model'
import { SelectComboId } from './type'

export type Params<T extends IBaseModel> = Omit<BaseFormModalParams<T>, 'Form' | 'name'>

export const ProductComboFormModal = (params: Params<IProductCombo> & {
  extra: SelectComboId
}) => {
  const { extra, ...rest } = params
  return (
    <BaseFormModal {...rest as any} Form={(params: BaseFormParams<IProductCombo>) => {
      return <Form
        {...params}
        {...extra}
      />
    }} name='Producto'/>
  )
}
