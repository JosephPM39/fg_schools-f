import { ISectionProm, SectionProm } from '../../../api/models_school'
import { useBase } from '../useBase'

interface Params {
  autoFetch: boolean
}
export const useSectionProm = (params?: Params) => {
  const hook = useBase<ISectionProm>({
    path: 'schools/section-prom',
    model: SectionProm,
    autoFetch: params?.autoFetch
  })

  return hook
}
