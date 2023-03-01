import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { LOGOUT_URL, WHOAMI_URL } from '../../../sections/auth/api/urls';
// mocks_
import account from '../../../_mock/account';
import GetCookie from '../../../sections/auth/api/GetCookie';

// ----------------------------------------------------------------------

const MENU_OPTIONS_USER = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

const MENU_OPTIONS_GUEST = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Sign In',
    icon: 'eva:person-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState('Guest');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // Uses /api/v1/whoami/ to fetch username from logged in user, defaults guest if not logged in
  useEffect(() => {
    axios
      .get(WHOAMI_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        if (data.username) setUser(data.username);
        if (data.email) setEmail(data.email);
        setIsLoaded(true);
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, []);

  // checks API response is within acceptable range
  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    }
    throw Error(response.statusText);
  }

  // used to get CSRFToken from current cookie for API calls to verify user.
  const csrfFromCookie = GetCookie('csrftoken');

  // handles logout request through POST to backend, requires CSRF token
  // axios call won't work for some reason, but fetch does ??
  const handleLogout = async (e) => {
    e.preventDefault();

    await fetch(LOGOUT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfFromCookie,
      },
      credentials: 'include',
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
        <Avatar src={user !== 'Guest' ? account.photoURL : ''} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {/* {account.displayName} */}
            {isLoaded ? user : 'Loading...'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {/* {account.email} */}
            {isLoaded ? email : 'Loading...'}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        {user !== 'Guest' ? (
          <>
            <Stack sx={{ p: 1 }}>
              {MENU_OPTIONS_USER.map((option) => (
                <MenuItem key={option.label} onClick={handleClose}>
                  {option.label}
                </MenuItem>
              ))}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <Stack sx={{ p: 1 }}>
              {MENU_OPTIONS_GUEST.map((option) => (
                <MenuItem key={option.label} onClick={handleClose}>
                  {option.label}
                </MenuItem>
              ))}
            </Stack>
          </>
        )}
      </Popover>
    </>
  );
}
