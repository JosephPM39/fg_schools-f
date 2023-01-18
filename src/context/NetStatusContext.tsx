import { createContext, ReactNode } from "react";
import { Provider } from './ContextHelper'
import { useNetStatus } from "../hooks/useNetStatus";

export const NetStatusContext = createContext<ReturnType<typeof useNetStatus> | undefined>(undefined)

export const NetStatusProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useNetStatus(),
  context: NetStatusContext,
  children
})
