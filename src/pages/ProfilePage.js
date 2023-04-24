import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {Box, Button, Card, Container, Grid, Stack, TextField, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../sections/auth/api/axios';
import { CHANGE_PASSWORD_URL, UPDATE_PROFILE_URL } from '../sections/auth/api/urls';
import GetCookie from '../sections/auth/api/GetCookie';
/* eslint-disable camelcase */

export default function ProfilePage() {
  const [data, setData] = useState('');
  const [showFields, setShowFields] = useState(false); // Add state variables
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [old_password, setOld_password] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPassword_confirm] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileError, setProfileError] = useState('');

  const navigate = useNavigate();

  // used to get CSRFToken from current cookie for API calls to verify user.
  const csrfFromCookie = GetCookie('csrftoken');

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/accounts/profile/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setUserId(data.id);
        setUsername(data.username);
        setFirst_name(data.first_name);
        setLast_name(data.last_name);
        setEmail(data.email);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEditProfileClick = () => {
    if (showFields === false) setShowFields(true); // show fields when the button is clicked
    else setShowFields(false);
  };

  const handleChangePasswordClick = () => {
    if (showPasswordFields === false) setShowPasswordFields(true); // show fields when the button is clicked
    else setShowPasswordFields(false);
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('username', username);
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email);

    try {
      await axios.put(`${UPDATE_PROFILE_URL}${userId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-CSRFToken': csrfFromCookie },
        withCredentials: true,
      });
      // console.log(JSON.stringify(response?.data));
      navigate(0);
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setProfileError('No Server Response');
      } else if (err.response?.status === 400) {
        if (username === '' && email === '') setProfileError('Username and Email fields cannot be empty.');
        else if (username === '') setProfileError('Username field cannot be empty.');
        else if (email === '') setProfileError('Email field cannot be empty.');
        else setProfileError('Something went wrong.');
      }
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('old_password', old_password);
    formData.append('password', password);
    formData.append('password_confirm', password_confirm);

    try {
      const response = await axios.post(CHANGE_PASSWORD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-CSRFToken': csrfFromCookie },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      setOld_password('');
      setPassword('');
      setPassword_confirm('');
      navigate('/login', { replace: true });
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setPasswordError('No Server Response');
      } else if (err.response?.status === 400) {
        if (password !== password_confirm) setPasswordError('Make sure new passwords match and try again.');
        else setPasswordError('Check old password and try again.');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title> Profile | Tripper </title>
      </Helmet>

      <Container>
        <Card>
          {data ? (
            <>
              {/* Show if showFields is true */}
              {showFields ? (
                <>
                  <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={6} lg={6}>
                      <Box py={3}>
                        <form onSubmit={handleUpdateProfileSubmit}>
                          <Stack spacing={2}>
                            <TextField
                              label="Username"
                              id="username"
                              value={username}
                              onChange={(e) => {
                                setUsername(e.target.value);
                              }}
                            />
                            <TextField
                              label="First Name"
                              id="first_name"
                              value={first_name}
                              onChange={(e) => {
                                setFirst_name(e.target.value);
                              }}
                            />
                            <TextField
                              label="Last Name"
                              id="last_name"
                              value={last_name}
                              onChange={(e) => {
                                setLast_name(e.target.value);
                              }}
                            />
                            <TextField
                              label="Email Address"
                              id="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                              }}
                            />
                            <div>{profileError && <small className="text-danger">{profileError}</small>}</div>
                            <Button type="submit" variant="contained">
                              Submit Changes
                            </Button>
                            <Button variant="contained" onClick={() => setShowFields(false)}>
                              Cancel
                            </Button>
                          </Stack>
                        </form>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  {showPasswordFields ? (
                    <>
                      {/* Show if showPasswordFields is true */}
                      <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={6} lg={6}>
                          <Box py={3}>
                            <form onSubmit={handleChangePasswordSubmit}>
                              <Stack spacing={2}>
                                <TextField
                                  label="Old Password"
                                  id="old_password"
                                  type="password"
                                  value={old_password}
                                  onChange={(e) => {
                                    setOld_password(e.target.value);
                                  }}
                                  required
                                />
                                <TextField
                                  label="New Password"
                                  id="password"
                                  type="password"
                                  value={password}
                                  onChange={(e) => {
                                    setPassword(e.target.value);
                                  }}
                                  required
                                />
                                <TextField
                                  label="Confirm New Password"
                                  id="password_confirm"
                                  type="password"
                                  value={password_confirm}
                                  onChange={(e) => {
                                    setPassword_confirm(e.target.value);
                                  }}
                                  required
                                />
                                <div>{passwordError && <small className="text-danger">{passwordError}</small>}</div>
                                <Button type="submit" variant="contained">
                                  Confirm Change Password
                                </Button>
                                <Button variant="contained" onClick={() => setShowPasswordFields(false)}>
                                  Cancel
                                </Button>
                              </Stack>
                            </form>
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      {/* Show if showFields and showPasswordFields are false */}
                      <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={6} lg={6}>
                          <Box sx={{ p: 5 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Grid container spacing={2} direction="column">
                                  <Grid item>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
                                        Username:
                                      </Typography>
                                      <Typography variant="body1">{username}</Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
                                        First Name:
                                      </Typography>
                                      <Typography variant="body1">{first_name}</Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={6}>
                                <Grid container spacing={2} direction="column">
                                  <Grid item>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
                                        Email:
                                      </Typography>
                                      <Typography variant="body1">{email}</Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <Typography variant="body1" fontWeight="bold" sx={{ mr: 1 }}>
                                        Last Name:
                                      </Typography>
                                      <Typography variant="body1">{last_name}</Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box sx={{ width: "100%" }}>
                                  <Button variant="contained" sx={{ width: "100%", my: 1 }} onClick={handleEditProfileClick}>
                                    Edit Profile
                                  </Button>
                                  <Button variant="contained" sx={{ width: "100%", my: 1 }} onClick={handleChangePasswordClick}>
                                    Change Password
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <div>Loading profile data...</div>
          )}
        </Card>
      </Container>
    </>
  );
}
