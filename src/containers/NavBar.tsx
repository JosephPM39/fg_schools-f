import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { NavMenu } from '../components/NavMenu'
import Icon from '../assets/icon.png'

export const NavBar = ({children}:{children?: JSX.Element[] | JSX.Element}) => {
  return (
    <AppBar position='sticky' component='nav'>
      <Toolbar>
        <p style={{ flexGrow: 1, margin: 0}} >
          <IconButton>
            <img src={Icon} width='40' alt='icon'/>
          </IconButton>
        </p>
        { children }
        <div>
          <NavMenu/>
        </div>
      </Toolbar>
    </AppBar>
  );
}
