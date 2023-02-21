import { ISectionProm, SectionProm } from '../../../api/models_school'
import { useBase } from '../useBase'

type Params = {
  initFetch?: boolean
}

export const useSectionProm = (params?: Params) => {
  const hook = useBase<ISectionProm>({
    path: 'schools/section-prom',
    model: SectionProm,
    initFetch: params?.initFetch
  })

  return hook
}
