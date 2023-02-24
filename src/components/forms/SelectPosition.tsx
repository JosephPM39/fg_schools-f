import { IPosition } from "../../api/models_school"
import { SelectFromList } from "../inputs/SelectFromList"

interface Params {
  onSelect: (select?: IPosition) => void
  list: Array<IPosition>
  defaultValue?: IPosition['id']
  paginationNext: (p:{limit: number, offset:number}) => void
  count: number
}

export const SelectPosition = (params: Params) => {
  return <SelectFromList
    id="position"
    name="position_id"
    title="Cargo"
    itemNameBy="name"
    {...params}
  />
}
