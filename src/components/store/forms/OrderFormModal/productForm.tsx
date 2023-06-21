import { Box, Button, Grid, TextField } from '@mui/material'
import { useProduct } from '../../../../hooks/api/products/useProduct'
import { ComboBoxLazy } from '../../../inputs/ComboBox'
import { useModel } from '../../../../hooks/api/products/useModel'
import { useColor } from '../../../../hooks/api/products/useColor'
import { useBorder } from '../../../../hooks/api/products/useBorder'
import { useSize } from '../../../../hooks/api/products/useSize'
import React, { SetStateAction, useEffect, useState } from 'react'
import { IBorder, IColor, IModel, IProduct, IProductOrder, ISize } from '../../../../api/models_school'
import { ControlledCheckbox } from '../../../inputs/ControlledCheckbox'
import { Modal } from '../../../../containers/Modal'
import { CardBox } from './CardBox'

interface formParams {
  onSubmit: (product: Omit<IProductOrder, 'orderId'>) => void
  state: [boolean, React.Dispatch<SetStateAction<boolean>>]
}

export const ProductForm = ({ onSubmit }: Pick<formParams, 'onSubmit'>) => {
  const useProducts = useProduct({ initFetch: false })
  const useModels = useModel()
  const useColors = useColor()
  const useBorders = useBorder()
  const useSizes = useSize()

  const [orderProduct, setOrderProduct] = useState<Omit<IProductOrder, 'orderId'>>()
  const [product, setProduct] = useState<IProduct>()
  const [model, setModel] = useState<IModel>()
  const [color, setColor] = useState<IColor>()
  const [border, setBorder] = useState<IBorder>()
  const [size, setSize] = useState<ISize>()
  const [inOffer, setInOffer] = useState<boolean>(false)
  const [amount, setAmount] = useState<number>(1)

  useEffect(() => {
    setProduct(undefined)
    void useProducts.fetch({
      searchBy: {
        modelId: model?.id,
        colorId: color?.id,
        borderId: border?.id,
        sizeId: size?.id
      }
    })
  }, [model, color, border, size])

  useEffect(() => {
    setOrderProduct({
      productId: product?.id,
      inOffer,
      amount
    })
  }, [product, amount, inOffer])

  return <>
    <form onSubmit={() => {
      if (!orderProduct) return
      onSubmit(orderProduct)
    }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CardBox title='Filtrar producto'>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ComboBoxLazy
                  itemLabelBy='name'
                  label='Color'
                  name='color_id'
                  searchMaxLength={30}
                  id='color'
                  onChange={(id) => {
                    useColors.findOne({ id }).then((res) => {
                      setColor(res ?? undefined)
                    }).catch((_) => {
                      setColor(undefined)
                    })
                  }}
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
                  id='border'
                  onChange={(id) => {
                    useBorders.findOne({ id }).then((res) => {
                      setBorder(res ?? undefined)
                    }).catch((_) => {
                      setBorder(undefined)
                    })
                  }}
                  hook={useBorders}
                  omitCreateOption
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ComboBoxLazy
                  itemLabelBy='name'
                  label='Modelo'
                  name='model_id'
                  searchMaxLength={30}
                  id='model'
                  onChange={(id) => {
                    useModels.findOne({ id }).then((res) => {
                      setModel(res ?? undefined)
                    }).catch((_) => {
                      setModel(undefined)
                    })
                  }}
                  hook={useModels}
                  omitCreateOption
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ComboBoxLazy
                  itemLabelBy='name'
                  label='Tamaño'
                  name='size_id'
                  searchMaxLength={30}
                  id='size'
                  onChange={(id) => {
                    useSizes.findOne({ id }).then((res) => {
                      setSize(res ?? undefined)
                    }).catch((_) => {
                      setSize(undefined)
                    })
                  }}
                  hook={useSizes}
                  omitCreateOption
                />
              </Grid>
            </Grid>
          </CardBox>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardBox title='Producto a agregar'>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ComboBoxLazy
                  itemLabelBy='name'
                  label='Producto'
                  name='product_id'
                  searchMaxLength={30}
                  id='product'
                  required
                  onChange={(id) => {
                    useProducts.findOne({ id }).then((res) => {
                      setProduct(res ?? undefined)
                    }).catch((_) => {
                      setProduct(undefined)
                    })
                  }}
                  hook={useProducts}
                  omitCreateOption
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  value={amount ?? ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    setAmount(value)
                  }}
                  InputLabelProps={{
                    shrink: !!amount
                  }}
                  name="amount"
                  label="Cantidad"
                  type='number'
                  inputProps={{
                    max: 500,
                    min: 1,
                    step: 1
                  }}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControlledCheckbox
                  label='Precio promoción'
                  initState={!!inOffer}
                  hook={[inOffer, setInOffer]}
                  name='in_offer'
                />
              </Grid>
            </Grid>
          </CardBox>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button type='submit' variant='contained'>
            Agregar
          </Button>
        </Grid>
      </Grid>
    </form>
  </>
}

export const ProductFormModal = (params: formParams) => {
  return <Modal
    noButton
    title={'Agregar producto'}
    state={params.state}
    fullScreen
  >
    <Box
      marginY={4}
      marginX={4}
    >
      <ProductForm onSubmit={params.onSubmit} />
    </Box>
  </Modal>
}
