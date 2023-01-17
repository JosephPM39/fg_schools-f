import { useContext, useState} from 'react';
import Button from '@mui/material/Button';
import { Settings as SettingsIcon, Edit as EditIcon, Logout as LogoutIcon } from '@mui/icons-material'
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { MenuStyled } from '../styles/MenuStyled'
import { FormControl, FormControlLabel, InputLabel, Select, SelectChangeEvent, Switch } from '@mui/material';
import { Menu as MenuIcon, SaveAlt as SaveAltIcon } from '@mui/icons-material'
import { SchoolFormModal } from './forms/SchoolFormModal';
import { SchoolContext, SchoolPromContext } from '../context/api/schools';
import { isNumber } from 'class-validator';
import { YearSelect } from './forms/YearSelect';

export const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const useSchool = useContext(SchoolContext)
  const useSchoolProm = useContext(SchoolPromContext)

  const postSchool = () => {
    useSchool?.create({
      data: {
        "name": "aasdf",
        "code": "75289-5897",
        "icon": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/540.jpg",
        "location": "aaaaaaaaaaaaaaaaaa"
      }
    })
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        sx={{mx: 1}}
      >
        <MenuIcon/>
      </Button>
      <MenuStyled
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem disableRipple>
          <YearSelect hook={[useSchoolProm?.year, useSchoolProm?.setYear]} />
        </MenuItem>
        <SchoolFormModal btn={
          <MenuItem>
            <EditIcon/>&#8288;Agregar escuela
          </MenuItem>
        }
        />
        <MenuItem onClick={handleClose}>
          <SaveAltIcon/>
           &#8288;Respaldar todo
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <SettingsIcon/>
          &#8288;Ajustes
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem disableRipple disableTouchRipple>
          <FormControlLabel control={<Switch defaultChecked />} label="&#8288;Modo offline" />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <LogoutIcon/>
          &#8288;Cerrar sesión
        </MenuItem>


      </MenuStyled>
    </div>
  );
}
