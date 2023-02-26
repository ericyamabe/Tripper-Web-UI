import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [csrf, setCsrf] = useState('');
  //
  // useEffect(() => {
  //   getSession();
  // }, []);
  //
  // function getCSRF() {
  //   fetch('http://localhost:8080/api/v1/csrf/', {
  //     credentials: 'include',
  //   })
  //       .then((res) => {
  //         const csrfToken = res.headers.get('X-CSRFToken');
  //         setCsrf(csrfToken);
  //         console.log(csrfToken);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // }
  //
  // function getSession() {
  //   fetch('http://localhost:8080/api/v1/session/', {
  //     credentials: 'include',
  //   })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //         if (data.isAuthenticated) {
  //           setIsAuthenticated(true);
  //         } else {
  //           setIsAuthenticated(false);
  //           GetCSRF();
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  // }

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
