import { useEffect, useState } from "react"
import { IComboOrder, IOrder } from "../../../api/models_school"
import { useCombo } from "../../../hooks/api/store/useCombo"
import { useComboPerOrder } from "../../../hooks/api/store/useComboPerOrder"
import { CombosByOrders } from './types'

export const useGetComboPerOrders = (orderIdP?: IOrder['id']) => {
  const useComboPerOrders = useComboPerOrder({initFetch: false})
  const useCombos = useCombo({initFetch: false})
  const [comboPerOrders, setComboPerOrder] = useState<Array<IComboOrder> | null>([])
  const [isCustom, setIsCustom] = useState(false)
  const [orderId, setOrderId] = useState(orderIdP)

  useEffect(() => {
    useComboPerOrders.fetch({searchBy: { orderId }})
  }, [orderId])

  useEffect(() => {
    if (!useComboPerOrders.data) return
    Promise.all(useComboPerOrders.data.map(async (comboPerOrder) => {
      return {
        ...comboPerOrder,
        combo: await useCombos.findOne({id: comboPerOrder.comboId}) ?? undefined
      }
    })).then((res) => {
      setComboPerOrder(res)
    })
  }, [useComboPerOrders.data, useCombos.data])

  useEffect(() => {
    setIsCustom((comboPerOrders?.length || -1) < 1)
  }, [comboPerOrders])

  const getCombosByOrderId = async (orderId: IOrder['id']) => {
    const cpo = await useComboPerOrders.findBy({orderId})
    if (!cpo) return
    const combos = await Promise.all(cpo.map(async (c) => ({
      ...await useCombos.findOne({id: c.comboId})
    })))
    return combos
  }

  const getCombosByOrdersId = async (orderId: Array<IOrder['id']>) => {
    return await Promise.all(orderId.map((id) => ({
      combos: getCombosByOrderId(id),
      orderId: id
    })))
  }

  const getCombosByOrders = async (orderId: Array<IOrder>): Promise<CombosByOrders> => {
    return await Promise.all(orderId.map( async (order) => ({
      combos: await getCombosByOrderId(order.id),
      orderId: order.id
    })))
  }

  return {
    comboPerOrders,
    getCombosByOrderId,
    getCombosByOrdersId,
    getCombosByOrders,
    isCustom,
    setOrderId
  }
}
