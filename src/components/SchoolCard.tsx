import { Card, CardActions, CardContent,CardMedia,Button, Typography} from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { ISchoolProm } from '../api/models_school';
import { EmployeeContext, EmployeePositionContext, PositionContext, SchoolContext } from '../context/api/schools';
import { SectionsModal } from './SectionsModal';
import { SchoolsCardData } from './types';

interface Params {
  schoolProm: ISchoolProm
}

export const SchoolCard = (params: Params) => {
  const [obj, setObj] = useState<SchoolsCardData | undefined>(undefined)
  const useEmployeePosition = useContext(EmployeePositionContext)
  const useSchool = useContext(SchoolContext)
  const useEmployee = useContext(EmployeeContext)
  const usePosition = useContext(PositionContext)

  useEffect(() => {
    const getData = async () => {
      const principal = await useEmployeePosition?.findOne({ id: params.schoolProm.principalId })
      const school = await useSchool?.findOne({ id: params.schoolProm.schoolId })
      const employee = await useEmployee?.findOne({ id: principal?.employeeId })
      const position = await usePosition?.findOne({ id: principal?.positionId })
      if (school) {
        setObj({
          school: {...school},
          principal: {
            relation: principal,
            position,
            employee
          }
        })
      }
    }
    if (!obj?.school) getData()
  }, [useSchool, useEmployee, usePosition, useEmployeePosition, params.schoolProm, obj?.school])

  if (!obj) return <>Without Data</>

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt={obj?.school?.name}
        height="140"
        image={obj?.school?.icon}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {obj?.school?.name ?? 'Lizard d'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <>

            {/* console.error('Render card', obj.school?.name)*/ }
            Dirección: {obj?.school?.location}
            <br/>
            Código: {obj?.school?.code}
            <br/>
            {`${obj?.principal?.position?.name}: `}
            {`${obj?.principal?.employee?.profesion} `}
            {`${obj?.principal?.employee?.firstName} `}
            {`${obj?.principal?.employee?.lastName} `}
          </>
        </Typography>
      </CardContent>
      <CardActions>
        <SectionsModal initOpen={false} schoolProm={params.schoolProm} cardData={obj} />
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
