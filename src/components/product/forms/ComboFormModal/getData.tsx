import { ICombo } from '../../../../api/models_school'
import { v4 as uuidV4 } from 'uuid'
import { getFormValue } from '../../../BaseDataTable/BaseFormModal/getData'

export const getData = (form: FormData): ICombo => {
  return {
    id: getFormValue<string>(form, 'color_id') ?? uuidV4(),
    name: getFormValue<string>(form, 'name') ?? '',
    available: !!form.get('available') ?? false
  }
}
