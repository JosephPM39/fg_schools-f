import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { useEffect } from 'react'
import { IProduct } from '../../../api/models_school'
import { useBorder } from '../../../hooks/api/products/useBorder'
import { useColor } from '../../../hooks/api/products/useColor'
import { useModel } from '../../../hooks/api/products/useModel'
import { useProduct } from '../../../hooks/api/products/useProduct'
import { useSize } from '../../../hooks/api/products/useSize'
import { useType } from '../../../hooks/api/products/useType'
import { BaseTable } from '../../BaseDataTable/BaseTable'
import { ProductFormModal } from '../forms/ProductFormModal'

export const TableProduct = () => {
  const useProducts = useProduct()

  const useTypes = useType({ initFetch: false })
  const useModels = useModel({ initFetch: false })
  const useSizes = useSize({ initFetch: false })
  const useColors = useColor({ initFetch: false })
  const useBorders = useBorder({ initFetch: false })

  useEffect(() => {
    const getData = async () => {
      const d = await Promise.all(useProducts.data.map(async (item) => ({
        ...item,
        model: item.model ?? await useModels.findOne({ id: item.modelId }) ?? undefined,
        size: item.size ?? await useSizes.findOne({ id: item.sizeId }) ?? undefined,
        type: item.type ?? await useTypes.findOne({ id: item.typeId }) ?? undefined,
        border: item.border ?? await useBorders.findOne({ id: item.borderId }) ?? undefined,
        color: item.color ?? await useColors.findOne({ id: item.colorId }) ?? undefined
      })))
      useProducts.setData(d)
    }
    void getData()
  }, [useProducts.data.length])

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
      flex: 1
    },
    {
      field: 'modelId',
      headerName: 'Modelo',
      valueGetter: (p: GridValueGetterParams<any, IProduct>) => {
        return p.row.model?.name ?? 'Cargando...'
      },
      type: 'string'
    },
    {
      field: 'sizeId',
      headerName: 'Tamaño',
      valueGetter: (p: GridValueGetterParams<any, IProduct>) => {
        return p.row.size?.name ?? 'Cargando...'
      },
      type: 'string'
    },
    {
      field: 'typeId',
      headerName: 'Tipo',
      valueGetter: (p: GridValueGetterParams<any, IProduct>) => {
        return p.row.type?.name ?? 'Ninguno'
      },
      type: 'string'
    },
    {
      field: 'colorId',
      headerName: 'Color',
      valueGetter: (p: GridValueGetterParams<any, IProduct>) => {
        return p.row.color?.name ?? 'Ninguno'
      },
      type: 'string'
    },
    {
      field: 'borderId',
      headerName: 'Borde',
      valueGetter: (p: GridValueGetterParams<any, IProduct>) => {
        return p.row.border?.name ?? 'Ninguno'
      },
      type: 'string'
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean'
    }
  ]

  return <BaseTable
    FormModal={ProductFormModal}
    hook={useProducts}
    name='Productos'
    columns={columns}
  />
}
