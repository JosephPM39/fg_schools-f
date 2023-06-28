import { Button, Grid, TextField } from '@mui/material'
import { ChangeEvent, useEffect, useState } from 'react'
import { Add } from '@mui/icons-material'
import { TableProduct } from './../productsTable'
import { ICombo, IProductCombo, IProductOrder } from '../../../../../api/models_school'
import { WithRequired } from '../../../../types'
import { ProductFormModal } from './../productForm'
import { useProduct } from '../../../../../hooks/api/products/useProduct'
import { useProductPerCombo } from '../../../../../hooks/api/store/useProductPerCombo'
import { useCombo } from '../../../../../hooks/api/store/useCombo'
import { ComboBoxLazy } from '../../../../inputs/ComboBox'
import { CardBox } from './../CardBox'
import { useModel } from '../../../../../hooks/api/products/useModel'

export type Product = WithRequired<Omit<IProductOrder, 'orderId' | 'order'>, 'product' | 'inOffer' | 'amount'>

interface WithCustom {
  isCustom: true
  list: Product[]
}

interface WithoutCustom {
  isCustom: false
  combo: ICombo
}

export type Data = {
  isCustom: boolean
  extraInfo: string
  total: number
} & (WithCustom | WithoutCustom)

interface ProductsParams {
  onChange: (p: Data) => void
}

export const Products = ({ onChange }: ProductsParams) => {
  const useProducts = useProduct({ initFetch: false })
  const useProductsPerCombo = useProductPerCombo({ initFetch: false })
  const useModels = useModel({ initFetch: false })
  const useCombos = useCombo()

  const [orderProducts, setOrderProducts] = useState<Product[]>([])
  const [productsList, setProductsList] = useState<Product[] | null>([])
  const [comboProducts, setComboProducts] = useState<IProductCombo[]>([])
  const [combo, setCombo] = useState<ICombo>()
  const [newProduct, setNewProduct] = useState<Omit<IProductOrder, 'orderId'>>()
  const [isCustom, setIsCustom] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [extraInfo, setExtraInfo] = useState('')

  useEffect(() => {
    if (!newProduct) return
    const getData = async () => {
      const productData = await useProducts.findOne({ id: newProduct.productId })
      if (!productData) return
      const productOrder: Product = {
        ...newProduct,
        product: productData
      }
      setOrderProducts([...orderProducts, productOrder])
    }
    void getData()
  }, [newProduct])

  useEffect(() => {
    const getData = async () => {
      console.log(combo, 'Combo TT')
      if (!combo) {
        console.log(combo, 'bad Combo TT')
        return setComboProducts([])
      }
      console.log('good Combo TT')
      const productsCombo = await useProductsPerCombo.findBy({
        comboId: combo?.id
      })
      if (!productsCombo) return
      setComboProducts(productsCombo)
    }
    void getData()
  }, [combo])

  useEffect(() => {
    const getData = async () => {
      const cProducts = await Promise.all(comboProducts.map(async (p) => ({
        amount: p.amount,
        inOffer: p.inOffer,
        productId: p.productId,
        product: await useProducts.findOne({ id: p.productId }) ?? undefined
      })))
      const oProducts = await Promise.all(orderProducts.map(async (p) => ({
        amount: p.amount,
        inOffer: p.inOffer,
        productId: p.productId,
        product: await useProducts.findOne({ id: p.productId }) ?? undefined
      })))

      const products: Product[] = [...cProducts, ...oProducts] as Product[]
      const productsId: Product[] = products.map((p, i) => ({ ...p, id: `${i}` })) as Product[]
      console.log(productsId, ' pid Combo TT')
      console.log(products, ' p Combo TT')
      setProductsList(productsId)
    }
    void getData()
  }, [comboProducts, orderProducts])

  useEffect(() => {
    setIsCustom(orderProducts.length > 0)
  }, [orderProducts])

  const getTotal = async () => {
    if (!productsList) return
    const total = await productsList.reduce(async (prev, current) => {
      const previous = await prev
      return await new Promise((resolve) => {
        void useModels.findOne({ id: current.product.modelId }).then((res) => {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          const price = (current.inOffer ? res?.offer : res?.price) || 0
          const finalPrice = price + previous
          resolve(finalPrice)
        })
      })
    }, Promise.resolve<number>(0))
    return total
  }

  useEffect(() => {
    const getData = async () => {
      const total = await getTotal()
      if (!total) return
      if (isCustom) {
        if (!productsList) return
        return onChange({
          list: productsList,
          total,
          isCustom,
          extraInfo
        })
      }
      if (!combo) return
      return onChange({
        combo,
        isCustom,
        total,
        extraInfo
      })
    }
    void getData()
  }, [productsList, combo, isCustom, extraInfo])

  return <>
    <ProductFormModal
      onSubmit={(item) => {
        setNewProduct(item)
      }}
      state={[isOpen, setIsOpen]}
    />
    <CardBox title='Orden'>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <ComboBoxLazy
            itemLabelBy='name'
            label='Combo'
            name='combo_id'
            searchMaxLength={30}
            id='combo'
            required
            onChange={(id) => {
              if (!id) return setCombo(undefined)
              useCombos.findOne({ id }).then((res) => {
                setCombo(res ?? undefined)
              }).catch((_) => {
                setCombo(undefined)
              })
            }}
            hook={useCombos}
            omitCreateOption
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TableProduct
            list={productsList}
            createButton={
              <Button startIcon={<Add />} onClick={() => {
                setIsOpen(true)
              }}>
                Nuevo
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            value={extraInfo ?? ''}
            InputLabelProps={{
              shrink: !!extraInfo
            }}
            name="extraInfo"
            label="Dato extra"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              const info = e.target.value
              setExtraInfo(info)
            }}
            inputProps={{
              maxLength: 254,
              minLength: 1
            }}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </CardBox>
  </>
}
