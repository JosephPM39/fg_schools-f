import { Grid } from '@mui/material'
import { NavBar } from '../containers/NavBar'
import { SearchField } from '../components/SearchField'
import { SchoolCard } from '../components/SchoolCard'
import { useContext } from 'react'
import { SchoolPromContext } from '../context/api/schools'
import { Container } from '@mui/system'
import { PickDirDialog } from '../components/PickDirDialog'

export const Principal = () => {
  const schoolProms = useContext(SchoolPromContext)

  const Cards = () => {
    return schoolProms?.data?.map((prom, index)=> (
      <Grid item key={index}>
        <SchoolCard schoolProm={prom}/>
      </Grid>
    ))
  }

  return (
    <>
      <NavBar>
        <SearchField/>
      </NavBar>
      <PickDirDialog/>

      <br/>
      <Container maxWidth='xl'>
        <Grid container justifyContent='center' spacing={2} >
          {Cards()}
        </Grid>
      </Container>
      <br/>
    </>
  )
}
