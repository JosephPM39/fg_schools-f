import { createContext } from "react"
import { useModel } from "../../../hooks/api/products/useModel"

type Ct<T extends () => object> = ReturnType<T> | undefined

export const ModelContext = createContext<Ct<typeof useModel>>(undefined)
