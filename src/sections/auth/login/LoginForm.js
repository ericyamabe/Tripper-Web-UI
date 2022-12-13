import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // @mui
// import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
// import { LoadingButton } from '@mui/lab';
// // components
// import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [csrf, setCsrf] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);

  // const navigate = useNavigate();
  //
  // const handleClick = (e) => {
  //   navigate('/dashboard', { replace: true });
  // };

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

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
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
    //   return (
    //     <>
    //       <form onSubmit={login}>
    //         <Stack spacing={3}>
    //           <TextField name="username" label="Username" id="username" defaultValue={username} onChange={handleUsernameChange}/>
    //
    //           <TextField
    //             name="password"
    //             label="Password"
    //             id="password"
    //             defaultValue={password}
    //             type={showPassword ? 'text' : 'password'}
    //             InputProps={{
    //               endAdornment: (
    //                 <InputAdornment position="end">
    //                   <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
    //                     <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
    //                   </IconButton>
    //                 </InputAdornment>
    //               ),
    //             }}
    //           />
    //         </Stack>
    //         <div>{error && <small className="text-danger">{error}</small>}</div>
    //
    //
    //       <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
    //         <Checkbox name="remember" label="Remember me" />
    //         <Link variant="subtitle2" underline="hover">
    //           Forgot password?
    //         </Link>
    //       </Stack>
    //
    //       <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
    //         Login
    //       </LoadingButton>
    //       </form>
    //     </>
    //   );
    // }
    return (
      <div className="container mt-3">
        <h2>Login</h2>
        <form onSubmit={login}>
          <div className="form-group">
            <label htmlFor="username">
              Username&nbsp;
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="username">
              Password&nbsp;
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </label>
            <div>{error && <small className="text-danger">{error}</small>}</div>
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
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
