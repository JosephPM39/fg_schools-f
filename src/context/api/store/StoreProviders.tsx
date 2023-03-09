import { ReactNode } from 'react'
import { useCombo } from '../../../hooks/api/store/useCombo'
import { useComboPerOrder } from '../../../hooks/api/store/useComboPerOrder'
import { useOrder } from '../../../hooks/api/store/useOrder'
import { usePayment } from '../../../hooks/api/store/usePayment'
import { useProductPerCombo } from '../../../hooks/api/store/useProductPerCombo'
import { useProductPerOrder } from '../../../hooks/api/store/useProductPerOrder'
import { useStudent } from '../../../hooks/api/store/useStudent'
import { Provider } from '../../ContextHelper'
import { ComboContext, ComboPerOrderContext, OrderContext, PaymentContext, ProductPerComboContext, ProductPerOrderContext, StudentContext } from './StoreContext'

export const ComboProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useCombo(),
  context: ComboContext,
  children
})

export const ComboPerOrderProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useComboPerOrder(),
  context: ComboPerOrderContext,
  children
})

export const OrderProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useOrder(),
  context: OrderContext,
  children
})

export const PaymentProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: usePayment(),
  context: PaymentContext,
  children
})

export const ProductPerOrderProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useProductPerOrder(),
  context: ProductPerOrderContext,
  children
})

export const ProductPerComboProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useProductPerCombo(),
  context: ProductPerComboContext,
  children
})

export const StudentProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useStudent(),
  context: StudentContext,
  children
})
