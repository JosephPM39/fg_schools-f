import { useSchools } from "./api/schools/schools"

export const useApi = () => {
  const useSchool = useSchools()
  return {
    useSchool
  }
}
