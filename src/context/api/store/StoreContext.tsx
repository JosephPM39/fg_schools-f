import { createContext } from 'react'
import { useCombo } from '../../../hooks/api/store/useCombo'
import { useComboPerOrder } from '../../../hooks/api/store/useComboPerOrder'
import { useOrder } from '../../../hooks/api/store/useOrder'
import { usePayment } from '../../../hooks/api/store/usePayment'
import { useProductPerCombo } from '../../../hooks/api/store/useProductPerCombo'
import { useProductPerOrder } from '../../../hooks/api/store/useProductPerOrder'
import { useStudent } from '../../../hooks/api/store/useStudent'

type Ct<T extends () => object> = ReturnType<T> | undefined

export const ComboContext = createContext<Ct<typeof useCombo>>(undefined)
export const ComboPerOrderContext = createContext<Ct<typeof useComboPerOrder>>(undefined)
export const OrderContext = createContext<Ct<typeof useOrder>>(undefined)
export const PaymentContext = createContext<Ct<typeof usePayment>>(undefined)
export const ProductPerOrderContext = createContext<Ct<typeof useProductPerOrder>>(undefined)
export const ProductPerComboContext = createContext<Ct<typeof useProductPerCombo>>(undefined)
export const StudentContext = createContext<Ct<typeof useStudent>>(undefined)
