import { ISectionProm } from '../../../api/models_school'
import { useGroup } from '../../../hooks/api/schools/useGroup'
import { useTitle } from '../../../hooks/api/schools/useTitle'
import { SelectLazy } from '../../inputs/Select'
import { useSectionProm } from '../../../hooks/api/schools/useSectionProm'

interface Params {
  onChange: (item?: ISectionProm) => void
  hook?: ReturnType<typeof useSectionProm>
  defaultValue?: ISectionProm['id']
  paginate?: {
    next: () => void
    count: number
  }
  required?: boolean
}

export const SelectSectionProm = (params: Params) => {
  const {
    onChange,
    defaultValue,
    paginate,
    required
  } = params
  const useTitles = useTitle()
  const useGroups = useGroup()
  const useSectionProms = useSectionProm()
  const hook = params.hook ?? useSectionProms

  const nameFormat = async (section: ISectionProm) => {
    const title = await useTitles.findOne({ id: section.titleId })
    const group = await useGroups.findOne({ id: section.groupId })
    return `${title?.name ?? 'Cargando...'} - ${group?.name ?? 'Cargando...'}`
  }

  return <SelectLazy
    id="section-prom"
    name="section_prom_id"
    label="Sección"
    required={required}
    hook={hook}
    itemLabelBy={nameFormat}
    defaultValue={defaultValue}
    onChange={onChange}
    paginate={paginate}
  />
}
