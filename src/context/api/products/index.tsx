import { ReactNode } from 'react'
import { BorderProvider, ColorProvider, ModelProvider, ProductProvider, SizeProvider, TypeProvider } from './ProductsProviders'

export { ModelContext } from './ProductsContext'
export { ModelProvider } from './ProductsProviders'

export const ProductsProviders = ({children}:{children: ReactNode}) => {
  return <ModelProvider>
    <BorderProvider>
      <ColorProvider>
        <SizeProvider>
          <ProductProvider>
            <TypeProvider>
              {children}
            </TypeProvider>
          </ProductProvider>
        </SizeProvider>
      </ColorProvider>
    </BorderProvider>
  </ModelProvider>
}
