import { ITitle } from "../../api/models_school"
import { SelectFromList } from "../inputs/Select"

interface Params {
  onSelect: (select?: ITitle) => void
  list: Array<ITitle>
  defaultValue?: ITitle['id']
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
