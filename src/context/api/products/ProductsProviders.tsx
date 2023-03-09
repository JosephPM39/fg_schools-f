import { ReactNode } from 'react'
import { Provider } from '../../ContextHelper'
import { useModel } from '../../../hooks/api/products/useModel'
import {
  BorderContext,
  ColorContext,
  ModelContext,
  ProductContext,
  SizeContext,
  TypeContext
} from './ProductsContext'
import { useBorder } from '../../../hooks/api/products/useBorder'
import { useColor } from '../../../hooks/api/products/useColor'
import { useSize } from '../../../hooks/api/products/useSize'
import { useProduct } from '../../../hooks/api/products/useProduct'
import { useType } from '../../../hooks/api/products/useType'

export const ModelProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useModel(),
  context: ModelContext,
  children
})

export const BorderProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useBorder(),
  context: BorderContext,
  children
})

export const ColorProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useColor(),
  context: ColorContext,
  children
})

export const SizeProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useSize(),
  context: SizeContext,
  children
})

export const ProductProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useProduct(),
  context: ProductContext,
  children
})

export const TypeProvider = ({ children }: { children: ReactNode }) => Provider({
  hook: useType(),
  context: TypeContext,
  children
})
