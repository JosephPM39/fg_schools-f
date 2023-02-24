import { IGroup } from "../../api/models_school"
import { SelectFromList } from "../inputs/SelectFromList"

interface Params {
  onSelect: (select?: IGroup) => void
  list: Array<IGroup>
  defaultValue?: IGroup['id']
  paginationNext: (p:{limit: number, offset:number}) => void
  count: number
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
