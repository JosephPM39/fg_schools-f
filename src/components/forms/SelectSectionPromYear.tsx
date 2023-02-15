import { Grid } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { ISectionProm } from "../../api/models_school"
import { SchoolPromContext } from "../../context/api/schools"
import { useSectionProm } from "../../hooks/api/schools/useSectionProm"
import { YearSelect } from "./YearSelect"
import { SelectSectionProm } from "./SelectSectionProm"
import { useSchoolProm } from "../../hooks/api/schools/useSchoolProm"
import { CustomError, ErrorType } from "../../api/handlers/errors"

interface params {
  onSelect: (selected?: ISectionProm) => void
}

export const SelectSectionPromYear = ({onSelect}: params) => {
  const globalYear = useContext(SchoolPromContext)?.year

  const [list, setList] = useState<ISectionProm[]>([])
  const [year, setYear] = useState<number>((globalYear ?? new Date().getFullYear()) - 1)
  const useSchoolProms = useSchoolProm({ year })
  const useSectionProms = useSectionProm()

  useEffect(() => {
    useSchoolProms.fetch({searchBy: { year }})
  }, [year])

  useEffect(() => {
    const conf = async () => {
      const res = await Promise.all(useSchoolProms.data.map(async (p) => {
        const section = await useSectionProms.findBy({ schoolPromId: p.id })
        if (!section) throw new CustomError(ErrorType.apiResponse, 'Api problems')
        return section
      }))
      setList(res.flat())
    }
    conf()
  }, [useSectionProms.data, useSchoolProms.data])

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <SelectSectionProm list={list} onSelect={onSelect}/>
      </Grid>
      <Grid item xs={12} sm={6}>
        <YearSelect onSelect={(y) => setYear(y)} defaultValue={year}/>
      </Grid>
    </Grid>
  </>
}
