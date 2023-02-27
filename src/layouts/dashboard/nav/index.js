import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {Box, Link, Drawer, Typography, Avatar, Stack, Button} from '@mui/material';
// mock
import account from '../../../_mock/account';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import {navConfig1, navConfig2, navConfig3, navConfig4} from './config';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState('Guest');
  const [role, setRole] = useState('');

  // const { isAuthenticated } = useAuth();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // fetches username from logged in user, defaults guest if not logged in
  useEffect(() => {
    fetch('http://localhost:8080/api/v1/whoami/', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          if (data.username) setUser(data.username);
          if (data.role === true) setRole('Admin');
          if (data.role === false) setRole('Guest');
          if (!data.role) setRole('');
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
            <Avatar src={user !== 'Guest' ? account.photoURL : ''} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {/* {account.displayName} */}
                {isLoaded ? user : 'Loading...'}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {/* {account.role} */}
                {isLoaded ? role : 'Loading...'}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>
      {/* displays navConfig1 if not logged in, navConfig2 if logged in */}
      <NavSection data={user === 'Guest' ? navConfig1 : navConfig2} />
      <NavSection data={role === 'Admin' ? navConfig3 : navConfig4} />
      <Box sx={{ flexGrow: 1 }} />
      {/* <Box sx={{ px: 2.5, pb: 3, mt: 10 }}> */}
      {/*   <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}> */}
      {/*     <Button href="https://material-ui.com/store/items/minimal-dashboard/" target="_blank" variant="contained"> */}
      {/*       Upgrade to Pro */}
      {/*     </Button> */}
      {/*   </Stack> */}
      {/* </Box> */}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
