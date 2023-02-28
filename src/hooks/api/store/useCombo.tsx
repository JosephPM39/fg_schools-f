import { ICombo, Combo } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useCombo = () => {
  const hook = useBase<ICombo>({
    path: 'store/combo',
    model: Combo
  })

  return hook
}
