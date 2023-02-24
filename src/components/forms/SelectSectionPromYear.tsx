import { Grid } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { ISchool, ISectionProm } from "../../api/models_school"
import { SchoolPromContext } from "../../context/api/schools"
import { useSectionProm } from "../../hooks/api/schools/useSectionProm"
import { YearSelect } from "./YearSelect"
import { SelectSectionProm } from "./SelectSectionProm"
import { useSchoolProm } from "../../hooks/api/schools/useSchoolProm"
import { CustomError, ErrorType } from "../../api/handlers/errors"

interface params {
  onSelect: (selected?: ISectionProm) => void
  schoolId: ISchool['id']
}

export const SelectSectionPromYear = ({ onSelect, schoolId }: params) => {
  const globalYear = useContext(SchoolPromContext)?.year

  const [list, setList] = useState<ISectionProm[]>([])
  const [year, setYear] = useState<number>((globalYear ?? new Date().getFullYear()) - 1)
  const useSchoolProms = useSchoolProm({ initFetch: false })
  const useSectionProms = useSectionProm({ initFetch: false })

  useEffect(() => {
    useSchoolProms.fetch({searchBy: { year, schoolId }}).then((res) => res).catch((err) => console.log(err.cause))
  }, [year])

  useEffect(() => {
    const conf = async () => {
      const res = await Promise.all(useSchoolProms.data.map(async (p) => {
        const section = await useSectionProms.findBy({ schoolPromId: p.id })
        if (!section) {
          console.log(p)
          throw new CustomError(ErrorType.apiResponse, 'Api problems')
        }
        return section
      }))
      setList(res.flat())
    }
    conf()
  }, [useSectionProms.data, useSchoolProms.data])

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <SelectSectionProm
          list={list}
          onSelect={onSelect}
          count={useSchoolProms.metadata?.count ?? 0}
          paginationNext={useSchoolProms.launchNextFetch}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <YearSelect onSelect={(y) => setYear(y)} defaultValue={year}/>
      </Grid>
    </Grid>
  </>
}
