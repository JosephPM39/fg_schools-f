import { ReactNode } from "react";
import { Provider } from "../../ContextHelper";
import { useModel } from "../../../hooks/api/products/useModel"
import { ModelContext } from "./ProductsContext";

export const ModelProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useModel(),
  context: ModelContext,
  children
})
