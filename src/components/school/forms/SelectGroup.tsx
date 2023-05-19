import { IGroup } from '../../../api/models_school'
import { useGroup } from '../../../hooks/api/schools/useGroup'
import { SelectLazy } from '../../inputs/Select'

interface Params {
  onChange?: (item?: IGroup) => void
  defaultValue?: IGroup['id']
  hook?: ReturnType<typeof useGroup>
  required?: boolean
}

export const SelectGroup = (params: Params) => {
  const {
    onChange,
    defaultValue,
    required
  } = params
  const useGroups = useGroup()
  const hook = params.hook ?? useGroups
  return <SelectLazy<IGroup>
    hook={hook}
    defaultValue={defaultValue}
    onChange={onChange}
    id="group"
    required={required}
    name="group_id"
    label="Grupo"
    itemLabelBy="name"
  />
}
