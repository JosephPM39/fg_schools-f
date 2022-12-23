import { Card, CardActions, CardContent,CardMedia,Button, Typography} from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { IEmployee, IEmployeePosition, IPosition, IProm, ISchool } from '../api/models_school';
import { ApiContext } from '../context/ApiContext';

interface Params {
  proms: IProm[]
}

export const SchoolCard = (params: Params) => {
  const [showSections, setShowSections] = useState(false)
  const [obj, setObj] = useState<{
    school?: ISchool
    principal?: {
      position?: IPosition
      employee?: IEmployee
      relation?: IEmployeePosition
    }
  } | undefined>()
  const api = useContext(ApiContext)

  console.log(params.proms)

  useEffect(() => {
    const getData = async () => {
      const school = await api?.useSchool.findOne({ id: params.proms[0].schoolId })
      const principal = await api?.useEmployeePosition.findOne({ id: params.proms[0].principalId })
      const employee = await api?.useEmployee.findOne({ id: principal?.employeeId })
      const position = await api?.usePosition.findOne({ id: principal?.positionId })
      if (school) {
        setObj({
          school,
          principal: {
            relation: principal,
            position,
            employee
          }
        })
      }
    }
    if (!obj?.school) getData()
  })

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
        <Button size="small">Listados</Button>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
