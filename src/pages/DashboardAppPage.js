import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// // @mui
import { Grid, Container, Typography, Card, Stack } from '@mui/material';
// sections
import { LoadingButton } from '@mui/lab';
import { AppGoogleMapsAPI } from '../sections/@dashboard/app';
import { StopList } from '../sections/@dashboard/trip';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [
    origin,
    setOrigin,
    destination,
    setDestination,
    waypts,
    setWaypts,
    uuid,
    setUuid,
    name,
    setName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isLoaded,
    setIsLoaded,
    user,
    setUser,
    toggleRefresh,
    setToggleRefresh,
  ] = useOutletContext();

  const navigate = useNavigate();

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

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <AppGoogleMapsAPI
              title={name !== '' ? name : 'Tripper Map'}
              subheader={name !== '' ? `${startDate} to ${endDate}` : 'Plan your next trip!'}
              origin={origin}
              destination={destination}
              waypoints={waypts}
              toggleRefresh={toggleRefresh}
            />
            <Grid container item xs={12} justifyContent="center">
              <Card sx={{ mt: 3, p: 3, width: 0.75 }}>
                {origin !== '' ? (
                  <StopList
                    setToggleRefresh={setToggleRefresh}
                    waypoints={waypts}
                    setWaypts={setWaypts}
                    setOrigin={setOrigin}
                    setDestination={setDestination}
                    setName={setName}
                  />
                ) : (
                  <Stack alignItems="center" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                    <LoadingButton
                      sx={{ m: 1, p: 1 }}
                      fullWidth
                      size="large"
                      variant="contained"
                      onClick={() => navigate('/dashboard/profile', { replace: true })}
                    >
                      View Profile
                    </LoadingButton>
                    <LoadingButton
                      sx={{ m: 1, p: 1 }}
                      fullWidth
                      size="large"
                      variant="contained"
                      onClick={() => navigate('/dashboard/trips', { replace: true })}
                    >
                      View Trips
                    </LoadingButton>
                  </Stack>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
