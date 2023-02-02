import React, { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [csrf, setCsrf] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate('/register', { replace: true });
  };

  useEffect(() => {
    getSession();
  }, []);

  function getCSRF() {
    fetch('http://localhost:8080/api/csrf/', {
      credentials: 'include',
    })
      .then((res) => {
        const csrfToken = res.headers.get('X-CSRFToken');
        setCsrf(csrfToken);
        console.log(csrfToken);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getSession() {
    fetch('http://localhost:8080/api/session/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          getCSRF();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    }
    throw Error(response.statusText);
  }

  function login(event) {
    event.preventDefault();
    fetch('http://localhost:8080/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
        setError('');
      })
      .catch((err) => {
        console.log(err);
        setError('Wrong username or password.');
      });
  }

  function logout() {
    fetch('http://localhost:8080/api/logout', {
      credentials: 'include',
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(false);
        getCSRF();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function whoami() {
    fetch('http://localhost:8080/api/whoami/', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`You are logged in as: ${data.username}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (!isAuthenticated) {
    return (
      <>
        <Typography variant="h4" sx={{ mb: 5 }} gutterBottom>
          Sign up for Tripper
        </Typography>

        <form onSubmit={login}>
          <Stack spacing={3} justifyContent="space-between" sx={{ mb: 2 }}>
            <TextField
              name="username"
              label="Username"
              id="username"
              defaultValue={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              name="password"
              label="Password"
              id="password"
              defaultValue={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="confirmpassword"
              label="Confirm Password"
              id="confirmpassword"
              defaultValue={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

              <TextField
                  name="email"
                  label="Email"
                  id="email"
                  defaultValue={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
          </Stack>
          <div>{error && <small className="text-danger">{error}</small>}</div>

          {/* <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}> */}
          <LoadingButton fullWidth size="large" type="submit" variant="contained">
            Register
          </LoadingButton>
        </form>
      </>
    );
  }

  return (
    <div className="container mt-3">
      <p>You are logged in!</p>
      <button type="button" className="btn btn-primary mr-2" onClick={whoami}>
        WhoAmI
      </button>
      <button type="button" className="btn btn-danger" onClick={logout}>
        Log out
      </button>
    </div>
  );
}
