import { Article, Delete, Edit, KeyboardArrowDown } from '@mui/icons-material';
import { Card, CardActions, CardContent,CardMedia,Button, Typography, MenuItem, Menu, CircularProgress} from '@mui/material'
import { Box } from '@mui/system';
import { useContext, useEffect, useState } from 'react';
import { IEmployee, IEmployeePosition, IPosition, ISchool, ISchoolProm } from '../api/models_school';
import { EmployeeContext, EmployeePositionContext, PositionContext, SchoolContext } from '../context/api/schools';
import { useDebounce } from '../hooks/useDebouce';
import { useNearScreen } from '../hooks/useNearScreen';
import { SectionsModal } from './SectionsModal';
import DefaultIcon from '../assets/signature.png'

interface Params {
  schoolProm: ISchoolProm
}

export const SchoolCard = (params: Params) => {
  const [school, setSchool] = useState<ISchool | undefined>(undefined)
  const [principal, setPrincipal] = useState<IEmployeePosition | undefined>(undefined)
  const [employee, setEmployee] = useState<IEmployee | undefined>(undefined)
  const [position, setPosition] = useState<IPosition | undefined>(undefined)

  const useEmployeePosition = useContext(EmployeePositionContext)
  const useSchool = useContext(SchoolContext)
  const useEmployee = useContext(EmployeeContext)
  const usePosition = useContext(PositionContext)
  const { element, show } = useNearScreen()
  const {promiseHelper} = useDebounce()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (!show) return
    const get = async () => {
      const school = await useSchool?.findOne({ id: params.schoolProm.schoolId })
      if (!school) {
        const school = await promiseHelper(useSchool?.findOne({ id: params.schoolProm.schoolId }), 5000)
        return setSchool(school)
      }
      setSchool(school)
    }
    get()
  }, [show, params, useSchool?.data])

  useEffect(() => {
    if (!show) return
    const get = async () => {
      const principal = await useEmployeePosition?.findOne({ id: params.schoolProm.principalId })
      setPrincipal(principal)
    }
    get()
  }, [show, params, useEmployeePosition?.data])

  useEffect(() => {
    if (!show) return
    const get = async () => {
      const employee = await useEmployee?.findOne({ id: principal?.employeeId })
      setEmployee(employee)
    }
    get()
  }, [show, params, useEmployee?.data, principal])

  useEffect(() => {
    if (!show) return
    const get = async () => {
      const position = await usePosition?.findOne({ id: principal?.positionId })
      setPosition(position)
    }
    get()
  }, [show, params, usePosition?.data, principal])

  return (
    <Card ref={element} sx={{ maxWidth: 345 }}>
      { school ? <CardMedia
        component="img"
        alt={school?.name}
        height="140"
        image={school?.icon === 'default' ? DefaultIcon : school.icon}
      /> : <Box height='140px' width='345px' display='flex' alignItems='center' justifyContent='center'>
        <CircularProgress/>
      </Box>
      }
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {school?.name ?? 'Loading...'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          { school && position && employee ? <>
            Dirección: {school?.location}
            <br/>
            Código: {school?.code}
            <br/>
            {`${position?.name}: `}
            {`${employee?.profesion} `}
            {`${employee?.firstName} `}
            {`${employee?.lastName} `}
          </> : <>
              Loading...
            <br/>
            <br/>
            <br/>
            <br/>
          </> }
        </Typography>
      </CardContent>
      {show ? <CardActions>
        <SectionsModal
          btnProps={{
            children: 'Abrir',
            startIcon: <Article/>,
            variant: 'contained',
            color: 'info',
            size: 'small',
            disabled: !params.schoolProm
          }}
          initOpen={false}
          schoolProm={params.schoolProm}
          cardData={{
            principal: {
              ...principal,
              employee,
              position
            },
            school
          }}/>
        <Button
          id={`school-menu-button-${params.schoolProm.id}`}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant='outlined'
          size='small'
          disabled={!params.schoolProm}
          endIcon={<KeyboardArrowDown/>}
        > Más opciones </Button>
        <Menu
          id={`school-menu-${params.schoolProm.id}`}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem sx={{color: 'darkblue'}} ><Edit/>&#8288; Editar</MenuItem>
          <MenuItem onClick={handleClose} sx={{color: 'red'}}><Delete/>&#8288; Eliminar</MenuItem>
        </Menu>

      </CardActions> : <CardActions>
        <br/>
          ...loading
        <br/>
      </CardActions>
      }
    </Card>
  );
}
