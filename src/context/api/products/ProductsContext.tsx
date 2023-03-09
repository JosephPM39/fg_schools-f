import { createContext } from 'react'
import { useBorder } from '../../../hooks/api/products/useBorder'
import { useColor } from '../../../hooks/api/products/useColor'
import { useModel } from '../../../hooks/api/products/useModel'
import { useProduct } from '../../../hooks/api/products/useProduct'
import { useSize } from '../../../hooks/api/products/useSize'
import { useType } from '../../../hooks/api/products/useType'

type Ct<T extends () => object> = ReturnType<T> | undefined

export const ModelContext = createContext<Ct<typeof useModel>>(undefined)
export const BorderContext = createContext<Ct<typeof useBorder>>(undefined)
export const ColorContext = createContext<Ct<typeof useColor>>(undefined)
export const ProductContext = createContext<Ct<typeof useProduct>>(undefined)
export const SizeContext = createContext<Ct<typeof useSize>>(undefined)
export const TypeContext = createContext<Ct<typeof useType>>(undefined)
