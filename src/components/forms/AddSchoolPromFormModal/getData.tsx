import { IEmployeePosition, ISchool, ISchoolProm } from '../../../api/models_school';
import { v4 as uuidV4 } from 'uuid'

function getFormValue<T>(form: FormData, name: string): T {
  return form.get(name) as T
}

const getSchoolFormData = (form: FormData): {
  file: File | null
  data: ISchool
} => {
  const icon = getFormValue<File | null>(form, 'icon')
  const data: ISchool = {
    id: uuidV4(),
    icon: icon?.name || 'defualt',
    name: getFormValue<string>(form, 'name'),
    location: getFormValue<string>(form, 'location'),
    code: getFormValue<string>(form, 'code')
  }

  return {
    file: icon,
    data
  }
}

const getPrincipalFormData = (form: FormData): IEmployeePosition => {
  const employeeId = uuidV4()
  return {
    id: uuidV4(),
    employee: {
      id: employeeId,
      firstName: getFormValue<string>(form, 'first_name'),
      lastName: getFormValue<string>(form, 'last_name'),
      contact: getFormValue<string>(form, 'contact'),
      profesion: getFormValue<string>(form, 'profesion'),
    },
    employeeId,
    positionId: getFormValue<string>(form, 'position_id'),
  }
}

const getSchoolPromData = ({ schoolId, principalId }: {
  schoolId: ISchool['id'],
  principalId: IEmployeePosition['id']
}): ISchoolProm => ({
  id: uuidV4(),
  principalId,
  schoolId,
  year: new Date().getFullYear()
})

interface SubmitParams {
  form: HTMLFormElement | null
  principalSelected?: IEmployeePosition
  schoolSelected?: ISchoolProm
}

export const getSubmitData = (params: SubmitParams): {
  schoolProm: ISchoolProm,
  principal?: IEmployeePosition,
  school?: {
    data: ISchool
    file: File | null
  }
} | undefined => {
  const {
    form,
    schoolSelected,
    principalSelected,
  } = params

  if (principalSelected && schoolSelected) {
    return {
      schoolProm: getSchoolPromData({
        principalId: principalSelected.id,
        schoolId: schoolSelected.schoolId
      })
    }
  }

  if (!form) return
  const formData = new FormData(form)
  const principal = getPrincipalFormData(formData)
  const school = getSchoolFormData(formData)

  if (!principalSelected && !schoolSelected) {
    return {
      schoolProm: getSchoolPromData({
        principalId: principal.id,
        schoolId: school.data.id
      }),
      school,
      principal
    }

  }

  if (schoolSelected && !principalSelected) {
    return {
      schoolProm: getSchoolPromData({
        schoolId: schoolSelected.schoolId,
        principalId: principal.id
      }),
      principal
    }
  }

  if (!schoolSelected && principalSelected) {
    return {
      schoolProm: getSchoolPromData({
        schoolId: school.data.id,
        principalId: principalSelected.id
      }),
      school
    }
  }
}
