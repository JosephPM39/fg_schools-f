import { Grid } from '@mui/material'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { IEmployeePosition, ISchoolProm, ISectionProm } from '../../../api/models_school'
import { PositionType } from '../../../api/models_school/schools/position.model'
import { useEmployee } from '../../../hooks/api/schools/useEmployee'
import { useEmployeePosition } from '../../../hooks/api/schools/useEmployeePosition'
import { usePosition } from '../../../hooks/api/schools/usePosition'
import { useSchoolProm } from '../../../hooks/api/schools/useSchoolProm'
import { useSectionProm } from '../../../hooks/api/schools/useSectionProm'
import { SelectEmployeePosition } from './SelectEmployeePosition'
import { YearSelect } from '../../YearSelect'

interface Pagination {
  paginationNext: (p: { limit: number, offset: number }) => void
  count: number
}

type WithSection = {
  sectionProms: ISectionProm[]
} & Pagination

type WithProm = {
  schoolProms: ISchoolProm[]
} & Pagination

interface BaseParams {
  onSelect?: (selected?: IEmployeePosition) => void
  yearSelect: boolean
  type: PositionType
}

type Data = WithProm | WithSection

type Params = BaseParams & (WithProm | WithSection | {})

type SelectParams = {
  type: PositionType
  list: IEmployeePosition[]
  state: [number, Dispatch<SetStateAction<number>>]
} & Pagination

function isWithProm (p: Params): p is BaseParams & WithProm {
  return typeof (p as BaseParams & WithProm).schoolProms !== 'undefined'
}

function isWithSection (p: Params): p is BaseParams & WithSection {
  return typeof (p as BaseParams & WithSection).sectionProms !== 'undefined'
}

const Select = (params: BaseParams & SelectParams) => {
  const {
    onSelect,
    yearSelect,
    type,
    list,
    state,
    paginationNext,
    count
  } = params
  const [year, setYear] = state

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={!yearSelect ? 12 : 6}>
        <SelectEmployeePosition
          onSelect={onSelect}
          list={list}
          type={type}
          paginationNext={paginationNext}
          count={count}
        />
      </Grid>
      {yearSelect && <Grid item xs={12} sm={6}>
        <YearSelect onSelect={setYear} defaultValue={year}/>
      </Grid> }
    </Grid>
  </>
}

type SelectProfesorParams = BaseParams & Data & Pick<SelectParams, 'state'>

const SelectProfesor = (params: SelectProfesorParams) => {
  const {
    onSelect,
    yearSelect,
    paginationNext,
    count,
    state
  } = params

  const { schoolProms, sectionProms: sp } = isWithProm(params)
    ? { schoolProms: params.schoolProms, sectionProms: undefined }
    : { schoolProms: undefined, sectionProms: params.sectionProms }

  const [list, setList] = useState<IEmployeePosition[]>([])
  const [sectionProms, setSectionProms] = useState<ISectionProm[]>(sp ?? [])
  const useEP = useEmployeePosition()
  const useEmployees = useEmployee()
  const usePositions = usePosition()
  const useSectionProms = useSectionProm()

  useEffect(() => {
    if (schoolProms == null) return
    void Promise.all(schoolProms.map(async (prom) => {
      const res = await useSectionProms.findBy({ schoolPromId: prom.id }) ?? []
      return res
    })).then((res) => {
      const sections = res.flat()
      setSectionProms(sections)
    })
  }, [schoolProms])

  useEffect(() => {
    const conf = async () => {
      const res = await Promise.all(sectionProms.map(async (prom) => {
        const profesor = await useEP.findOne({ id: prom.profesorId }) as IEmployeePosition
        const ep = {
          ...profesor,
          employee: await useEmployees.findOne({ id: profesor?.employeeId }) ?? undefined,
          position: await usePositions.findOne({ id: profesor?.positionId }) ?? undefined
        }
        return ep
      }))
      setList(res)
    }
    void conf()
  }, [sectionProms, usePositions.data, useEmployees.data, useEP.data])

  return <Select
    paginationNext={paginationNext}
    count={count}
    list={list}
    yearSelect={yearSelect}
    onSelect={onSelect}
    type={PositionType.PROFESOR}
    state={state}
  />
}

type SelectPrincipalParams = Omit<BaseParams, 'type'>
& WithProm
& Pick<SelectParams, 'state'>

const SelectPrincipal = (params: SelectPrincipalParams) => {
  const {
    onSelect,
    yearSelect,
    schoolProms: proms,
    paginationNext,
    count,
    state
  } = params
  const [list, setList] = useState<IEmployeePosition[]>([])
  const useEP = useEmployeePosition()
  const useEmployees = useEmployee()
  const usePositions = usePosition()

  useEffect(() => {
    const conf = async () => {
      const res = await Promise.all(proms.map(async (prom) => {
        const principal = await useEP.findOne({ id: prom.principalId }) as IEmployeePosition
        const ep = {
          ...principal,
          employee: await useEmployees.findOne({ id: principal?.employeeId }) ?? undefined,
          position: await usePositions.findOne({ id: principal?.positionId }) ?? undefined
        }
        return ep
      }))
      setList(res)
    }
    void conf()
  }, [proms, usePositions.data, useEmployees.data, useEP.data])

  return <Select
    paginationNext={paginationNext}
    count={count}
    list={list}
    yearSelect={yearSelect}
    onSelect={onSelect}
    type={PositionType.PRINCIPAL}
    state={state}
  />
}

export const SelectEmployeePositionPromYear = (params: Params) => {
  const defaultYear = (new Date().getFullYear() - 1)
  const useSchoolProms = useSchoolProm({ year: defaultYear })

  const getParams = () => {
    if (isWithProm(params)) {
      return { ...params, sectionProms: undefined }
    }
    if (isWithSection(params)) {
      return { ...params, schoolProms: undefined }
    }
    return {
      ...params,
      sectionProms: undefined,
      schoolProms: undefined,
      paginationNext: () => useSchoolProms.launchNextFetch(),
      count: useSchoolProms.metadata?.count ?? 0
    }
  }

  const { type, schoolProms: proms, sectionProms, ...restParams } = getParams()

  const [schoolProms, setSchoolProms] = useState<ISchoolProm[]>([])
  const [year, setYear] = useState<number>(schoolProms?.[0]?.year ?? defaultYear)

  useEffect(() => {
    if (proms != null) return setSchoolProms(proms)
    setSchoolProms(useSchoolProms.data)
  }, [useSchoolProms.data, proms])

  useEffect(() => {
    useSchoolProms.setYear(year)
  }, [year])

  if (type === PositionType.PRINCIPAL) {
    return <SelectPrincipal
      state={[year, setYear]}
      schoolProms={schoolProms}
      {...restParams}
    />
  }

  const props = (sectionProms != null) ? { sectionProms } : { schoolProms }
  return <SelectProfesor
    type={type}
    state={[year, setYear]}
    {...props}
    {...restParams}
  />
}
