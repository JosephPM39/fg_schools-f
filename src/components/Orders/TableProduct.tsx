import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid"
import { ElementType, useCallback, useEffect, useState } from "react"
import { IBorder, IOrder, IProduct, IProductCombo, IProductOrder } from "../../api/models_school"
import { useBorder } from "../../hooks/api/products/useBorder"
import { useColor } from "../../hooks/api/products/useColor"
import { useModel } from "../../hooks/api/products/useModel"
import { useSize } from "../../hooks/api/products/useSize"
import { useType } from "../../hooks/api/products/useType"
import { useTextWrap } from "../../hooks/useTextWrap"
import { Table } from "../Table"
import { getColorCell } from "../Table/renders"
import { ArrayElement, WithRequired } from "../types"

type List = Array<WithRequired<IProductCombo | IProductOrder, 'product'>>

interface Params {
  list?: List | null
  studentName: string
}

export const TableProduct = (params: Params) => {
  const useModels = useModel({initFetch: false})
  const useTypes = useType({initFetch: false})
  const useSizes = useSize({initFetch: false})
  const useColors = useColor({initFetch: false})
  const useBorders = useBorder({initFetch: false})
  const { list } = params
  const [products, setProducts] = useState<List | null>([])
  const { formatTextWrap } = useTextWrap()
  const studentName = formatTextWrap(params.studentName, 60)

  useEffect(() => {
    if (!list) return setProducts(null)
    Promise.all(list.map(async (item) => ({
      ...item,
      product: {
        ...item.product,
        size: await useSizes.findOne({id: item.product.sizeId}) ?? undefined,
        type: await useTypes.findOne({id: item.product.typeId}) ?? undefined,
        color: await useColors.findOne({id: item.product.colorId}) ?? undefined,
        border: await useBorders.findOne({id: item.product.borderId}) ?? undefined,
        model: await useModels.findOne({id: item.product.modelId}) ?? undefined
      }
    }))).then((res) => {
      setProducts(res)
    })
  }, [list, useSizes.data, useTypes.data, useColors.data, useBorders.data, useModels.data])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: "ID",
      type: 'string',
      disableExport: true,
      flex: 1
    },
    {
      field: 'name',
      headerName: 'Nombre',
      type: 'string',
      valueGetter: ({row}: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.name}`
      },
      flex: 1,
    },
    {
      field: 'modelName',
      headerName: 'Modelo',
      flex: 1,
      valueGetter: ({row}: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.model?.name}`
      },
      type: 'string'
    },
    {
      field: 'size',
      headerName: 'Tamaño',
      flex: 1,
      valueGetter: ({row}: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.size?.width}x${row.product.size?.height}`
      },
      type: 'string'
    },
    {
      field: 'type',
      headerName: 'Tipo',
      flex: 1,
      valueGetter: ({row}: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.type?.name}`
      },
      type: 'string'
    },
    {
      field: 'border',
      headerName: 'Borde',
      flex: 1,
      valueGetter: ({row}: GridValueGetterParams<any, ArrayElement<List>>) => {
        return `${row.product.border?.name}`
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
      }
    },
    {
      field: 'available',
      headerName: 'Disponible',
      type: 'boolean',
    }
  ]

  const [open, setOpen] = useState(false)
  const [idForUpdate, setIdForUpdate] = useState<IBorder['id']>()

  useEffect(() => {
    if (idForUpdate) {
      setOpen(true)
    }
  }, [idForUpdate])

  const isLoading = useCallback(() => {
    console.log(products, 'prod')
    if (products === null) return false
    return (products.length < 1)
  }, [products])

  return <>
    {// <BorderFormModal state={[open, setOpen]} idForUpdate={idForUpdate} noButton/>
    }
    <Table
      columns={columns}
      rows={products ?? []}
      isLoading={isLoading()}
      count={products?.length || 0}
      name={`Detalles del combo de: ${studentName}`}
      disableDefaultActions
      hideFooterPagination
    />
  </>
}
