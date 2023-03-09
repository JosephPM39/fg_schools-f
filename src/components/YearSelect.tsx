import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { isNumber } from 'class-validator'
import { useEffect, useState } from 'react'

interface params {
  onSelect: (select: number) => void
  defaultValue?: number
}

export const YearSelect = ({ onSelect, defaultValue }: params) => {
  const [year, setYear] = useState<number>(defaultValue ?? new Date().getFullYear())

  useEffect(() => {
    onSelect(year)
  }, [year])

  const handleChange = (event: SelectChangeEvent) => {
    const yearSelected = parseInt(String(event?.target?.value))
    if (isNumber(yearSelected)) {
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
