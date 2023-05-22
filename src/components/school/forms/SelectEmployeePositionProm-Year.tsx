import { Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { IEmployeePosition, ISchool, ISectionProm } from '../../../api/models_school'
import { PositionType } from '../../../api/models_school/schools/position.model'
import { useEmployeePosition } from '../../../hooks/api/schools/useEmployeePosition'
import { useSchoolProm } from '../../../hooks/api/schools/useSchoolProm'
import { useSectionProm } from '../../../hooks/api/schools/useSectionProm'
import { SelectEmployeePosition } from './SelectEmployeePosition'
import { YearSelect } from '../../YearSelect'

type SelectParams = {
  type: PositionType
  schoolId?: ISchool['id']
  onChange?: (item?: IEmployeePosition) => void
  yearSelect: boolean
  defaultYear?: number
}

export const SelectEmployeePositionPromYear = (params: SelectParams) => {
  const {
    onChange,
    yearSelect,
    defaultYear: extDefaultYear,
    type,
    schoolId
  } = params

  const defaultYear = extDefaultYear ?? (new Date().getFullYear() - 1)
  const [year, setYear] = useState<number>(defaultYear)
  const useSectionProms = useSectionProm({ initFetch: false })
  const useSchoolProms = useSchoolProm({ initFetch: false })
  const useEmployeePositions = useEmployeePosition({ initFetch: false })
  const hook = useEmployeePosition({ initFetch: false })
  const [idList, setIdList] = useState<Array<IEmployeePosition['id']>>([])

  const paginate = {
    next: () => {
      useSchoolProms.launchNextFetch()
    },
    count: useSchoolProms.metadata?.count ?? 0
  }

  useEffect(() => {
    void useSchoolProms.fetch({ searchBy: { schoolId, year } })
    console.log(useEmployeePositions.data.length, 'update', idList.length, schoolId)
  }, [year, schoolId])

  useEffect(() => {
    const getData = async () => {
      if (type === PositionType.PRINCIPAL) {
        const list = useSchoolProms.data.map(({ principalId }) => principalId)
        return setIdList(list)
      }

      const sections: ISectionProm[] = []

      await Promise.all(useSchoolProms.data.map(async ({ id }) => {
        const sectionsBySP = await useSectionProms.findBy({ schoolPromId: id })
        if (sectionsBySP) {
          sections.push(...sectionsBySP)
        }
      }))

      const list = sections.map(({ profesorId }) => profesorId)
      setIdList(list)
    }
    void getData()
  }, [useSchoolProms.data])

  useEffect(() => {
    const getData = async () => {
      const ep: IEmployeePosition[] = []
      await Promise.all(idList.map(async (id) => {
        // console.log('update', 'fetching', id)
        const res = await useEmployeePositions.findOne({ id })
        if (res) ep.push(res)
        console.log(res, 'update')
      }))
      hook.setData(ep)
    }
    void getData()
  }, [idList])

  useEffect(() => {
    console.log(hook.data.length, 'update')
  }, [hook.data])

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={!yearSelect ? 12 : 6}>
        <SelectEmployeePosition
          onChange={onChange}
          hook={hook}
          type={type}
          paginate={paginate}
        />
      </Grid>
      { yearSelect && <Grid item xs={12} sm={6}>
        <YearSelect onSelect={setYear} defaultValue={year} />
      </Grid>}
    </Grid>
  </>
}
