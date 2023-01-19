import { ISectionProm, SectionProm } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useSectionProm = () => {
  const hook = useBase<ISectionProm>({
    path: 'schools/section-prom',
    model: SectionProm,
  })

  return hook
}
