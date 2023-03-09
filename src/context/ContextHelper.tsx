import { ReactNode } from 'react'

interface params<H> {
  hook: H
  context: React.Context<H | undefined>
  children: ReactNode
}
export const Provider = <H extends {}>({ hook, context: Context, children }: params<H>) => {
  return (
    <Context.Provider value={hook}>
      {children}
    </Context.Provider>
  )
}
