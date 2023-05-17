import { IPosition } from '../../../api/models_school'
import { usePosition } from '../../../hooks/api/schools/usePosition'
import { SelectLazy } from '../../inputs/Select'

interface Params {
  onChange: (item?: IPosition['id']) => void
  defaultValue?: IPosition['id']
  hook?: ReturnType<typeof usePosition>
}

export const SelectPosition = (params: Params) => {
  const usePositions = usePosition()
  const hook = params.hook ?? usePositions
  return <SelectLazy
    id="position"
    name="position_id"
    label="Cargo"
    itemLabelBy="name"
    {...params}
    hook={hook}
  />
}
