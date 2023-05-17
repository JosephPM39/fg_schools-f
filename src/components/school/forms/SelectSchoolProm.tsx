import { ISchoolProm } from '../../../api/models_school'
import { useSchool } from '../../../hooks/api/schools/useSchool'
import { useSchoolProm } from '../../../hooks/api/schools/useSchoolProm'
import { SelectLazy } from '../../inputs/Select'

interface params {
  onChange?: (id?: ISchoolProm['id']) => void
  hook: ReturnType<typeof useSchoolProm>
  defaultValue?: ISchoolProm['id']
}

export const SelectSchoolProm = (params: params) => {
  const { onChange = () => { }, defaultValue } = params
  const useSchoolProms = useSchoolProm()
  const useSchools = useSchool()
  const hook = params.hook ?? useSchoolProms

  const findSPName = async (item: ISchoolProm) => {
    const school = await useSchools.findOne({ id: item.schoolId })
    return `${school?.name ?? 'Cargando...'} (Código: ${school?.code ?? 'Cargando...'})`
  }

  return <SelectLazy
    id="school-prom"
    name="school_id"
    label="Escuela"
    itemLabelBy={findSPName}
    hook={hook}
    defaultValue={defaultValue}
    itemValueBy="schoolId"
    omitCreateOption
    onChange={onChange}
  />
}
