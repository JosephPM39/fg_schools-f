import { ISchoolProm } from "../../api/models_school"
import { SelectFromList } from "../inputs/SelectFromList"

interface params {
  onSelect?: (selected?: ISchoolProm) => void
  list: ISchoolProm[]
}

export const SelectSchoolProm = (params: params) => {
  const { onSelect = () => {}, list } = params

  const findSPName = (item: ISchoolProm) => {
    return `${item.school?.name} (Código: ${item.school?.code})`
  }

  return <SelectFromList
    id="school-prom"
    name="school_id"
    title="Escuela"
    valueBy="schoolId"
    itemNameFormat={findSPName}
    list={list}
    onSelect={onSelect}
  />
}
