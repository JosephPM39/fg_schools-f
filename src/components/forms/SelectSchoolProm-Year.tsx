import { Grid } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { ISchoolProm } from "../../api/models_school"
import { SchoolPromContext } from "../../context/api/schools"
import { useSchoolProm } from "../../hooks/api/schools/useSchoolProm"
import { useSchool } from "../../hooks/api/schools/useSchool"
import { YearSelect } from "./YearSelect"
import { SelectSchoolProm } from "./SelectSchoolProm"

interface params {
  onSelect: (selected?: ISchoolProm) => void
}

export const SelectSchoolPromYear = ({onSelect}: params) => {
  const globalYear = useContext(SchoolPromContext)?.year

  const [list, setList] = useState<ISchoolProm[]>([])
  const [year, setYear] = useState<number>((globalYear ?? new Date().getFullYear()) - 1)
  const proms = useSchoolProm({ year })
  const useSchools = useSchool()

  useEffect(() => {
    proms.fetch({searchBy: { year }})
  }, [year])

  useEffect(() => {
    const conf = async () => {
      const res = await Promise.all(proms.data.map(async (p) => {
        return {
          ...p,
          school: await useSchools.findOne({id: p.schoolId})
        }
      }))
      setList(res)
    }
    conf()
  }, [proms.data, useSchools])

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <SelectSchoolProm list={list} onSelect={onSelect}/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <YearSelect onSelect={(y) => setYear(y)} defaultValue={year}/>
      </Grid>
    </Grid>
  </>
}
