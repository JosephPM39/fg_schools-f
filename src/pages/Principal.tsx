import { Grid, Box } from '@mui/material'
import { ImgMediaCard } from "../components/ImgMediaCard"
import { NavBar } from '../containers/NavBar'
import { SearchField } from '../components/SearchField'
import { useContext, useEffect } from 'react'
import { ApiContext } from '../context/ApiContext'
import { SessionContext } from '../context/SessionContext'

export const Principal = () => {
  const data = [...Array(50)]
  const school = useContext(ApiContext)?.useSchool
  const session = useContext(SessionContext)

  console.log(school?.schools, "escuelas")

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
