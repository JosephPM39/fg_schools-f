import { useApi } from "../hooks/useApi";
import { createContext } from "react";

export const ApiContext = createContext<ReturnType<typeof useApi> | undefined>(undefined)
