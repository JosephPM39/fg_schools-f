import { ControlledCheckbox } from '../../../inputs/ControlledCheckbox'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'
import { Grid, InputAdornment, TextField } from '@mui/material'
import { IModel } from '../../../../api/models_school'
import { useModel } from '../../../../hooks/api/products/useModel'
import { getData } from './getData'

interface Params {
  idForUpdate?: IModel['id']
  onSuccess?: () => void
}

const Inputs = ({ data, onChange }: InputsParams<IModel>) => (
  <>
    <input
      name="model_id"
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
            maxLength: 40
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.price ?? ''}
          onChange={(e) => onChange(e, 'price')}
          name="price"
          label="Precio"
          type='number'
          inputProps={{
            min: 0.01,
            max: 9999.99,
            step: 0.01
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start' children='$'/>
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.offer ?? ''}
          onChange={(e) => onChange(e, 'offer')}
          name="offer"
          label="Precio para promoción"
          type='number'
          inputProps={{
            min: 0.01,
            max: 9999.99,
            step: 0.01
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start' children='$'/>
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
  const useModels = useModel({ initFetch: false })
  return (
    <BaseForm {...params} Inputs={Inputs} dataFormatter={getData} hook={useModels}/>
  )
}
