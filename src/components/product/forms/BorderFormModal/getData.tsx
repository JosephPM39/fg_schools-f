import { IBorder } from "../../../../api/models_school"
import { v4 as uuidV4 } from 'uuid'
import { getFormValue } from '../BaseFormModal/getData'

export const getData = (form: FormData): IBorder => {
  return {
    id: getFormValue<string>(form, 'border_id') || uuidV4(),
    name: getFormValue<string>(form, 'name') || '',
    file: getFormValue<string>(form, 'file') || undefined,
    available: !!form.get('available') ?? false
  }
}
