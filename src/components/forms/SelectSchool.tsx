import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { ISchool, ISchoolProm } from "../../api/models_school"
import { QueryUsed } from "../../api/types"
import { SchoolPromContext, SchoolContext } from "../../context/api/schools"
import { useSchoolProm } from "../../hooks/api/schools/useSchoolProm"
import { YearSelect } from "./YearSelect"

interface params {
  hook: [ISchoolProm | undefined, Dispatch<SetStateAction<ISchoolProm | undefined>>]
}
export const SelectSchool = ({hook}: params) => {
  const [schoolPromSelected, setSchoolPromSelected] = hook
  const [schools, setSchools] = useState<Array<ISchool>>([])
  const [schoolPromsFetch, setSchoolPromsFetch] = useState<{
    data: Array<ISchoolProm> | undefined
    queryUsed: QueryUsed | undefined
  }>()
  const useSchoolPromsContext = useContext(SchoolPromContext)
  const useSchool = useContext(SchoolContext)
  const [year, setYear] = useState<number>((useSchoolPromsContext?.year ?? new Date().getFullYear()) - 1)
  const useSchoolProms = useSchoolProm({autoFetch: false})

  useEffect(() => {
    console.log(year, 'init year')
    useSchoolProms.fetch({searchBy: {year}})
  }, [year])

  useEffect(() => {
    setSchoolPromsFetch({
      data: useSchoolProms.data,
      queryUsed: useSchoolProms.metadata
    })
  }, [useSchoolProms.data, useSchoolProms.metadata])

  useEffect(() => {
    const getData = async () => {
      if (!schoolPromsFetch?.data) return
      const res: ISchool[] = []
      for(let i = 0; i < schoolPromsFetch.data.length; i++) {
        const school = await useSchool?.findOne({ id: schoolPromsFetch.data[i].schoolId })
        if (school) {
          res.push(school)
        }
      }
      setSchools(res)
    }
    getData()
  }, [schoolPromsFetch, useSchool, useSchool?.data?.length, useSchoolProms?.data?.length])

  const findSchoolName = (id: ISchool['id']) => {
    const school = schools.find((e) => e.id === id)
    if (!school) return 'Desconocido'
    return `${school?.name} (Código: ${school?.code})`
  }

  const handleChange = (e: SelectChangeEvent) => {
    const prom = schoolPromsFetch?.data?.find((p) => p.id === e.target.value)
    if (prom) {
      console.log(prom, 'Prom selec')
      setSchoolPromSelected(prom)
      console.log(schoolPromSelected, 'in hook')
    }
  }

  const getDefaultSP = (id: ISchoolProm['id']) => {
    const prom = schoolPromsFetch?.data?.find((p) => p.id === id)
    if (prom) {
      return prom.id
    }
    setSchoolPromSelected(undefined)
    return 'null'
  }

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Escuela</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={getDefaultSP(schoolPromSelected?.id)}
            fullWidth
            label="Escuela"
            onChange={handleChange}
          >
            <MenuItem value={'null'} key={`menu-item-position-null`}>
              {(!schoolPromsFetch?.data?.length || schoolPromsFetch.data.length < 1) ? 'No hay registros' : 'Sin seleccionar'}
            </MenuItem>
            {schoolPromsFetch?.data?.map(
              (prom, index) => <MenuItem
                value={prom.id}
                key={`menu-item-position-${index}`}
              >
                {findSchoolName(prom.schoolId)}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <YearSelect hook={[year, setYear]} />
      </Grid>
    </Grid>
  </>
}
