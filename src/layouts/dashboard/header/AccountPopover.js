import { useState, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
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

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState('Guest');
  const [email, setEmail] = useState('')

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

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
              if (data.username)
                setUser(data.username);
              if(data.email)
                setEmail(data.email)
              console.log(user);
              console.log(email);
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

  // doesn't work yet, token issues
  const handleLogout = async (e) => {
    await fetch('http://localhost:8080/api/v1/accounts/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFToken': 'csrf',
      },
      credentials: 'include',
      body: JSON.stringify({ revoke_token: true }),
    })
      // .then(isResponseOk)
      .then((data) => {
        console.log(data);
        // setIsAuthenticated(false);
        // setSuccess(false);
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

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
