import { IGroup } from '../../../api/models_school'
import { useGroup } from '../../../hooks/api/schools/useGroup'
import { SelectLazy } from '../../inputs/Select'
import { SelectLazyParams } from '../../inputs/Select/types'

type SGParamsOmit = 'label' | 'id' | 'name' | 'itemLabelBy'

type SGParams = Omit<SelectLazyParams<IGroup, 'id'>, SGParamsOmit>

/* interface Params {
  onSelect: (select?: IGroup) => void
  list: IGroup[]
  defaultValue?: IGroup['id']
  paginationNext: (p?: { limit?: number, offset?: number }) => void
  count: number
} */

export const SelectGroup = (params: SGParams) => {
  const useGroups = useGroup()
  return <SelectLazy<IGroup>
    hook={useGroups}
    id="group"
    name="group_id"
    label="Grupo"
    itemLabelBy="name"
  />
}
