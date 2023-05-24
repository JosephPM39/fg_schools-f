import { IProductCombo } from '../../../../api/models_school'
import { v4 as uuidV4 } from 'uuid'
import { getFormValue } from '../../../BaseDataTable/BaseFormModal/getData'

export const getData = (form: FormData): IProductCombo => {
  return {
    id: getFormValue<string>(form, 'product_combo_id') ?? uuidV4(),
    comboId: getFormValue<string>(form, 'combo_id') ?? '',
    productId: getFormValue<string>(form, 'product_id') ?? '',
    amount: parseInt(getFormValue<string>(form, 'amount') ?? 'NaN'),
    inOffer: !!form.get('in_offer') || false
  }
}
