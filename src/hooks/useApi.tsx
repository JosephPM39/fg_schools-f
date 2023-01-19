import { useSchool } from "./api/schools/useSchool"
import { useEmployeePosition } from "./api/schools/useEmployeePosition"
import { useEmployee } from "./api/schools/useEmployee"
import { useTitle } from "./api/schools/useTitle"
import { useGroup } from "./api/schools/useGroup"
import { usePosition } from "./api/schools/usePosition"
import { useSectionProm } from "./api/schools/useSectionProm"
import { useSchoolProm } from "./api/schools/useSchoolProm"
import { useNetStatus } from "./useNetStatus"

export const useApi = () => {
  const { offlineMode, netOnline } = useNetStatus()
  const netStatus = {
    offlineMode,
    netOnline
  }
  return {
    useSchool: useSchool({netStatus}),
    useSchoolProm: useSchoolProm({netStatus}),
    useSectionProm: useSectionProm({netStatus}),
    useEmployee: useEmployee({netStatus}),
    useTitle: useTitle({netStatus}),
    useGroup: useGroup({netStatus}),
    useEmployeePosition: useEmployeePosition({netStatus}),
    usePosition: usePosition({netStatus})
  }
}
