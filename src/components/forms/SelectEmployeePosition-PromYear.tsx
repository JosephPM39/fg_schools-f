import { Grid } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IEmployeePosition, ISchoolProm, ISectionProm } from "../../api/models_school"
import { PositionType } from "../../api/models_school/schools/position.model"
import { useEmployee } from "../../hooks/api/schools/useEmployee"
import { useEmployeePosition } from "../../hooks/api/schools/useEmployeePosition"
import { usePosition } from "../../hooks/api/schools/usePosition"
import { useSchoolProm } from "../../hooks/api/schools/useSchoolProm"
import { useSectionProm } from "../../hooks/api/schools/useSectionProm"
import { SelectEmployeePosition } from "./SelectEmployeePosition"
import { YearSelect } from "./YearSelect"

interface WithProms {
  type: PositionType.PRINCIPAL
  proms?: ISchoolProm[]
}

interface WithSectionsProms {
  sections?: ISectionProm[]
  type: PositionType.PROFESOR
}

interface BaseParams {
  onSelect?: (selected?: IEmployeePosition) => void
  yearSelect: boolean
}

type Params = BaseParams & (WithProms | WithSectionsProms)

type SelectParams = {
  type: PositionType,
  list: IEmployeePosition[],
  state: [number, Dispatch<SetStateAction<number>>]
}

const Select = (params: BaseParams & SelectParams) => {
  const { onSelect, yearSelect, type, list, state } = params
  const [year, setYear] = state

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={!yearSelect ? 12 : 6}>
        <SelectEmployeePosition onSelect={onSelect} list={list} type={type}/>
      </Grid>
      {yearSelect && <Grid item xs={12} sm={6}>
        <YearSelect onSelect={setYear} defaultValue={year}/>
      </Grid> }
    </Grid>
  </>
}

const SelectEPBySectionProms = (params: BaseParams & WithSectionsProms) => {
  const { onSelect, yearSelect, sections: sectionsProp, type } = params
  const [list, setList] = useState<IEmployeePosition[]>([])
  const [year, setYear] = useState<number>(new Date().getFullYear() -1)
  const [sectionProms, setSectionProms] = useState<ISectionProm[]>([])
  const useEP = useEmployeePosition()
  const useEmployees = useEmployee()
  const usePositions = usePosition()
  const useSectionProms = useSectionProm()

  useEffect(() => {
    if (sectionsProp) return setSectionProms(sectionsProp)
    setSectionProms(useSectionProms.data)
  }, [sectionsProp, useSectionProms.data])

  useEffect(() => {
    const conf = async () => {
      const res = await Promise.all(sectionProms.map(async (prom) => {
        const profesor = await useEP.findOne({id: prom.profesorId}) as IEmployeePosition
        const ep = {
          ...profesor,
          employee: await useEmployees.findOne({id: profesor?.employeeId}),
          position: await usePositions.findOne({id: profesor?.positionId})
        }
        return ep
      }))
      setList(res)
    }
    conf()
  }, [sectionProms, usePositions, useEmployees, useEP])

  return <Select
    list={list}
    yearSelect={yearSelect}
    onSelect={onSelect}
    type={type}
    state={[year, setYear]}
  />
}

const SelectEPBySchoolProms = (params: BaseParams & WithProms) => {
  const { onSelect, type, yearSelect, proms: promsProp } = params
  const [list, setList] = useState<IEmployeePosition[]>([])
  const [year, setYear] = useState<number>(promsProp?.[0]?.year ?? (new Date().getFullYear() -1))
  const [proms, setProms] = useState<ISchoolProm[]>([])
  const useEP = useEmployeePosition()
  const useEmployees = useEmployee()
  const usePositions = usePosition()
  const useSchoolProms = useSchoolProm({year})

  useEffect(() => {
    if (promsProp) return setProms(promsProp)
    setProms(useSchoolProms.data)
  }, [promsProp, useSchoolProms.data])

  useEffect(() => {
    const conf = async () => {
      const res = await Promise.all(proms.map(async (prom) => {
        const principal = await useEP.findOne({id: prom.principalId}) as IEmployeePosition
        const ep = {
          ...principal,
          employee: await useEmployees.findOne({id: principal?.employeeId}),
          position: await usePositions.findOne({id: principal?.positionId})
        }
        return ep
      }))
      setList(res)
    }
    conf()
  }, [proms, usePositions, useEmployees, useEP])

  return <Select
    list={list}
    yearSelect={yearSelect}
    onSelect={onSelect}
    type={type}
    state={[year, setYear]}
  />
}

export const SelectEmployeePositionPromYear = (params: Params) => {
  if (params.type === PositionType.PRINCIPAL) {
    return <SelectEPBySchoolProms {...params}/>
  }
  return <SelectEPBySectionProms {...params}/>
}
