import { IModel } from "../../../../api/models_school"
import { v4 as uuidV4 } from 'uuid'

function getFormValue<T>(form: FormData, name: string): T {
  return form.get(name) as T
}

export const getData = (form: FormData): IModel => {
  return {
    id: getFormValue<string>(form, 'model_id') || uuidV4(),
    name: getFormValue<string>(form, 'name'),
    price: getFormValue<number>(form, 'price'),
    offer: getFormValue<number>(form, 'offer'),
    available: getFormValue<boolean>(form, 'available'),
  }
}
