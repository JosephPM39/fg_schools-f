import { Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import { ISize } from '../../../../api/models_school'
import { getData } from './getData'
import { useSize } from '../../../../hooks/api/products/useSize'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'

interface Params {
  idForUpdate?: ISize['id']
  onSuccess?: () => void
}

const Inputs = ({ data, onChange }: InputsParams<ISize>) => (
  <>
    <input
      name="size_id"
      type='text'
      value={data?.id}
      onChange={() => {}}
      hidden
    />
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.name}
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
        <TextField
          fullWidth
          value={data?.width}
          onChange={(e) => onChange(e, 'width')}
          name="width"
          label="Ancho"
          type='number'
          inputProps={{
            min: 0.5,
            max: 9999.99999,
            step: 0.5
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.height}
          onChange={(e) => onChange(e, 'height')}
          name="height"
          label="Alto"
          type='number'
          inputProps={{
            min: 0.5,
            max: 9999.99999,
            step: 0.5
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.ppp}
          onChange={(e) => onChange(e, 'ppp')}
          name="ppp"
          label="Píxeles por PULG"
          type='number'
          inputProps={{
            min: 1,
            max: 1200,
            step: 1
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
  const useSizes = useSize({ initFetch: false })
  return (
    <BaseForm {...params} Inputs={Inputs} dataFormatter={getData} hook={useSizes}/>
  )
}
