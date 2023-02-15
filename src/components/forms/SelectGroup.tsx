import { IGroup } from "../../api/models_school"
import { SelectFromList } from "../inputs/Select"

interface Params {
  onSelect: (select?: IGroup) => void
  list: Array<IGroup>
  defaultValue?: IGroup['id']
}

export const SelectGroup = (params: Params) => {
  return <SelectFromList
    id="group"
    name="group_id"
    title="Grupo"
    itemNameBy="name"
    {...params}
  />
}
