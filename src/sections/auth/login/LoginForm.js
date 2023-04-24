import React, { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import axios from '../api/axios';
import GetCookie from '../api/GetCookie';
import { CSRF_URL, LOGIN_URL, SESSION_URL } from '../api/urls';

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

  // Get Started button
  const handleClick = (e) => {
    navigate('/register', { replace: true });
  };

  // Will use for Login button once testing is finished
  // const handleClickLogin = (e) => {
  //   navigate('/dashboard', { replace: true });
  // };

  // runs getSession function persistently on every page load
  useEffect(() => {
    getSession();
  }, []);

  // checks/sets session and verifies if isAuthenticated or not based on credentials
  function getSession() {
    axios
      .get(SESSION_URL, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
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

  // gets CSRF Token from backend
  function getCSRF() {
    axios
      .get(CSRF_URL, {
        withCredentials: true,
      })
      .then((res) => {
        const csrfToken = res.headers['x-CSRFToken'];
        setCsrf(csrfToken);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // checks API response is within acceptable range
  // function isResponseOk(response) {
  //   if (response.status >= 200 && response.status <= 299) {
  //     return response.json();
  //   }
  //   throw Error(response.statusText);
  // }

  // used to get CSRFToken from current cookie for API calls to verify user.
  const csrfFromCookie = GetCookie('csrftoken');

  // handles login request through POST to backend, requires credentials and CSRF token
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ login, password }), {
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfFromCookie },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      setLogin('');
      setPassword('');
      setError('');
      setIsAuthenticated(true);
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
  };

  // if awaiting API response
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  // if user is authenticated
  if (isAuthenticated) {
    return navigate('/dashboard', { replace: true });
  }
  // if user is not authenticated
  return (
    <>
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
            <Link variant="subtitle2" underline="hover">
              Forgot password?
            </Link>
          </Stack>
          <LoadingButton fullWidth size="large" type="submit" variant="contained">
            Login
          </LoadingButton>
        </form>
      </section>
    </>
  );
}
