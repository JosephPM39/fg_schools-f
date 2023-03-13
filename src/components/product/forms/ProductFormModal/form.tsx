import { ControlledCheckbox } from '../../../inputs/ControlledCheckbox'
import { BaseForm, InputsParams } from '../../../BaseDataTable/BaseFormModal'
import { Grid, TextField } from '@mui/material'
import { IProduct } from '../../../../api/models_school'
import { useProduct } from '../../../../hooks/api/products/useProduct'
import { getData } from './getData'
import { SelectFromList } from '../../../inputs/SelectFromList'
import { useType } from '../../../../hooks/api/products/useType'
import { useModel } from '../../../../hooks/api/products/useModel'
import { useSize } from '../../../../hooks/api/products/useSize'
import { useColor } from '../../../../hooks/api/products/useColor'
import { useBorder } from '../../../../hooks/api/products/useBorder'
import { useEffect } from 'react'

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
        <SelectFromList
          id="model"
          list={useModels.data}
          count={useModels.metadata?.count ?? 0}
          itemNameBy='name'
          defaultValue={data?.modelId}
          paginationNext={(p) => {
            useModels.launchNextFetch(p)
          }}
          onSelect={() => {}}
          name="model_id"
          title="Modelo"
          omitCreateOption
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectFromList
          id="size"
          list={useSizes.data}
          count={useSizes.metadata?.count ?? 0}
          itemNameBy='name'
          paginationNext={(p) => {
            useSizes.launchNextFetch(p)
          }}
          onSelect={() => {}}
          name="size_id"
          title="Tamaño"
          omitCreateOption
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectFromList
          id="type"
          list={useTypes.data}
          count={useTypes.metadata?.count ?? 0}
          itemNameBy='name'
          paginationNext={(p) => {
            useTypes.launchNextFetch(p)
          }}
          onSelect={() => {}}
          name="type_id"
          title="Tipo"
          omitCreateOption
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectFromList
          id="color"
          list={useColors.data}
          count={useColors.metadata?.count ?? 0}
          itemNameBy='name'
          paginationNext={(p) => {
            useColors.launchNextFetch(p)
          }}
          onSelect={() => {}}
          name="color_id"
          title="Color"
          omitCreateOption
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectFromList
          id="border"
          list={useBorders.data}
          count={useBorders.metadata?.count ?? 0}
          itemNameBy='name'
          paginationNext={(p) => {
            useBorders.launchNextFetch(p)
          }}
          onSelect={() => {}}
          name="border_id"
          title="Borde"
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
