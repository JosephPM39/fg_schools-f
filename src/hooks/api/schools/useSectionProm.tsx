import { ISectionProm, SectionProm } from '../../../api/models_school'
import { useBase } from '../useBase'
import { BaseParams } from './types'

export const useSectionProm = ({ netStatus }: BaseParams) => {
  const hook = useBase<ISectionProm>({
    path: 'schools/section-prom',
    model: SectionProm,
    netStatus
  })

  return hook
}
