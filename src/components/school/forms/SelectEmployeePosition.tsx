import { IEmployeePosition } from '../../../api/models_school'
import { PositionType } from '../../../api/models_school/schools/position.model'
import { SelectFromList } from '../../inputs/SelectFromList'

interface params {
  onSelect?: (selected?: IEmployeePosition) => void
  list: IEmployeePosition[]
  type: PositionType
  paginationNext: (p?: { offset?: number, limit?: number }) => void
  count: number
}

export const SelectEmployeePosition = (params: params) => {
  const {
    onSelect = () => {},
    list,
    type,
    paginationNext,
    count
  } = params

  const findEPName = (ep: IEmployeePosition) => {
    const profesion = ep.employee?.profesion ?? 'Cargando...'
    const firstName = ep.employee?.firstName ?? 'Cargando...'
    const lastName = ep.employee?.lastName ?? 'Cargando...'
    const position = ep?.position?.name ?? 'Cargando...'
    return `${profesion} ${firstName} ${lastName} (${position})`
  }

  const getLabel = () => {
    if (type === PositionType.PRINCIPAL) return 'Director'
    if (type === PositionType.PROFESOR) return 'Docente'
    return 'Encargado'
  }

  return <SelectFromList
    id="employee-position"
    name="employee_position_id"
    title={getLabel()}
    itemNameFormat={findEPName}
    omitCreateOption
    onSelect={onSelect}
    paginationNext={paginationNext}
    count={count}
    list={list}
  />
}
