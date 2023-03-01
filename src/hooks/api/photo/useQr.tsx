import { IQr, Qr } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useQr = () => {
  const hook = useBase<IQr>({
    path: 'photos/qr',
    model: Qr
  })

  return hook
}