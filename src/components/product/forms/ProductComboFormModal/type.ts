import { ICombo } from '../../../../api/models_school'

export type SelectComboId = {
  omitSelectCombo?: false
} | {
  omitSelectCombo: true
  comboId: ICombo['id']
}
