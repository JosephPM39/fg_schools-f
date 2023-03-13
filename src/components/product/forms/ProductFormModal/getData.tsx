import { IProduct } from '../../../../api/models_school'
import { v4 as uuidV4 } from 'uuid'
import { getFormValue } from '../../../BaseDataTable/BaseFormModal/getData'

export const getData = (form: FormData): IProduct => {
  return {
    id: getFormValue<string>(form, 'product_id') ?? uuidV4(),
    name: getFormValue<string>(form, 'name') ?? '',
    modelId: getFormValue<string>(form, 'model_id') ?? '',
    typeId: getFormValue<string>(form, 'type_id') ?? '',
    sizeId: getFormValue<string>(form, 'size_id') ?? '',
    colorId: getFormValue<string>(form, 'color_id') ?? '',
    borderId: getFormValue<string>(form, 'border_id') ?? '',
    available: !!form.get('available') || false
  }
}
