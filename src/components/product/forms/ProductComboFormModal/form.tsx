import { ControlledCheckbox } from '../../../inputs/ControlledCheckbox'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'
import { Grid, InputAdornment, TextField } from '@mui/material'
import { IProductCombo } from '../../../../api/models_school'
import { useProduct } from '../../../../hooks/api/products/useProduct'
import { getData } from './getData'
import { useEffect } from 'react'
import { ComboBoxLazy } from '../../../inputs/ComboBox'
import { useProductPerCombo } from '../../../../hooks/api/store/useProductPerCombo'
import { useCombo } from '../../../../hooks/api/store/useCombo'
import { SelectComboId } from './type'

type Params = {
  idForUpdate?: IProductCombo['id']
  onSuccess?: () => void
} & SelectComboId

const Inputs = ({ data, onChange, ...params }: InputsParams<IProductCombo> & SelectComboId) => {
  const useProducts = useProduct({ initFetch: false })
  const useCombos = useCombo({ initFetch: false })

  useEffect(() => {
    void useProducts.fetch({ searchBy: { available: true } })
    if (params.omitSelectCombo) return
    void useCombos.fetch({ searchBy: { available: true } })
    console.log(params, 'params')
  }, [params.omitSelectCombo])

  return <>
    <input
      name="product_combo_id"
      type='text'
      value={data?.id ?? ''}
      onChange={() => { }}
      hidden
    />
    { params.omitSelectCombo && <input
      name="combo_id"
      type='text'
      value={params.comboId ?? ''}
      onChange={() => { }}
      hidden
    />}
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          value={data?.amount ?? ''}
          onChange={(e) => onChange(e, 'amount')}
          name="amount"
          label="Cantidad"
          type='number'
          inputProps={{
            min: 1,
            max: 99999,
            step: 1
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start' children='#' />
          }}
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ComboBoxLazy
          itemLabelBy='name'
          label='Producto'
          name='product_id'
          searchMaxLength={30}
          defaultValue={data?.productId}
          id='product'
          required
          hook={useProducts}
          omitCreateOption
        />
      </Grid>
      {!params.omitSelectCombo && <Grid item xs={12} sm={6}>
        <ComboBoxLazy
          itemLabelBy='name'
          label='Combo'
          name='combo_id'
          searchMaxLength={30}
          defaultValue={data?.comboId}
          id='combo'
          required
          hook={useCombos}
          omitCreateOption
        />
      </Grid>
      }

      <Grid item xs={12} sm={6}>
        <ControlledCheckbox
          label='Precio promoción'
          initState={data?.inOffer ?? false}
          name='in_offer'
        />
      </Grid>
    </Grid>
  </>
}

export const Form = (params: Params) => {
  const { idForUpdate, onSuccess, ...rest } = params
  const useProductsPerCombos = useProductPerCombo({ initFetch: false })
  return (
    <BaseForm {...params} Inputs={(params: InputsParams<IProductCombo>) => {
      return <Inputs
        {...params}
        {...rest}
      />
    }} dataFormatter={getData} hook={useProductsPerCombos} />
  )
}
