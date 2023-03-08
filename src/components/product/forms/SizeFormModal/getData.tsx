import { ISize } from "../../../../api/models_school"
import { v4 as uuidV4 } from 'uuid'
import { getFormValue } from '../BaseFormModal/getData'

export const getData = (form: FormData): ISize => {
  return {
    id: getFormValue<string>(form, 'color_id') || uuidV4(),
    name: getFormValue<string>(form, 'name') || '',
    width: parseFloat(getFormValue<string>(form, 'width') || '-2'),
    height: parseFloat(getFormValue<string>(form, 'height') || '-2'),
    ppp: parseInt(getFormValue<string>(form, 'ppp') || '-2'),
    available: !!form.get('available') ?? false
  }
}
