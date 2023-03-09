import { IType } from '../../../../api/models_school'
import { v4 as uuidV4 } from 'uuid'
import { getFormValue } from '../../../BaseDataTable/BaseFormModal/getData'

export const getData = (form: FormData): IType => {
  return {
    id: getFormValue<string>(form, 'border_id') ?? uuidV4(),
    name: getFormValue<string>(form, 'name') ?? '',
    available: !!form.get('available') ?? false
  }
}
