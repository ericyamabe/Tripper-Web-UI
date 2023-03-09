import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// import { faker } from '@faker-js/faker';
// // @mui
// import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
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
  const [origin, setOrigin, destination, setDestination] = useOutletContext();

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
            <AppGoogleMapsAPI title="Tripper Map" subheader="Plan your next trip!" origin={origin} destination={destination} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
