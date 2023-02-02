import { useContext, useState} from 'react';
import Button from '@mui/material/Button';
import { Settings as SettingsIcon, Edit as EditIcon, Logout as LogoutIcon } from '@mui/icons-material'
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { MenuStyled } from '../styles/MenuStyled'
import { FormControlLabel, Switch } from '@mui/material';
import { Menu as MenuIcon, SaveAlt as SaveAltIcon } from '@mui/icons-material'
import { SchoolPromFormModal } from './forms/SchoolPromFormModal';
import { SchoolPromContext } from '../context/api/schools';
import { YearSelect } from './forms/YearSelect';
import { useNetStatus } from '../hooks/useNetStatus';

export const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const useSchoolProm = useContext(SchoolPromContext)
  const { isAppOffline, toggleOfflineMode } = useNetStatus()

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
          <YearSelect
            onSelect={(y) => useSchoolProm?.setYear(y)}
            defaultValue={useSchoolProm?.year}
          />
        </MenuItem>
        <SchoolPromFormModal btn={
          <MenuItem>
            <EditIcon/>&#8288;Agregar escuela
          </MenuItem>
        }
        />

        {isAppOffline() && <MenuItem onClick={handleClose}>
          <SaveAltIcon/>
          &#8288;Respaldar todo
        </MenuItem>}

        <MenuItem onClick={handleClose} disableRipple>
          <SettingsIcon/>
          &#8288;Ajustes
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={toggleOfflineMode} disableRipple disableTouchRipple>
          <FormControlLabel control={<Switch checked={isAppOffline()}/>} label="&#8288;Modo offline" />
        </MenuItem>
        {!isAppOffline() && <Divider sx={{ my: 0.5 }} /> }
        {!isAppOffline() && <MenuItem onClick={handleClose} disableRipple>
          <LogoutIcon/>
          &#8288;Cerrar sesión
        </MenuItem>
        }

      </MenuStyled>
    </div>
  );
}
