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
      const school = await api?.useSchool.findOne({ id: params.prom.school })
      if (school) {
        setObj({
          school
        })
      }
    }
    if (!obj?.school) getData()
  })
  console.log(params.prom, 'prom')
  console.log(obj, 'school')

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {obj?.school?.name ?? 'Lizard d'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
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
