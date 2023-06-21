import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid'
import { ReactNode, useEffect, useState } from 'react'
import { IProductCombo, IProductOrder } from '../../../../api/models_school'
import { useBorder } from '../../../../hooks/api/products/useBorder'
import { useColor } from '../../../../hooks/api/products/useColor'
import { useModel } from '../../../../hooks/api/products/useModel'
import { useSize } from '../../../../hooks/api/products/useSize'
import { useType } from '../../../../hooks/api/products/useType'
import { Table } from '../../../Table'
import { getColorCell } from '../../../Table/renders'
import { ArrayElement, WithRequired } from '../../../types'

type List = Array<WithRequired<Omit<IProductCombo, 'id'> | Omit<IProductOrder, 'id' | 'orderId'>, 'product'>>

interface Params {
  list?: List | null
  createButton?: ReactNode
}

export const TableProduct = (params: Params) => {
  const useModels = useModel({ initFetch: false })
  const useTypes = useType({ initFetch: false })
  const useSizes = useSize({ initFetch: false })
  const useColors = useColor({ initFetch: false })
  const useBorders = useBorder({ initFetch: false })
  const { list } = params
  const [products, setProducts] = useState<List | null>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (!list) return setProducts(null)
    if (list.length < 1) return setProducts(null)
    console.log(list, 'LI')
    void Promise.all(list.map(async (item) => ({
      ...item,
      product: {
        ...item.product,
        size: await useSizes.findOne({ id: item.product.sizeId }) ?? undefined,
        type: await useTypes.findOne({ id: item.product.typeId }) ?? undefined,
        color: await useColors.findOne({ id: item.product.colorId }) ?? undefined,
        border: await useBorders.findOne({ id: item.product.borderId }) ?? undefined,
        model: await useModels.findOne({ id: item.product.modelId }) ?? undefined
      }
    }))).then((res) => {
      setProducts(res)
    })
  }, [list, useSizes.data, useTypes.data, useColors.data, useBorders.data, useModels.data])

  useEffect(() => {
    if (products === null) return setLoading(false)
    const loading = (list?.length ?? 0) < 1
    setLoading(loading)
  }, [products, list])

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
      type: 'string',
      valueGetter: ({ row }: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.name}`
      },
      flex: 1
    },
    {
      field: 'modelName',
      headerName: 'Modelo',
      flex: 1,
      valueGetter: ({ row }: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.model?.name ?? 'Cargando...'}`
      },
      type: 'string'
    },
    {
      field: 'size',
      headerName: 'Tamaño',
      flex: 1,
      valueGetter: ({ row }: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.size?.width ?? 'Cargando...'}x${row.product.size?.height ?? 'Cargando...'}`
      },
      type: 'string'
    },
    {
      field: 'typeProduct',
      headerName: 'Tipo',
      flex: 1,
      valueGetter: ({ row }: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product?.type?.name ?? 'Cargando...'}`
      },
      type: 'string'
    },
    {
      field: 'border',
      headerName: 'Borde',
      flex: 1,
      valueGetter: ({ row }: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.border?.name ?? 'Cargando...'}`
      },
      type: 'string'
    },
    {
      field: 'color',
      headerName: 'Color',
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, ArrayElement<List>>) => {
        const Render = getColorCell()
        return <>
          <Render value={params.row.product.color?.hex} />
        </>
      },
      type: 'actions'
    },
    {
      field: 'amount',
      headerName: 'Cantidad',
      flex: 1,
      type: 'number'
    },
    {
      field: 'inOffer',
      headerName: 'Precio Promo',
      flex: 1,
      type: 'boolean'
    },
    {
      field: 'price',
      headerName: 'Precio final',
      flex: 1,
      valueGetter: ({ row }: GridValueGetterParams<any, ArrayElement<List>>) => {
        if (!row.inOffer) return `$${row.product.model?.price ?? 'Cargando...'}`
        return `$${row.product.model?.offer ?? 'Cargando...'}`
      },
      type: 'string'
    }
  ]

  return <>
    <Table
      columns={columns}
      rows={products ?? []}
      isLoading={isLoading}
      toolbar={{
        add: params.createButton
      }}
      count={products?.length ?? 0}
      name={'Detalles del combo'}
      hideFooterPagination
      disableDefaultActions
    />
  </>
}
