import { Article, Delete, Edit, KeyboardArrowDown } from '@mui/icons-material';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  MenuItem,
  Menu,
  CircularProgress,
  Divider
} from '@mui/material'
import { Box } from '@mui/system';
import { useContext, useEffect, useState } from 'react';
import { IEmployee, IEmployeePosition, IPosition, ISchool, ISchoolProm } from '../api/models_school';
import { EmployeeContext, EmployeePositionContext, PositionContext, SchoolContext } from '../context/api/schools';
import { useDebounce } from '../hooks/useDebouce';
import { useNearScreen } from '../hooks/useNearScreen';
import { SectionsModal } from './SectionsModal';
import DefaultIcon from '../assets/signature.png'
import ImageError from '../assets/image-error.png'
import { SchoolPromFormModal } from './forms/SchoolPromFormModal';
import { StorageFileContext } from '../context/files/StorageFilesContext';
import { SubDir } from '../hooks/files/useStorageFile';
import { ChangeIconDialog } from './forms/ChangeSchoolIconDialog';

interface Params {
  schoolProm?: ISchoolProm
  paginationNext?: () => void
}

export const SchoolCard = (params: Params) => {
  const [school, setSchool] = useState<ISchool | null>(null)
  const [principal, setPrincipal] = useState<IEmployeePosition | null>(null)
  const [employee, setEmployee] = useState<IEmployee | null>(null)
  const [position, setPosition] = useState<IPosition | null>(null)

  const [icon, setIcon] = useState<string>()

  const useEmployeePosition = useContext(EmployeePositionContext)
  const useSchool = useContext(SchoolContext)
  const useEmployee = useContext(EmployeeContext)
  const usePosition = useContext(PositionContext)
  const { element, show } = useNearScreen()
  const { promiseHelper } = useDebounce()
  const useStorageFile = useContext(StorageFileContext)
  const useStorage = useStorageFile?.newStorage(SubDir.schoolIcons)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if(!show) return
    if(params.schoolProm) return
    if (!params.paginationNext) return
    params.paginationNext()
  }, [show])

  useEffect(() => {
    const getData = async () => {
      if (!school) return
      if (school.icon === 'default') return setIcon(DefaultIcon)
      const iconUrl = await useStorage?.getPreviewUrl(school.icon)
      setIcon(iconUrl || ImageError)
    }
    getData()
  }, [school])

  useEffect(() => {
    if (!show) return
    const get = async () => {
      if (!params.schoolProm || !useSchool) return
      const school = await useSchool.findOne({ id: params.schoolProm.schoolId })
      if (!school) {
        const school = await promiseHelper(useSchool.findOne({ id: params.schoolProm.schoolId }), 5000)

        return setSchool(school)
      }
      setSchool(school)
    }
    get()
  }, [show, params, useSchool?.data, useSchool?.data.length])

  useEffect(() => {
    if (!show) return
    const get = async () => {
      if (!params.schoolProm || !useEmployeePosition) return
      const principal = await useEmployeePosition.findOne({ id: params.schoolProm.principalId })
      setPrincipal(principal)
    }
    get()
  }, [show, params, useEmployeePosition?.data])

  useEffect(() => {
    if (!show || !useEmployee) return
    const get = async () => {
      const employee = await useEmployee.findOne({ id: principal?.employeeId })
      setEmployee(employee)
    }
    get()
  }, [show, params, useEmployee?.data, principal])

  useEffect(() => {
    if (!show || !usePosition) return
    const get = async () => {
      const position = await usePosition.findOne({ id: principal?.positionId })
      setPosition(position)
    }
    get()
  }, [show, params, usePosition?.data, principal])

  return (
    <Card ref={element} sx={{ maxWidth: 345 }}>
      { icon ? <CardMedia
        component="img"
        alt={school?.name}
        height="140"
        image={icon}
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
      {show && params.schoolProm ? <CardActions>
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
          schoolPromId={params.schoolProm.id}
          school={school}
        />
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
          <SchoolPromFormModal
            idForUpdate={params.schoolProm.id}
            btn={
              <MenuItem sx={{color: 'grey'}} ><Edit/>&#8288; Editar información</MenuItem>
            }
          />
          <ChangeIconDialog school={school} btn={
            <MenuItem sx={{color: 'grey'}} ><Edit/>&#8288; Cambiar Logo</MenuItem>
          } />
          <Divider/>
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
