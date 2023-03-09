import { ReactNode } from 'react'
import { ComboPerOrderProvider, ComboProvider, OrderProvider, PaymentProvider, ProductPerComboProvider, ProductPerOrderProvider, StudentProvider } from './StoreProviders'

export {
  ComboPerOrderProvider,
  ComboProvider,
  OrderProvider,
  PaymentProvider,
  ProductPerComboProvider,
  ProductPerOrderProvider,
  StudentProvider
} from './StoreProviders'

export {
  ComboPerOrderContext,
  ComboContext,
  OrderContext,
  PaymentContext,
  ProductPerComboContext,
  ProductPerOrderContext,
  StudentContext
} from './StoreContext'

export const StoreProviders = ({ children }: { children: ReactNode }) => {
  return <ComboProvider>
    <OrderProvider>
      <ComboPerOrderProvider>
        <PaymentProvider>
          <ProductPerOrderProvider>
            <ProductPerComboProvider>
              <StudentProvider>
                {children}
              </StudentProvider>
            </ProductPerComboProvider>
          </ProductPerOrderProvider>
        </PaymentProvider>
      </ComboPerOrderProvider>
    </OrderProvider>
  </ComboProvider>
}
