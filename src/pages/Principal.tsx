import { Grid } from '@mui/material'
import { ImgMediaCard } from "../components/ImgMediaCard"
import { NavBar } from '../containers/NavBar'
import { SearchField } from '../components/SearchField'
import { useContext } from 'react'
import { ApiContext } from '../context/ApiContext'
import { SessionContext } from '../context/SessionContext'
import { SchoolCard } from '../components/SchoolCard'

export const Principal = () => {
  const proms = useContext(ApiContext)?.useProm
  const session = useContext(SessionContext)

  const Cards = () => (
    proms?.data?.map((prom, index)=> (
      <Grid item key={index}>
        <SchoolCard prom={prom}/>
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
