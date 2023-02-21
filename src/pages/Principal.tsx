import { Grid } from '@mui/material'
import { NavBar } from '../containers/NavBar'
import { SearchField } from '../components/SearchField'
import { SchoolCard } from '../components/SchoolCard'
import { useContext, useEffect, useState } from 'react'
import { SchoolPromContext } from '../context/api/schools'
import { Container } from '@mui/system'
import { PickDirDialog } from '../components/PickDirDialog'

export const Principal = () => {
  const schoolProms = useContext(SchoolPromContext)

  const [cards, setCards] = useState<Array<JSX.Element>>([])

  useEffect(() => {
    const cardsFinded: Array<JSX.Element> = []
    const count = schoolProms?.metadata?.count ?? 0
    for (let i = 0; i < count; i++) {
      const prom = schoolProms?.data.at(i)
      cardsFinded.push(
        <Grid item key={i}>
          <SchoolCard schoolProm={prom} fetchNext={() => schoolProms?.setNeedFetchNext(true)}/>
        </Grid>
      )
    }
    setCards(cardsFinded)
  }, [schoolProms?.data, schoolProms?.metadata])

  return (
    <>
      <NavBar>
        <SearchField/>
      </NavBar>
      <PickDirDialog/>

      <br/>
      <Container maxWidth='xl'>
        total: {schoolProms?.data.length}
        <Grid container justifyContent='center' spacing={2} >
          {cards.map((card) => card)}
        </Grid>
      </Container>
      <br/>
    </>
  )
}
