import {ReactNode} from 'react'

import {
  SchoolPromProvider,
  SchoolProvider,
  EmployeeProvider,
  EmployeePositionProvider,
  GroupProvider,
  PositionProvider,
  SectionPromProvider,
  TitleProvider
} from './SchoolProviders'
export {
  SchoolContext,
  EmployeeContext,
  EmployeePositionContext,
  GroupContext,
  PositionContext,
  SchoolPromContext,
  SectionPromContext,
  TitleContext
} from './SchoolContext'

export {
  SchoolPromProvider,
  SchoolProvider,
  EmployeeProvider,
  EmployeePositionProvider,
  GroupProvider,
  PositionProvider,
  SectionPromProvider,
  TitleProvider
} from './SchoolProviders'

interface children {
  children: ReactNode
}

export const SchoolComponentProviders = ({children}: children) => {
  const P1 = ({children}: children) => <EmployeeProvider>
    <GroupProvider>
      <PositionProvider>
        <SchoolPromProvider>
          {children}
        </SchoolPromProvider>
      </PositionProvider>
    </GroupProvider>
  </EmployeeProvider>

  const P2 = ({children}: children) => <TitleProvider>
    <EmployeePositionProvider>
      <SchoolProvider>
        <SectionPromProvider>
          {children}
        </SectionPromProvider>
      </SchoolProvider>
    </EmployeePositionProvider>
  </TitleProvider>

  return <P1>
    <P2>
      {children}
    </P2>
  </P1>
}
