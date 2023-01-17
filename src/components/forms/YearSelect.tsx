import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { isNumber } from "class-validator"
import { Dispatch, SetStateAction } from "react"

interface params {
  hook: [number | undefined, Dispatch<SetStateAction<number>> | undefined]
}

export const YearSelect = ({hook}: params) => {
  const [year, setYear] = hook

  const handleChange = (event: SelectChangeEvent) => {
    const yearSelected = parseInt(String(event?.target?.value))
    if (isNumber(yearSelected) && setYear) {
      setYear(yearSelected)
    }
  }

  const years = [...new Array(111)].map((_, i) => i + 1990)

  return (
    <FormControl fullWidth size='small'>
      <InputLabel id="year-select-label">&#8288;Año</InputLabel>
      <Select
        fullWidth
        labelId="year-select-label"
        id="year-select"
        value={String(year) ?? 'null'}
        label="&#8288;Año"
        onChange={handleChange}
      >
        {years.map(
          (year, index) => <MenuItem value={year} key={`menu-item-position-${index}`}> {year} </MenuItem>
        )}
      </Select>
    </FormControl>
  )
}
