import { IColor } from '../../../../api/models_school'
import { v4 as uuidV4 } from 'uuid'
import { getFormValue } from '../BaseFormModal/getData'

export const getData = (form: FormData): IColor => {
  return {
    id: getFormValue<string>(form, 'color_id') ?? uuidV4(),
    name: getFormValue<string>(form, 'name') ?? '',
    sample: getFormValue<string>(form, 'sample') ?? undefined,
    hex: getFormValue<string>(form, 'hex') ?? '',
    available: !!form.get('available') ?? false
  }
}
