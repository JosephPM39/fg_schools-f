import { ControlledCheckbox } from '../../../inputs/ControlledCheckbox'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'
import { Grid, TextField } from '@mui/material'
import { IProduct } from '../../../../api/models_school'
import { useProduct } from '../../../../hooks/api/products/useProduct'
import { getData } from './getData'
import { useType } from '../../../../hooks/api/products/useType'
import { useModel } from '../../../../hooks/api/products/useModel'
import { useSize } from '../../../../hooks/api/products/useSize'
import { useColor } from '../../../../hooks/api/products/useColor'
import { useBorder } from '../../../../hooks/api/products/useBorder'
import { useEffect } from 'react'
import { ComboBoxLazy } from '../../../inputs/ComboBox'

interface Params {
  idForUpdate?: IProduct['id']
  onSuccess?: () => void
}

const Inputs = ({ data, onChange }: InputsParams<IProduct>) => {
  const useTypes = useType({ initFetch: false })
  const useModels = useModel({ initFetch: false })
  const useSizes = useSize({ initFetch: false })
  const useColors = useColor({ initFetch: false })
  const useBorders = useBorder({ initFetch: false })

  useEffect(() => {
    void useTypes.fetch({ searchBy: { available: true } })
    void useModels.fetch({ searchBy: { available: true } })
    void useSizes.fetch({ searchBy: { available: true } })
    void useColors.fetch({ searchBy: { available: true } })
    void useBorders.fetch({ searchBy: { available: true } })
    return () => {}
  }, [])

  useEffect(() => {
    void useModels.findOne({ id: data?.modelId })
  })

  return <>
    <input
      name="product_id"
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
        <ComboBoxLazy
          itemLabelBy='name'
          label='Modelo'
          name='model_id'
          searchMaxLength={50}
          defaultValue={data?.modelId}
          id='model'
          required
          hook={useModels}
          omitCreateOption
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ComboBoxLazy
          itemLabelBy='name'
          label='Tamaño'
          name='size_id'
          searchMaxLength={50}
          // defaultValue={data?.sizeId}
          id='size'
          required
          hook={useSizes}
          omitCreateOption
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ComboBoxLazy
          itemLabelBy='name'
          label='Tipo'
          name='type_id'
          searchMaxLength={50}
          // defaultValue={data?.typeId}
          id='type'
          required
          hook={useTypes}
          omitCreateOption
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ComboBoxLazy
          itemLabelBy='name'
          label='Color'
          name='color_id'
          searchMaxLength={30}
          // defaultValue={data?.colorId}
          id='color'
          required
          hook={useColors}
          omitCreateOption
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ComboBoxLazy
          itemLabelBy='name'
          label='Borde'
          name='border_id'
          searchMaxLength={30}
          // defaultValue={data?.borderId}
          id='border'
          required
          hook={useBorders}
          omitCreateOption
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
}

export const Form = (params: Params) => {
  const useProducts = useProduct({ initFetch: false })
  return (
    <BaseForm {...params} Inputs={Inputs} dataFormatter={getData} hook={useProducts}/>
  )
}
