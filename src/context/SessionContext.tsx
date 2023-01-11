import { useAuth } from "../hooks/useAuth";
import { createContext, ReactNode } from "react";
import { Provider } from './ContextHelper'

export const SessionContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined)

export const SessionProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useAuth(),
  context: SessionContext,
  children
})


