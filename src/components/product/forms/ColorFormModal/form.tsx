import { Grid, TextField } from '@mui/material'
import { ControlledCheckbox } from '../../../inputs/ControlledCheckbox'
import { IColor } from '../../../../api/models_school'
import { getData } from './getData'
import { useColor } from '../../../../hooks/api/products/useColor'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'

interface Params {
  idForUpdate?: IColor['id']
  onSuccess?: () => void
}

const Inputs = ({ data, onChange }: InputsParams<IColor>) => (
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
        <TextField
          fullWidth
          value={data?.hex ?? '#000000'}
          onChange={(e) => onChange(e, 'hex')}
          name="hex"
          label="Hex"
          type='color'
          inputProps={{
            minLength: 7,
            maxLength: 9
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
  const useColors = useColor({ initFetch: false })
  return (
    <BaseForm {...params} Inputs={Inputs} dataFormatter={getData} hook={useColors}/>
  )
}
