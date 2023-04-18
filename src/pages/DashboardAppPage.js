import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// // @mui
import { Grid, Container, Typography, Card } from '@mui/material';
// sections
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
              title={name !== '' ? name : 'Tripper Map'}
              subheader={name !== '' ? `${startDate} to ${endDate}` : 'Plan your next trip!'}
              origin={origin}
              destination={destination}
              waypoints={waypts}
              toggleRefresh={toggleRefresh}
            />
            {origin !== '' && (
              <Card sx={{ m: 3, p: 3 }}>
                <StopList setToggleRefresh={setToggleRefresh} setWaypts={setWaypts} setOrigin={setOrigin} setDestination={setDestination} setName={setName} />
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
