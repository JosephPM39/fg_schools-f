import { ReactNode } from "react"
import { useEmployee } from "../../../hooks/api/schools/useEmployee"
import { useEmployeePosition } from "../../../hooks/api/schools/useEmployeePosition"
import { useGroup } from "../../../hooks/api/schools/useGroup"
import { usePosition } from "../../../hooks/api/schools/usePosition"
import { useSchool } from "../../../hooks/api/schools/useSchool"
import { useSchoolProm } from "../../../hooks/api/schools/useSchoolProm"
import { useSectionProm } from "../../../hooks/api/schools/useSectionProm"
import { useTitle } from "../../../hooks/api/schools/useTitle"
import { SchoolContext, EmployeeContext, EmployeePositionContext, GroupContext, PositionContext, SchoolPromContext, SectionPromContext, TitleContext } from "./SchoolContext"
import { Provider } from '../../ContextHelper'

export const SchoolProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useSchool(),
  context: SchoolContext,
  children
})

export const EmployeeProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useEmployee(),
  context: EmployeeContext,
  children
})

export const EmployeePositionProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useEmployeePosition(),
  context: EmployeePositionContext,
  children
})

export const GroupProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useGroup(),
  context: GroupContext,
  children
})

export const PositionProvider = ({children}: {children: ReactNode}) => Provider({
  hook: usePosition(),
  context: PositionContext,
  children
})

export const SchoolPromProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useSchoolProm(),
  context: SchoolPromContext,
  children
})

export const SectionPromProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useSectionProm(),
  context: SectionPromContext,
  children
})

export const TitleProvider = ({children}: {children: ReactNode}) => Provider({
  hook: useTitle(),
  context: TitleContext,
  children
})
