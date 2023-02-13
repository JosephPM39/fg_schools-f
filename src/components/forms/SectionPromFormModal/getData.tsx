import { IEmployeePosition, ISchool, ISchoolProm } from '../../../api/models_school';
import { v4 as uuidV4 } from 'uuid'

function getFormValue<T>(form: FormData, name: string): T {
  return form.get(name) as T
}

const getSchoolFormData = (form: FormData): {
  file: File | null
  data: ISchool
} => {
  const icon = getFormValue<File | null>(form, 'school_icon')
  const data: ISchool = {
    id: getFormValue<string>(form, 'school_id') || uuidV4(),
    icon: icon?.name || 'default',
    name: getFormValue<string>(form, 'school_name'),
    location: getFormValue<string>(form, 'school_location'),
    code: getFormValue<string>(form, 'school_code')
  }

  return {
    file: icon,
    data
  }
}

const getPrincipalFormData = (form: FormData): IEmployeePosition => {
  const employeeId = getFormValue<string>(form, 'employee_id') || uuidV4()
  return {
    id: getFormValue<string>(form, 'employee_position_id') || uuidV4(),
    employee: {
      id: employeeId,
      firstName: getFormValue<string>(form, 'employee_first_name'),
      lastName: getFormValue<string>(form, 'employee_last_name'),
      contact: getFormValue<string>(form, 'employee_contact'),
      profesion: getFormValue<string>(form, 'employee_profesion'),
    },
    employeeId,
    positionId: getFormValue<string>(form, 'position_id'),
  }
}

const getSchoolPromData = (form: FormData): ISchoolProm => {
  const principalId = getFormValue<string>(form, 'employee_position_id')
  const schoolId = getFormValue<string>(form, 'school_id')
  const schoolPromId = getFormValue<string>(form, 'school_prom_id')
  const year = getFormValue<string>(form, 'year')
  return {
    id: schoolPromId || uuidV4(),
    principalId,
    schoolId,
    year: parseInt(year) || new Date().getFullYear()
  }
}

interface SubmitParams {
  form: HTMLFormElement | null
  principalOrigin?: 'new' | 'previous' | 'all'
  schoolOrigin?: 'new' | 'previous'
}

export interface SubmitData {
  schoolProm: ISchoolProm,
  principal?: IEmployeePosition,
  school?: {
    data: ISchool
    file: File | null
  }
}

const isNew = (st?: 'previous' | 'new' | 'all') => st === 'new'

export const getSubmitData = (params: SubmitParams): SubmitData | undefined => {
  const {
    form,
    principalOrigin,
    schoolOrigin
  } = params

  if (!form) return
  const formData = new FormData(form)

  if (!isNew(principalOrigin) && !isNew(schoolOrigin)) {
    return {
      schoolProm: getSchoolPromData(formData),
    }
  }

  const principal = getPrincipalFormData(formData)
  const school = getSchoolFormData(formData)

  if (isNew(principalOrigin) && isNew(schoolOrigin)) {
    return {
      schoolProm: getSchoolPromData(formData),
      school,
      principal
    }
  }

  if (!isNew(schoolOrigin) && isNew(principalOrigin)) {
    return {
      schoolProm: getSchoolPromData(formData),
      principal
    }
  }

  if (isNew(schoolOrigin) && !isNew(principalOrigin)) {
    return {
      schoolProm: getSchoolPromData(formData),
      school
    }
  }
}
