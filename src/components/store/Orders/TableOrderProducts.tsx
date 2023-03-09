import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { ICombo, IOrder, IProductCombo, IProductOrder } from '../../../api/models_school'
import { useProduct } from '../../../hooks/api/products/useProduct'
import { useProductPerCombo } from '../../../hooks/api/store/useProductPerCombo'
import { useProductPerOrder } from '../../../hooks/api/store/useProductPerOrder'
import { WithRequired } from '../../types'
import { TableProduct } from './TableProduct'

interface ByOrder {
  orderId: IOrder['id']
}

interface ByCombo {
  comboId: ICombo['id']
}

interface BaseParams {
  studentName: string
}

type Params = (ByOrder | ByCombo) & BaseParams
export type { Params as OrderProductsParams }

function isByCombo (p: Params): p is ByCombo & BaseParams {
  return typeof (p as ByCombo & BaseParams).comboId !== 'undefined'
}

type ProductsList = Array<IProductOrder | IProductCombo> | null
type ProductsListR = Array<WithRequired<IProductOrder | IProductCombo, 'product'>> | null | undefined

export const TableOrderProducts = (params: Params) => {
  const useProductPerOrders = useProductPerOrder({ initFetch: false })
  const useProductPerCombos = useProductPerCombo({ initFetch: false })
  const useProducts = useProduct({ initFetch: false })
  const [productsOrder, setProductsOrder] = useState<ProductsListR>([])

  const fetchDepends = async (list: ProductsList) => {
    if (list == null) return list
    const res = await Promise.all(list.map(async (item) => ({
      ...item,
      product: await useProducts.findOne({ id: item.productId }) ?? undefined
    })))
    return res as ProductsListR
  }

  useEffect(() => {
    if (isByCombo(params)) {
      const { comboId } = params
      if (!comboId) return setProductsOrder(null)
      void useProductPerCombos.fetch({ searchBy: { comboId } })
        .then((res) => {
          void fetchDepends(res.data).then((data) => setProductsOrder(data))
        })
      return
    }
    const { orderId } = params
    if (!orderId) return setProductsOrder(null)
    void useProductPerOrders.fetch({ searchBy: { orderId } })
      .then((res) => {
        void fetchDepends(res.data).then((data) => setProductsOrder(data))
      })
  }, [params])

  useEffect(() => {
    productsOrder?.forEach((p) => {
      void useProducts.findOne({ id: p.productId })
    })
  }, [productsOrder])

  console.log(productsOrder, 'longitud')

  return <Box minWidth='600px'>
    <TableProduct list={productsOrder} studentName={params.studentName}/>
  </Box>
}
