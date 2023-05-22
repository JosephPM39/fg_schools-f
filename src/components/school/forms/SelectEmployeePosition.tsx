import { useEffect } from 'react'
import { IEmployeePosition } from '../../../api/models_school'
import { PositionType } from '../../../api/models_school/schools/position.model'
import { useEmployeePosition } from '../../../hooks/api/schools/useEmployeePosition'
import { SelectLazy } from '../../inputs/Select'
import { usePosition } from '../../../hooks/api/schools/usePosition'
import { useEmployee } from '../../../hooks/api/schools/useEmployee'

type Base = {
  onChange?: (item?: IEmployeePosition) => void
  type?: PositionType
}

type WithControl = {
  hook: ReturnType<typeof useEmployeePosition>
  paginate: {
    next: () => void
    count: number
  }
}

type Params = Base | (Base & WithControl)

function isWithControl (params: Params): params is (Base & WithControl) {
  return typeof (params as (Base & WithControl)).hook !== 'undefined'
}

export const SelectEmployeePosition = (params: Params) => {
  const {
    onChange,
    type
  } = params

  const useEmployeePositions = useEmployeePosition({ initFetch: false })
  const usePositions = usePosition({ initFetch: false })
  const useEmployees = useEmployee({ initFetch: false })
  const hook = isWithControl(params) ? params.hook : useEmployeePositions
  const defaultPaginate = {
    next: useEmployeePositions.launchNextFetch,
    count: useEmployeePositions.metadata?.count ?? 0
  }
  const paginate = isWithControl(params) ? params.paginate : defaultPaginate

  useEffect(() => {
    if (isWithControl(params)) return
    if (!type) {
      void useEmployeePositions.fetch({})
      return
    }
    const getData = async () => {
      await usePositions.fetch({ searchBy: { type } })
      const positions = usePositions.data
      if (!positions) return
      useEmployeePositions.clearRequests()
      await Promise.all(positions?.map(async ({ id }) => {
        await useEmployeePositions.fetch({
          mode: 'merge',
          searchBy: {
            positionId: id
          },
          query: {
            limit: 'NONE'
          }
        })
      }))
    }
    void getData()
  }, [])

  const findEPName = async (ep: IEmployeePosition) => {
    const employee = await useEmployees.findOne({ id: ep.employeeId })
    const position = await usePositions.findOne({ id: ep.positionId })
    const profesion = employee?.profesion ?? 'Cargando...'
    const firstName = employee?.firstName ?? 'Cargando...'
    const lastName = employee?.lastName ?? 'Cargando...'
    const positionName = position?.name ?? 'Cargando...'
    return `${profesion} ${firstName} ${lastName} (${positionName})`
  }

  const getLabel = () => {
    if (type === PositionType.PRINCIPAL) return 'Director'
    if (type === PositionType.PROFESOR) return 'Docente'
    return 'Encargado'
  }

  return <SelectLazy
    id="employee-position"
    name="employee_position_id"
    label={getLabel()}
    hook={hook}
    itemLabelBy={findEPName}
    omitCreateOption
    onChange={onChange}
    paginate={paginate}
  />
}
