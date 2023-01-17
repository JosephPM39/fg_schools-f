import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IEmployeePosition, IPosition, ISchoolProm } from "../../api/models_school"
import { PositionType } from "../../api/models_school/schools/position.model"
import { useEmployee } from "../../hooks/api/schools/useEmployee"
import { useEmployeePosition } from "../../hooks/api/schools/useEmployeePosition"
import { usePosition } from "../../hooks/api/schools/usePosition"
import { useSchoolProm } from "../../hooks/api/schools/useSchoolProm"
import { YearSelect } from "./YearSelect"

interface params {
  hook: [Partial<IEmployeePosition> | undefined, Dispatch<SetStateAction<Partial<IEmployeePosition> | undefined>>]
  schoolProm?: ISchoolProm
  type: IPosition['type']
}
export const SelectEmployeePosition = ({hook, schoolProm, type}: params) => {
  const [epSelected, setEPSelected] = hook
  const [employeePositions, setEmployeePositions] = useState<Array<Partial<IEmployeePosition>>>()
  const [year, setYear] = useState<number>((schoolProm?.year ?? new Date().getFullYear()))
  const useEmployeePositions = useEmployeePosition()
  const useEmployees = useEmployee()
  const usePositions = usePosition()
  const useSchoolProms = useSchoolProm({autoFetch: false})

  useEffect(() => {
    const getData = async () => {
      if (schoolProm) {
        await useSchoolProms.fetch({
          searchBy: {
            schoolId: schoolProm?.schoolId
          }
        })
      }
      if (!schoolProm) {
        await useSchoolProms.fetch({
          searchBy: {
            year
          }
        })
      }
    }

    getData()
  }, [year, schoolProm?.id])

  useEffect(() => {
    const getData = async () => {
      if (!useSchoolProms.data) return setEmployeePositions(undefined)
      const res = await Promise.all(
        useSchoolProms.data?.map(
          async (p) => {
            const principal = await useEmployeePositions.findOne({id: p.principalId})
            return {
              employee: await useEmployees.findOne({id: principal?.employeeId}),
              position: await usePositions.findOne({id: principal?.positionId}),
              id: principal?.id
            }
          }
        )
      )
      setEmployeePositions(res)
    }
    getData()
  }, [
    useSchoolProms.data,
    useSchoolProms.data?.length,
    useEmployeePositions.data,
    useEmployeePositions.data?.length,
    usePositions.data,
    usePositions.data?.length,
    useEmployees.data,
    useEmployees.data?.length
  ])

  useEffect(() => {
    const res = employeePositions?.find((e) => e.id === epSelected?.id)
    if (!res) setEPSelected(undefined)
  }, [epSelected, employeePositions])


  const findEPName = (id: IEmployeePosition['id']) => {
    const ep = employeePositions?.find((e) => e.id === id)
    if (!ep) return 'Desconocido'
    return `${ep.employee?.profesion} ${ep.employee?.firstName} ${ep.employee?.lastName} (${ep?.position?.name})`
  }

  const handleChange = (e: SelectChangeEvent) => {
    const ep = employeePositions?.find((p) => p.id === e.target.value)
    if (ep) {
      setEPSelected(ep)
    }
  }

  const getDefaultEP = (id: IEmployeePosition['id']) => {
    const ep = employeePositions?.find((p) => p.id === id)
    if (!ep || !ep.id) return 'null'
    return ep.id
  }

  const getLabel = (type: PositionType) => {
    if (type === PositionType.PRINCIPAL) return 'Director'
    if (type === PositionType.PROFESOR) return 'Docente'
    return 'Encargado'
  }

  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={schoolProm ? 12 : 6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{getLabel(type)}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={getDefaultEP(epSelected?.id)}
            fullWidth
            label={getLabel(type)}
            onChange={handleChange}
          >
            <MenuItem value={'null'} key={`menu-item-position-null`}>
              {(!employeePositions?.length || employeePositions.length < 1) ? 'No hay registros' : 'Sin seleccionar'}
            </MenuItem>
            {employeePositions?.map(
              (ep, index) => <MenuItem
                value={ep.id}
                key={`menu-item-position-${index}`}
              >
                {findEPName(ep.id)}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>
      { !schoolProm && <Grid item xs={12} sm={6}>
        <YearSelect hook={[year, setYear]} />
      </Grid> }
    </Grid>
  </>
}
