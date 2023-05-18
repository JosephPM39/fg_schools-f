import { Grid } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { ISchool, ISectionProm } from '../../../api/models_school'
import { SchoolPromContext } from '../../../context/api/schools'
import { useSectionProm } from '../../../hooks/api/schools/useSectionProm'
import { YearSelect } from '../../YearSelect'
import { SelectSectionProm } from './SelectSectionProm'
import { useSchoolProm } from '../../../hooks/api/schools/useSchoolProm'

interface params {
  onChange: (item?: ISectionProm) => void
  schoolId: ISchool['id']
}

export const SelectSectionPromYear = ({ onChange, schoolId }: params) => {
  const globalYear = useContext(SchoolPromContext)?.year
  const [year, setYear] = useState<number>((globalYear ?? new Date().getFullYear()) - 1)
  const useSchoolProms = useSchoolProm({ initFetch: false })
  const useSectionProms = useSectionProm({ initFetch: false })

  useEffect(() => {
    useSchoolProms.fetch({ searchBy: { year, schoolId } })
      .then((res) => {
        console.log(res, 'school proms fetch res')
      }).catch((err) => console.log(err.cause))
    console.log('proms fetched')
  }, [year])

  useEffect(() => {
    const conf = async () => {
      useSectionProms.clearRequests()
      await Promise.all(useSchoolProms.data.map(async (p) => {
        await useSectionProms.fetch({
          mode: 'merge',
          searchBy: { schoolPromId: p.id }
        })
      }))
    }
    void conf()
  }, [useSchoolProms.data])

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <SelectSectionProm
          hook={useSectionProms}
          onChange={async (id: ISectionProm['id']) => {
            const section = await useSectionProms.findOne({ id })
            if (!section || !onChange) return
            onChange(section)
          }}
          paginate={() => useSchoolProms.launchNextFetch()}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <YearSelect onSelect={(y) => setYear(y)} defaultValue={year}/>
      </Grid>
    </Grid>
  </>
}
