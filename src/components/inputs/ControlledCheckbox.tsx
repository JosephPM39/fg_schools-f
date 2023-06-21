import { Checkbox, FormControlLabel } from '@mui/material'
import React, { ChangeEvent, SetStateAction, useEffect, useState } from 'react'

interface Params {
  initState: boolean
  name: string
  label: string
  hook?: [boolean, React.Dispatch<SetStateAction<boolean>>]
}

export const ControlledCheckbox = (params: Params) => {
  const { initState, name, label } = params
  const interHook = useState(false)
  const hook = params.hook ?? interHook
  const [checked, setChecked] = hook

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
