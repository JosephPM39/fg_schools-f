import { ReactNode } from 'react'
import { ModelProvider } from './ProductsProviders'

export { ModelContext } from './ProductsContext'
export { ModelProvider } from './ProductsProviders'

export const ProductsProviders = ({children}:{children: ReactNode}) => {
  return <ModelProvider>
    {children}
  </ModelProvider>
}
