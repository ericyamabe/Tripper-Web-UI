import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// // @mui
import { Grid, Container, Typography, TextField, Box, Card, Button, Stack } from '@mui/material';
// // components
// sections
import { AppGoogleMapsAPI } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [origin, setOrigin, destination, setDestination, waypts, setWaypts, isLoaded, user] = useOutletContext();

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
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              waypoints={waypts}
              setWaypts={setWaypts}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
