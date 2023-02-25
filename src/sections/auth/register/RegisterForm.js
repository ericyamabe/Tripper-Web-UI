import React, { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------
/* eslint-disable camelcase */

export default function RegisterForm() {
  const [csrf, setCsrf] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPassword_Confirm] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword_Confirm, setShowPassword_Confirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getSession();
  }, []);

  function getCSRF() {
    fetch('http://localhost:8080/api/v1/csrf/', {
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
    fetch('http://localhost:8080/api/v1/accounts/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
      },
      credentials: 'include',
      body: JSON.stringify({ username, email, password, password_confirm }),
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        setIsAuthenticated(true);
        setUsername('');
        setEmail('');
        setPassword('');
        setPassword_Confirm('');
        setError('');
        getCSRF();
        // navigate('/dashboard/app', { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setError(err.error);
        if (password !== password_confirm) setError('Make sure passwords match.');
        if (password_confirm === '') setError('Enter a valid password.');
        if (password === '') setError('Enter a valid password.');
        if (email === '') setError('Enter a valid email.');
        if (username === '') setError('Enter a valid username.');
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
              name="password2"
              label="Confirm Password"
              id="password2"
              defaultValue={password_confirm}
              onChange={(e) => setPassword_Confirm(e.target.value)}
              type={showPassword_Confirm ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword_Confirm(!showPassword_Confirm)} edge="end">
                      <Iconify icon={showPassword_Confirm ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <div>{error && <small className="text-danger">{error}</small>}</div>
          <LoadingButton fullWidth size="large" type="submit" variant="contained">
            Register
          </LoadingButton>
        </form>
      </>
    );
  }
}
