import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// import { faker } from '@faker-js/faker';
// // @mui
// import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, TextField, Box, Card, Button } from '@mui/material';
// // components
// import Iconify from '../components/iconify';
// sections
import axios from 'axios';
import { AppGoogleMapsAPI } from '../sections/@dashboard/app';
import { WHOAMI_URL } from '../sections/auth/api/urls';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  // const theme = useTheme();
  const [user, setUser] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');
  const [origin, setOrigin, destination, setDestination, waypoints, setWaypoints] = useOutletContext();

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
        setIsLoaded(true);
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const handleClick = () => {
    console.log(waypoints);
    console.log(input);
    // setWaypoints((prevWaypoints) => [
    //   ...prevWaypoints,
    setWaypoints(() => [
      {
        location: input,
      }
    ])
    console.log(waypoints);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Tripper </title>
      </Helmet>

      <Container maxWidth="xl">
        {!isLoaded ? (
          'Loading...'
        ) : user ? (
          <>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Hi, {user} Welcome Back to Tripper
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Welcome to Tripper
            </Typography>
          </>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <AppGoogleMapsAPI
              title="Tripper Map"
              subheader="Plan your next trip!"
              origin={origin}
              destination={destination}
              waypoints={waypoints}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ m: 3 }}>
          <Grid item xs={9} md={9} lg={9}>
            <Card sx={{ p: 3 }}>
              Add waypoint?
              {/* <TextField id="outlined-basic" label="Enter Waypoint" variant="outlined" /> */}
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="waypoint-text"
                  label="Waypoint..."
                  variant="outlined"
                  value={input}
                  onChange={handleChange}
                />
                <Button id="waypoint-button" variant="contained" onClick={handleClick}>
                  Add
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
