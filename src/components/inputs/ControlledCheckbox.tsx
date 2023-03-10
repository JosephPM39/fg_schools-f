import { Checkbox, FormControlLabel } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'

interface Params {
  initState: boolean
  name: string
  label: string
}

export const ControlledCheckbox = (params: Params) => {
  const { initState, name, label } = params
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!initState) return
    setChecked(initState)
    console.log(initState, 'initState')
  }, [initState])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
  }

  return <FormControlLabel
    label={label}
    control={<Checkbox
      checked={checked}
      onChange={(e) => onChange(e)}
      name={name}
    />}
  />
}
