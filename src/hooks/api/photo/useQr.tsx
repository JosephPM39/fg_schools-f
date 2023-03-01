import { IQr, Qr } from '../../../api/models_school'
import { useBase } from '../useBase'
import { DefaultApiHookParams as Params } from '../types'

export const useQr = (params?: Params) => {
  const hook = useBase<IQr>({
    path: 'photos/qr',
    model: Qr,
    initFetch: params?.initFetch
  })

  return hook
}
