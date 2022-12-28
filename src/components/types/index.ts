import { IEmployee, IEmployeePosition, IPosition, ISchool } from "../../api/models_school"

export interface SchoolsCardData {
  school?: ISchool
  principal?: {
    position?: IPosition
    employee?: IEmployee
    relation?: IEmployeePosition
  }
}
