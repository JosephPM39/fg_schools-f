import { createContext, ReactNode } from "react";
import { useStorageFile } from "../../hooks/files/useStorageFile";
import { Provider } from '../ContextHelper'

export const StorageFileContext = createContext<ReturnType<typeof useStorageFile> | undefined>(undefined)

export const StorageFileProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useStorageFile(),
  context: StorageFileContext,
  children
})
