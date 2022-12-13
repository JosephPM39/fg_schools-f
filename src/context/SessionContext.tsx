import { useAuth } from "../hooks/useAuth";
import { createContext } from "react";

export const SessionContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined)
