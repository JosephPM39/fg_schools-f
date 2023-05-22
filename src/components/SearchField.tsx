import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import { InputBaseStyled } from '../styles/InputBaseStyled'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { SchoolPromContext } from '../context/api/schools'
import { useDebounce } from '../hooks/useDebouce'
import { useSchool } from '../hooks/api/schools/useSchool'
import { ISchool, ISchoolProm } from '../api/models_school'
import { useSchoolProm } from '../hooks/api/schools/useSchoolProm'
import { ByOperator } from '../api/validations/query'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

export const SearchField = () => {
  const useSchoolProms = useContext(SchoolPromContext)
  const useSchoolPromsLocal = useSchoolProm({ initFetch: false })

  const { debounce } = useDebounce()
  const [value, setValue] = useState<string | undefined>()
  const useSchools = useSchool({ initFetch: false })
  const [schools, setSchools] = useState<ISchool[]>([])
  const [proms, setProms] = useState<ISchoolProm[]>([])
  const [reset, setReset] = useState<boolean>(false)

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    debounce(() => setValue(e.target.value))
  }

  useEffect(() => {
    if (!reset) return
    void useSchoolProms?.fetch({
      searchBy: {
        year: useSchoolProms.year
      }
    }).finally(() => {
      setReset(false)
    })
  }, [reset])

  useEffect(() => {
    if (!value) {
      setReset(true)
      return
    }
    console.log('schools')
    void useSchools.fetch({
      query: {
        limit: 'NONE',
        byoperator: ByOperator.iLike
      },
      searchBy: {
        name: `%${value}%`
      }
    }).then((res) => {
      setSchools(res.data ?? [])
    })
  }, [value])

  useEffect(() => {
    const getData = async () => {
      const schoolProms: ISchoolProm[] = []
      await Promise.all(schools.map(async ({ id }) => {
        const proms = await useSchoolPromsLocal.findBy({
          schoolId: id,
          year: useSchoolProms?.year
        })
        if (!proms) return
        schoolProms.push(...proms)
      }))
      console.log(schoolProms.length, 'proms')
      setProms(schoolProms)
    }
    void getData()
  }, [schools, useSchoolProms?.year])

  useEffect(() => {
    useSchoolProms?.clearRequests()
    console.log('setting', proms.length)
    useSchoolProms?.setData(proms)
  }, [proms])

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <InputBaseStyled
        placeholder="Buscar escuela…"
        inputProps={{ 'aria-label': 'buscar' }}
        onChange={onChange}
      />
    </Search>
  )
}
