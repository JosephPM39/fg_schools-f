import { useEffect } from 'react'
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { ICombo, IProductCombo } from '../../../api/models_school'
import { useProduct } from '../../../hooks/api/products/useProduct'
import { useProductPerCombo } from '../../../hooks/api/store/useProductPerCombo'
import { BaseTable } from '../../BaseDataTable/BaseTable'
import { ProductComboFormModal, Params as PCFMParams } from '../forms/ProductComboFormModal'

interface Params {
  comboId: ICombo['id']
}

export const TableProductCombo = (params: Params) => {
  const {
    comboId
  } = params

  const useProductsPerCombos = useProductPerCombo({ initFetch: false })
  const useProducts = useProduct({ initFetch: false })

  useEffect(() => {
    console.log(useProductsPerCombos.data, 'updating')
  }, [useProductsPerCombos.data])

  useEffect(() => {
    void useProductsPerCombos.fetch({
      searchBy: { comboId }
    })
  }, [comboId])

  useEffect(() => {
    const getData = async () => {
      const d = await Promise.all(useProductsPerCombos.data.map(async (item) => {
        const product = await useProducts.findOne({ id: item.productId })
        if (!product) {
          return item
        }
        return {
          ...item,
          product: product
        }
      }))
      useProductsPerCombos.setData(d)
    }
    void getData()
  }, [useProductsPerCombos.data.length])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      type: 'string',
      disableExport: true,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Nombre',
      valueGetter: (p: GridValueGetterParams<any, IProductCombo>) => {
        return p.row.product?.name ?? 'Cargando...'
      },
      type: 'string'
    },
    {
      field: 'amount',
      headerName: 'Cantidad',
      type: 'number'
    },
    {
      field: 'inOffer',
      headerName: 'Precio promoción',
      type: 'boolean'
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean'
    }
  ]

  return <BaseTable
    FormModal={(params: PCFMParams<IProductCombo>) => {
      return <ProductComboFormModal
        {...params}
        extra={{
          omitSelectCombo: true,
          comboId
        }}
      />
    }}
    hook={useProductsPerCombos}
    name='Productos por el combo'
    columns={columns}
  />
}
