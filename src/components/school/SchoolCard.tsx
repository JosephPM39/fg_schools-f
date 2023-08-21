import { Article, Delete, Edit, KeyboardArrowDown } from '@mui/icons-material'
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
import { Box } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import { IEmployee, IEmployeePosition, IPosition, ISchool, ISchoolProm } from '../../api/models_school'
import { EmployeeContext, EmployeePositionContext, PositionContext, SchoolContext } from '../../context/api/schools'
import { useDebounce } from '../../hooks/useDebouce'
import { useNearScreen } from '../../hooks/useNearScreen'
import { SectionsModal } from './SectionsModal'
import DefaultIcon from '../../assets/signature.png'
import ImageError from '../../assets/image-error.png'
import { SchoolPromFormModal } from './forms/SchoolPromFormModal'
import { StorageFileContext } from '../../context/files/StorageFilesContext'
import { SubDir } from '../../hooks/api/files/useStorageFile'
import { ChangeIconDialog } from './forms/ChangeSchoolIconDialog'

interface Params {
  schoolProm?: ISchoolProm
  paginationNext?: () => void
}

export const SchoolCard = (params: Params) => {
  const {
    schoolProm,
    paginationNext
  } = params
  const [school, setSchool] = useState<ISchool | null>(null)

  const useSchool = useContext(SchoolContext)
  const { element, show } = useNearScreen()
  const { promiseHelper } = useDebounce()
  const useStorageFile = useContext(StorageFileContext)
  const useStorage = useStorageFile?.newStorage(SubDir.schoolIcons)

  useEffect(() => {
    if (!show) return
    if (schoolProm != null) return
    if (paginationNext == null) return
    paginationNext()
  }, [show])

  useEffect(() => {
    if (!show) return
    const get = async () => {
      if ((params.schoolProm == null) || (useSchool == null)) return
      const school = await useSchool.findOne({ id: params.schoolProm.schoolId })
      if (school == null) {
        const school = await promiseHelper(useSchool.findOne({ id: params.schoolProm.schoolId }), 5000)

        return setSchool(school)
      }
      setSchool(school)
    }
    void get()
  }, [show, params, useSchool?.data, useSchool?.data.length])

  const Header = () => {
    const [icon, setIcon] = useState<string>()
    useEffect(() => {
      const getData = async () => {
        if (school == null) return
        if (school.icon === 'default') return setIcon(DefaultIcon)
        const iconUrl = await useStorage?.getPreviewUrl(school.icon)
        setIcon(iconUrl ?? ImageError)
      }
      void getData()
    }, [school])

    if (icon) {
      return <CardMedia
        component="img"
        alt={school?.name}
        height="140"
        image={icon}
      />
    }
    return <Box height='140px' width='345px' display='flex' alignItems='center' justifyContent='center'>
      <CircularProgress />
    </Box>
  }

  const Body = () => {
    const [principal, setPrincipal] = useState<IEmployeePosition | null>(null)
    const [employee, setEmployee] = useState<IEmployee | null>(null)
    const [position, setPosition] = useState<IPosition | null>(null)

    const useEmployeePosition = useContext(EmployeePositionContext)
    const useEmployee = useContext(EmployeeContext)
    const usePosition = useContext(PositionContext)

    useEffect(() => {
      if (!show) return
      const get = async () => {
        if ((schoolProm == null) || (useEmployeePosition == null)) return
        const principal = await useEmployeePosition.findOne({ id: schoolProm.principalId })
        setPrincipal(principal)
      }
      void get()
    }, [show, params, useEmployeePosition?.data])

    useEffect(() => {
      if (!show || (useEmployee == null)) return
      const get = async () => {
        const employee = await useEmployee.findOne({ id: principal?.employeeId })
        setEmployee(employee)
      }
      void get()
    }, [show, params, useEmployee?.data, principal])

    useEffect(() => {
      if (!show || (usePosition == null)) return
      const get = async () => {
        const position = await usePosition.findOne({ id: principal?.positionId })
        setPosition(position)
      }
      void get()
    }, [show, params, usePosition?.data, principal])

    if (school && position && employee) {
      return <>
        <Typography gutterBottom variant="h5" component="div">
          {school.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dirección: {school?.location}
          <br />
          Código: {school?.code}
          <br />
          {`${position?.name}: `}
          {`${employee?.profesion} `}
          {`${employee?.firstName} `}
          {`${employee?.lastName} `}
        </Typography>
      </>
    }
    return <>
      <Typography gutterBottom variant="h5" component="div">
        Loading...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Loading...
        <br />
        <br />
        <br />
        <br />
      </Typography>
    </>
  }

  const Actions = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
      setAnchorEl(null)
    }

    if (!show || !schoolProm) {
      return <>
        <br />
        ...loading
        <br />
      </>
    }

    return <>
      <SectionsModal
        btnProps={{
          children: 'Abrir',
          startIcon: <Article />,
          variant: 'contained',
          color: 'info',
          size: 'small',
          disabled: !schoolProm
        }}
        initOpen={false}
        schoolProm={schoolProm}
        school={school}
      />
      <Button
        id={`school-menu-button-${schoolProm.id ?? ''}`}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant='outlined'
        size='small'
        disabled={!schoolProm}
        endIcon={<KeyboardArrowDown />}
      > Más opciones </Button>
      <Menu
        id={`school-menu-${schoolProm.id ?? ''}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <SchoolPromFormModal
          idForUpdate={schoolProm.id}
          btn={
            <MenuItem sx={{ color: 'grey' }} ><Edit />&#8288; Editar información</MenuItem>
          }
        />
        <ChangeIconDialog school={school} btn={
          <MenuItem sx={{ color: 'grey' }} ><Edit />&#8288; Cambiar Logo</MenuItem>
        } />
        <Divider />
        <MenuItem onClick={handleClose} sx={{ color: 'red' }}><Delete />&#8288; Eliminar</MenuItem>
      </Menu>
    </>
  }

  return (
    <Card ref={element} sx={{ maxWidth: 345 }}>
      <Header />
      <CardContent>
        <Body />
      </CardContent>
      <CardActions>
        <Actions />
      </CardActions>
    </Card>
  )
}
