import { createContext, ReactNode } from "react";
import { Provider } from './ContextHelper'
import { useApi } from "../hooks/useApi";

export const ApiContext = createContext<ReturnType<typeof useApi> | undefined>(undefined)

export const ApiProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useApi(),
  context: ApiContext,
  children
})
