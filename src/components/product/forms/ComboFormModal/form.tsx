import { Grid, TextField } from '@mui/material'
import { ControlledCheckbox } from '../../../inputs/ControlledCheckbox'
import { ICombo } from '../../../../api/models_school'
import { getData } from './getData'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'
import { useCombo } from '../../../../hooks/api/store/useCombo'

interface Params {
  idForUpdate?: ICombo['id']
  onSuccess?: () => void
}

const Inputs = ({ data, onChange }: InputsParams<ICombo>) => (
  <>
    <input
      name="color_id"
      type='text'
      value={data?.id ?? ''}
      onChange={() => {}}
      hidden
    />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.name ?? ''}
          onChange={(e) => onChange(e, 'name')}
          InputLabelProps={{
            shrink: !!data?.name
          }}
          name="name"
          label="Nombre"
          type='text'
          inputProps={{
            minLength: 1,
            maxLength: 30
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ControlledCheckbox
          label='Disponible'
          initState={data?.available ?? false}
          name='available'
        />
      </Grid>
    </Grid>
  </>
)

export const Form = (params: Params) => {
  const useCombos = useCombo({ initFetch: false })
  return (
    <BaseForm {...params} Inputs={Inputs} dataFormatter={getData} hook={useCombos}/>
  )
}
