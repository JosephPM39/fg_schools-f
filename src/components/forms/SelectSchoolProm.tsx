import { ISchoolProm } from "../../api/models_school"
import { SelectFromList } from "../inputs/SelectFromList"

interface params {
  onSelect?: (selected?: ISchoolProm) => void
  list: ISchoolProm[]
  paginationNext: () => void
  count: number
}

export const SelectSchoolProm = (params: params) => {
  const { onSelect = () => {}, ...rest} = params

  const findSPName = (item: ISchoolProm) => {
    return `${item.school?.name} (Código: ${item.school?.code})`
  }

  return <SelectFromList
    id="school-prom"
    name="school_id"
    title="Escuela"
    valueBy="schoolId"
    omitCreateOption
    itemNameFormat={findSPName}
    onSelect={onSelect}
    {...rest}
  />
}
