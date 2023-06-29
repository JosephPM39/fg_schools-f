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
import { v4 as uuidV4 } from 'uuid'

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
  const [originalComboProducts, setOriginalComboProducts] = useState<IProductCombo[]>([])
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
      if (!combo) {
        setComboProducts([])
        setOriginalComboProducts([])
        return
      }
      const productsCombo = await useProductsPerCombo.findBy({
        comboId: combo?.id
      })
      if (!productsCombo) return
      setComboProducts(productsCombo)
      setOriginalComboProducts(productsCombo)
    }
    void getData()
  }, [combo])

  useEffect(() => {
    const getData = async () => {
      const getProducts = async (list: IProductCombo[] | Product[], addID?: boolean) => {
        if (list.length < 1) return []
        return await Promise.all(list.map(async (p) => ({
          id: addID ? uuidV4() : p.id,
          amount: p.amount,
          inOffer: p.inOffer,
          productId: p.productId,
          product: await useProducts.findOne({ id: p.productId }) ?? undefined
        })))
      }
      const cProducts = await getProducts(comboProducts)
      const oProducts = await getProducts(orderProducts, false)
      const products: Product[] = [...cProducts, ...oProducts] as Product[]
      setProductsList(products)
    }
    void getData()
  }, [comboProducts, orderProducts])

  useEffect(() => {
    const productEquals = (p: Product, c: IProductCombo) => {
      const keys: Array<keyof Product> = ['amount', 'inOffer', 'productId']
      let isEquals = true
      const parity: string[] = []
      keys.forEach((key) => {
        isEquals = (c[key] === p[key])
        parity.push(`${key}:${String(isEquals)}`)
      })
      console.table('Parity: ', parity)
      return isEquals
    }
    const listProductsEquals = (pl: Product[], cl: IProductCombo[]) => {
      if (pl.length !== cl.length) return false
      const existInList = (p: Product) => {
        const product = cl.find((c) => {
          return productEquals(p, c)
        })
        console.log('Product', product)
        const exists = !!product
        return exists
      }
      return pl.every(existInList)
    }
    const isCustom = () => {
      const listEquals = listProductsEquals(productsList ?? [], originalComboProducts)
      console.log('Equals', listEquals)
      return !listEquals
    }
    setIsCustom(isCustom())
  }, [productsList, originalComboProducts])

  const deleteAction = (id: Product['id']) => {
    const orderList = (orderProducts ?? []).filter((v) => v.id !== id)
    const comboList = (comboProducts ?? []).filter((v) => v.id !== id)
    if (comboList.length < comboProducts.length) {
      return setComboProducts(comboList)
    }
    if (orderList.length < orderProducts.length) {
      return setOrderProducts(orderList)
    }
  }

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
            deleteAction={deleteAction}
            createButton={
              <Button startIcon={<Add />} onClick={() => {
                setIsOpen(true)
              }}>
                Nuevo
              </Button>
            }
          />
        </Grid>
        {isCustom ? 'Custom' : 'Original'}
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
