import { Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { IEmployeePosition, IPosition, ISchoolProm } from "../../api/models_school"
import { useEmployee } from "../../hooks/api/schools/useEmployee"
import { useEmployeePosition } from "../../hooks/api/schools/useEmployeePosition"
import { usePosition } from "../../hooks/api/schools/usePosition"
import { useSchoolProm } from "../../hooks/api/schools/useSchoolProm"
import { SelectEmployeePosition } from "./SelectEmployeePosition"
import { YearSelect } from "./YearSelect"

interface params {
  onSelect: (selected?: IEmployeePosition) => void
  proms?: ISchoolProm[]
  yearSelect: boolean
  type: IPosition['type']
}

export const SelectEmployeePositionPromYear = ({onSelect, proms: promsProp, type, yearSelect}: params) => {
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
