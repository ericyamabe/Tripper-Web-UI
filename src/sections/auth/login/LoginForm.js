import React, { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import axios from '../api/axios';
import WhoAmI from '../WhoAmI';

// ----------------------------------------------------------------------
/* eslint-disable camelcase */

export default function LoginForm() {
  const [csrf, setCsrf] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  // const { isAuthenticated, setIsAuthenticated } = useAuth();
  const LOGIN_URL = '/api/v1/accounts/login/';
  const LOGOUT_URL = '/api/v1/accounts/logout/';

  const handleClick = (e) => {
    navigate('/register', { replace: true });
  };

  const handleClickLogin = (e) => {
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    getSession();
  }, []);

  function getCSRF() {
    fetch('http://localhost:8080/api/v1/get_csrf/', {
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
    fetch('http://localhost:8080/api/v1/session/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setIsLoaded(true);
        } else {
          setIsLoaded(true);
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ login, password }), {
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      getCSRF();
      // setAuth({ login, password, csrf });
      setLogin('');
      setPassword('');
      setError('');
      // setIsAuthenticated(true);
      setSuccess(true);
      setIsLoaded(true);
    } catch (err) {
      if (!err?.response) {
        setError('No Server Response');
      } else if (err.response?.status === 400) {
        setError('Wrong username or password.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized');
      } else {
        setError('Login Failed');
      }
    }



    // fetch('http://localhost:8080/api/v1/accounts/login/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-CSRFToken': csrf,
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify({ login, password }),
    // })
    //   .then(isResponseOk)
    //   .then((data) => {
    //     console.log(data);
    //     setIsAuthenticated(true);
    //     setLogin('');
    //     setPassword('');
    //     setError('');
    //     setSuccess(true);
    //     getCSRF();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setError('Wrong username or password.');
    //   });
  };

  const handleLogout = async (e) => {
    await fetch('http://localhost:8080/api/v1/accounts/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
      },
      credentials: 'include',
      // body: JSON.stringify({ revoke_token: true }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(false);
        setSuccess(false);
        // Headers.get('csrftoken');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return (
      <div className="container mt-3">
        <p>You are logged in!</p>
        <button type="button" className="btn btn-primary mr-2" onClick={WhoAmI}>
          WhoAmI
        </button>
        <button type="button" className="btn btn-danger" onClick={handleClickLogin}>
          Home
        </button>
        <button type="button" className="btn btn-danger" onClick={handleLogout}>
          Log out
        </button>
      </div>
    );
  }
  return (
    <>
      {success ? (
        <div className="container mt-3">
          <p>You are logged in!</p>
          <button type="button" className="btn btn-primary mr-2" onClick={WhoAmI}>
            WhoAmI
          </button>
          <button type="button" className="btn btn-danger" onClick={handleClickLogin}>
            Home
          </button>
          <button type="button" className="btn btn-danger" onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : (
        <section>
          <Typography variant="h4" gutterBottom>
            Sign in to Tripper
          </Typography>

          <Typography variant="body2" sx={{ mb: 5 }}>
            Don’t have an account? {''}
            <Link component="button" variant="subtitle2" onClick={handleClick}>
              Get started
            </Link>
          </Typography>

          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                name="login"
                label="Username"
                id="login"
                defaultValue={login}
                onChange={(e) => setLogin(e.target.value)}
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
            </Stack>
            <div>{error && <small className="text-danger">{error}</small>}</div>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
              {/* <Checkbox name="remember" label="Remember me" /> */}
              <Link variant="subtitle2" underline="hover">
                Forgot password?
              </Link>
            </Stack>

            {/* <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}> */}
            {/* <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClickLogin}> */}
            <LoadingButton fullWidth size="large" type="submit" variant="contained">
              Login
            </LoadingButton>
          </form>
        </section>
      )}
    </>
  );
}
