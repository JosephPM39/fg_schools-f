import { Card, CardActions, CardContent,CardMedia,Button, Typography} from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { IProm, ISchool } from '../api/models_school';
import { ApiContext } from '../context/ApiContext';

interface Params {
  prom: IProm
}

export const SchoolCard = (params: Params) => {
  const [obj, setObj] = useState<{
    school?: ISchool
  } | undefined>()
  const api = useContext(ApiContext)

  useEffect(() => {
    const getData = async () => {
      const school = await api?.useSchool.findOne({ id: params.prom.schoolId })
      if (school) {
        setObj({
          school
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
          Dirección: {obj?.school?.location}
          <br/>
          Código: {obj?.school?.code}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
