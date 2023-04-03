import { ITitle } from '../../../api/models_school'
import { SelectFromList } from '../../inputs/SelectFromList'

interface Params {
  onSelect: (select?: ITitle) => void
  list: ITitle[]
  defaultValue?: ITitle['id']
  paginationNext: (p?: { limit?: number, offset?: number }) => void
  count: number
}

export const SelectTitle = (params: Params) => {
  return <SelectFromList
    id="title"
    name="title_id"
    title="Título"
    itemNameBy="name"
    {...params}
  />
}
