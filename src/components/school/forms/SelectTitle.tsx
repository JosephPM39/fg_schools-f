import { ITitle } from '../../../api/models_school'
import { useTitle } from '../../../hooks/api/schools/useTitle'
import { SelectLazy } from '../../inputs/Select'

interface Params {
  onChange?: (item?: ITitle) => void
  defaultValue?: ITitle['id']
  hook?: ReturnType<typeof useTitle>
  required?: boolean
}

export const SelectTitle = (params: Params) => {
  const {
    onChange,
    defaultValue,
    required
  } = params
  const useTitles = useTitle()
  const hook = params.hook ?? useTitles
  return <SelectLazy
    id="title"
    name="title_id"
    label="Título"
    hook={hook}
    onChange={onChange}
    defaultValue={defaultValue}
    required={required}
    itemLabelBy="name"
  />
}
