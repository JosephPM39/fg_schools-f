import { Grid, TextField } from '@mui/material'
import { IBorder } from '../../../../api/models_school'
import { getData } from './getData'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'
import { useBorder } from '../../../../hooks/api/products/useBorder'
import { ControlledCheckbox } from '../../../inputs/ControlledCheckbox'

interface Params {
  idForUpdate?: IBorder['id']
  onSuccess?: () => void
}

const Inputs = ({ data, onChange }: InputsParams<IBorder>) => (
  <>
    <input
      name="border_id"
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
  const useBorders = useBorder({ initFetch: false })
  return (
    <BaseForm {...params} Inputs={Inputs} dataFormatter={getData} hook={useBorders}/>
  )
}
