import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { IType } from '../../../../api/models_school';
import { getData } from './getData';
import { BaseForm, InputsParams } from '../BaseFormModal';
import { useType } from '../../../../hooks/api/products/useType';

interface Params {
  idForUpdate?: IType['id'],
  onSuccess?: () => void
}

const Inputs = ({data, onChange}: InputsParams<IType>) => (
  <>
    <input
      name="type_id"
      type='text'
      value={data?.['id'] || ''}
      onChange={() => {}}
      hidden
    />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.name || ''}
          onChange={(e) => onChange(e, 'name')}
          InputLabelProps={{
            shrink: !!data?.name
          }}
          name="name"
          label="Nombre"
          type='text'
          inputProps={{
            minLength: 1,
            maxLength: 30,
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          label='Disponible'
          control={<Checkbox
            defaultChecked={data?.available}
            name='available'
          />}
        />
      </Grid>
    </Grid>
  </>
)

export const Form = (params: Params) => {
  const useTypes = useType({initFetch: false})
  return (
    <BaseForm {...params} Inputs={Inputs} dataFormatter={getData} hook={useTypes}/>
  )
}

