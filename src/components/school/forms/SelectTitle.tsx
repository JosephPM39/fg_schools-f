import { ITitle } from '../../../api/models_school'
import { SelectLazy } from '../../inputs/Select'

interface Params {
  onChange?: (id?: ITitle['id']) => void
  defaultValue?: ITitle['id']
}

export const SelectTitle = (params: Params) => {
  const {
    onChange,
    defaultValue
  } = params
  return <SelectLazy
    id="title"
    name="title_id"
    label="Título"
    onChange={onChange}
    defaultValue={defaultValue}
    itemLabelBy="name"
  />
}
