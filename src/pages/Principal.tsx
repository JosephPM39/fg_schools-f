import { Grid } from '@mui/material'
import { NavBar } from '../containers/NavBar'
import { SearchField } from '../components/SearchField'
import { SchoolCard } from '../components/school/SchoolCard'
import { useContext, useEffect, useState } from 'react'
import { SchoolPromContext } from '../context/api/schools'
import { Container } from '@mui/system'
import { PickDirDialog } from '../components/PickDirDialog'

export const Principal = () => {
  const schoolProms = useContext(SchoolPromContext)

  const [cards, setCards] = useState<JSX.Element[]>([])

  useEffect(() => {
    setCards([])
    const cardsFinded: JSX.Element[] = []
    console.log('updating')
    const count = schoolProms?.metadata?.count ?? schoolProms?.data.length ?? 0
    schoolProms?.data.forEach((prom) => {
      cardsFinded.push(
        <SchoolCard schoolProm={prom} />
      )
    })
    const rest = (count - (schoolProms?.data.length ?? 0) > 0)
    if (rest) {
      cardsFinded.push(
        <SchoolCard paginationNext={schoolProms?.launchNextFetch}/>
      )
    }
    console.log('cards', cardsFinded.length)
    setCards(cardsFinded)
  }, [schoolProms?.data, schoolProms?.metadata])

  return (
    <>
      <NavBar>
        <SearchField />
      </NavBar>
      <PickDirDialog />

      <br />
      <Container maxWidth='xl'>
        total: {schoolProms?.data.length}
        <Grid container justifyContent='center' spacing={2} >
          {cards.map((card, i) => <Grid item key={i}>{card}</Grid>)}
        </Grid>
      </Container>
      <br />
    </>
  )
}
