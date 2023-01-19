import { useSchool } from "./api/schools/useSchool"
import { useEmployeePosition } from "./api/schools/useEmployeePosition"
import { useEmployee } from "./api/schools/useEmployee"
import { useTitle } from "./api/schools/useTitle"
import { useGroup } from "./api/schools/useGroup"
import { usePosition } from "./api/schools/usePosition"
import { useSectionProm } from "./api/schools/useSectionProm"
import { useSchoolProm } from "./api/schools/useSchoolProm"

export const useApi = () => {
  return {
    useSchool: useSchool(),
    useSchoolProm: useSchoolProm(),
    useSectionProm: useSectionProm(),
    useEmployee: useEmployee(),
    useTitle: useTitle(),
    useGroup: useGroup(),
    useEmployeePosition: useEmployeePosition(),
    usePosition: usePosition()
  }
}
