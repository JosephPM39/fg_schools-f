import { createContext } from 'react'
import { useEmployee } from '../../../hooks/api/schools/useEmployee'
import { useEmployeePosition } from '../../../hooks/api/schools/useEmployeePosition'
import { useGroup } from '../../../hooks/api/schools/useGroup'
import { usePosition } from '../../../hooks/api/schools/usePosition'
import { useSchool } from '../../../hooks/api/schools/useSchool'
import { useSchoolProm } from '../../../hooks/api/schools/useSchoolProm'
import { useSectionProm } from '../../../hooks/api/schools/useSectionProm'
import { useTitle } from '../../../hooks/api/schools/useTitle'

type Ct<T extends () => object> = ReturnType<T> | undefined

export const SchoolContext = createContext<Ct<typeof useSchool>>(undefined)
export const EmployeeContext = createContext<Ct<typeof useEmployee>>(undefined)
export const EmployeePositionContext = createContext<Ct<typeof useEmployeePosition>>(undefined)
export const GroupContext = createContext<Ct<typeof useGroup>>(undefined)
export const PositionContext = createContext<Ct<typeof usePosition>>(undefined)
export const SchoolPromContext = createContext<Ct<typeof useSchoolProm>>(undefined)
export const SectionPromContext = createContext<Ct<typeof useSectionProm>>(undefined)
export const TitleContext = createContext<Ct<typeof useTitle>>(undefined)
