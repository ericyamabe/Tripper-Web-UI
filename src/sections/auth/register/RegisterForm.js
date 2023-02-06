import React, { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [csrf, setCsrf] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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

  function register(event) {
    event.preventDefault();
    fetch('http://localhost:8080/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
      },
      credentials: 'include',
      body: JSON.stringify({ username, email, password1, password2 }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        console.log(JSON.stringify({ username, email, password1, password2 }));
        // setIsAuthenticated(true);
        // setUsername('');
        // setEmail('');
        // setPassword1('');
        // setPassword2('');
        // setError('');
      })
      .catch((err) => {
        console.log(err);
        setError('Something went wrong.');
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

        <form onSubmit={register}>
          <Stack spacing={3} justifyContent="space-between" sx={{ mb: 2 }}>
            <TextField
              name="username"
              label="Username"
              id="username"
              defaultValue={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              name="email"
              label="Email"
              id="email"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              name="password1"
              label="Password"
              id="password1"
              defaultValue={password1}
              onChange={(e) => setPassword1(e.target.value)}
              type={showPassword1 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword1(!showPassword1)} edge="end">
                      <Iconify icon={showPassword1 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="password2"
              label="Confirm Password"
              id="password2"
              defaultValue={password2}
              onChange={(e) => setPassword2(e.target.value)}
              type={showPassword2 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                      <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
