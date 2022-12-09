import { Grid, Box } from '@mui/material'
import { ImgMediaCard } from "../components/ImgMediaCard"
import { NavBar } from '../containers/NavBar'
import { SearchField } from '../components/SearchField'

export const Principal = () => {
  const data = [...Array(50)]
  const Cards = () => (
    data.map((d, index)=> (
      <Grid item key={index}>
        <ImgMediaCard></ImgMediaCard>
      </Grid>
    ))
  )

  return (
    <>
      <NavBar>
        <SearchField/>
      </NavBar>

      <br/>
      <Grid container justifyContent='center' spacing={2} >
        {Cards()}
      </Grid>
      <br/>
    </>
  )
}
