import { Grid } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ISchoolProm } from '../../../api/models_school'
import { SchoolPromContext } from '../../../context/api/schools'
import { useSchoolProm } from '../../../hooks/api/schools/useSchoolProm'
import { YearSelect } from '../../YearSelect'
import { SelectSchoolProm } from './SelectSchoolProm'

interface params {
  onChange?: (p: ISchoolProm) => void
}

export const SelectSchoolPromYear = ({ onChange }: params) => {
  const globalYear = useContext(SchoolPromContext)?.year
  const initYear = (globalYear ?? new Date().getFullYear()) - 1
  const [year, setYear] = useState<number>(initYear)
  const proms = useSchoolProm({ year })

  useEffect(() => {
    void proms.fetch({ searchBy: { year } })
  }, [year])

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <SelectSchoolProm
          hook={proms}
          onChange={async (id: ISchoolProm['id']) => {
            const prom = await proms.findOne({ id })
            if (!prom || !onChange) return
            onChange(prom)
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <YearSelect onSelect={(y) => setYear(y)} defaultValue={year}/>
      </Grid>
    </Grid>
  </>
}
