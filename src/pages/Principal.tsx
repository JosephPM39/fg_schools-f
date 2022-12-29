import { Grid } from '@mui/material'
import { NavBar } from '../containers/NavBar'
import { SearchField } from '../components/SearchField'
import { useContext } from 'react'
import { ApiContext } from '../context/ApiContext'
import { SchoolCard } from '../components/SchoolCard'
import { IProm } from '../api/models_school'

export const Principal = () => {
  const proms = useContext(ApiContext)?.useProm

  const Cards = () => {
    if (!proms) return <></>
    const promsWithUniqueSchool = proms?.data?.reduce((sum: IProm[], current: IProm) => {
      if (sum.filter((e) => e.schoolId === current.schoolId).length < 1) {
        sum.push(current)
      }
      return sum
    }, [])

    const schoolsWithProms = promsWithUniqueSchool?.map((e, i) => {
      const res = proms?.data?.filter((p) => p.schoolId === e.schoolId)
      if(!res) return []
      return res
    })
    return schoolsWithProms?.map((proms, index)=> (
      <Grid item key={index}>
        <SchoolCard proms={proms}/>
      </Grid>
    ))
  }

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
