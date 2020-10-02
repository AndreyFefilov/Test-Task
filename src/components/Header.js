import { AppBar, Container, Toolbar, Typography, Box} from '@material-ui/core';
import React from 'react';
import '../App.scss';
import AuthService from "../services/AuthService"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import {LS_AUTH_KEY} from "../services/AuthService"

let me = null;

function returnHeaderRightBlock(history) {
  me = localStorage.getItem(LS_AUTH_KEY);
  return (
    <Box className='header__right-block'>
      <Box className='header__right-block__username'>
        {me}
      </Box>
      <Box className='header__right-block__exit-icon'>
        <ExitToAppIcon
          onClick= {() => {
            AuthService.logout(() => {
              history.push('/login');
            })
          }}
      />
      </Box>
    </Box>
  )
}

const Header = (props) => {
  const history = useHistory();
    return (
      <>
        <AppBar
          className='header'
          position="relative"
          style={{background: '#212121'}}
          position='fixed'
        >
          <Container fixed>
            <Toolbar>
              <Box className='header__left-block'>
                <Box className='header__left-block__logo'>
                  <img style={{height: '100%'}} src={"./rubiuscompany.png"} alt="Logo"/>
                </Box>
                <Box className='header__left-block__text'>
                  <Typography variant="h6">
                    Tестовое задание
                  </Typography>
                </Box>
              </Box>
              { AuthService.loggedIn() && (returnHeaderRightBlock(history)) }
            </Toolbar>
          </Container>
        </AppBar>
      </>
    );
}

export default Header;