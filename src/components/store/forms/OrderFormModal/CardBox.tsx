import { Card, CardContent, Grid, Typography } from '@mui/material'
import { ReactNode } from 'react'

export const CardBox = ({ children, title, actions }: { children: ReactNode, title: string, actions?: ReactNode }) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={!actions ? 12 : 6} sm={!actions ? 12 : 6}>
            <Typography variant='h6' component='div' color='text.secondary'>{title}</Typography>
          </Grid>
          {actions && <Grid item display='flex' justifyContent='flex-end' component='div'>
            {actions}
          </Grid>}
          <Grid item xs={12} sm={12}>
            {children}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
