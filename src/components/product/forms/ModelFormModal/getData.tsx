import { IModel } from '../../../../api/models_school'
import { v4 as uuidV4 } from 'uuid'

function getFormValue<T> (form: FormData, name: string): T | null {
  const value = form.get(name)
  if (!value) return null
  return form.get(name) as T
}

export const getData = (form: FormData): IModel => {
  return {
    id: getFormValue<string>(form, 'model_id') ?? uuidV4(),
    name: getFormValue<string>(form, 'name') ?? '',
    price: parseFloat(getFormValue<string>(form, 'price') ?? '-2'),
    offer: parseFloat(getFormValue<string>(form, 'offer') ?? '-2'),
    available: !!form.get('available') || false
  }
}
