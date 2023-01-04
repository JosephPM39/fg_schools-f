import { ISectionProm, SectionProm } from '../../../api/models_school'
import { useBase } from '../useBase'

export const useSectionProm = ({offline}: {offline: boolean}) => {
  const hook = useBase<ISectionProm>({
    path: 'schools/section-prom',
    offline,
    model: SectionProm,
  })

  return hook
}
