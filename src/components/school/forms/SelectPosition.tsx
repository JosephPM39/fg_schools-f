import { IPosition } from '../../../api/models_school'
import { usePosition } from '../../../hooks/api/schools/usePosition'
import { SelectLazy } from '../../inputs/Select'

interface Params {
  onChange?: (item?: IPosition) => void
  defaultValue?: IPosition['id']
  hook?: ReturnType<typeof usePosition>
  required?: boolean
}

export const SelectPosition = (params: Params) => {
  const {
    onChange,
    defaultValue,
    required
  } = params
  const usePositions = usePosition()
  const hook = params.hook ?? usePositions
  return <SelectLazy
    id="position"
    name="position_id"
    label="Cargo"
    itemLabelBy="name"
    hook={hook}
    required={required}
    onChange={onChange}
    defaultValue={defaultValue}
  />
}
