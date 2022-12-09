import { Grid } from '@mui/material'
import { Container } from '@mui/system'
import { ImgMediaCard } from "../components/ImgMediaCard"
import { NavBar } from '../containers/NavBar'

export const Principal = () => {
  const data = [...Array(10)]
  const Cards = () => (
    data.map((d, index)=> (
      <Grid item xs={2} sm={4} md={4} key={index}>
        <ImgMediaCard></ImgMediaCard>
      </Grid>
    ))
  )

  return (
    <>
      <NavBar/>
      <br/>
      <Container fixed>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {Cards()}
        </Grid>
      </Container>
      <br/>
    </>
  )
}
