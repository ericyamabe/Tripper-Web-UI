import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// // @mui
import { Grid, Container, Typography, TextField, Box, Card, Button, Stack } from '@mui/material';
// // components
// sections
import { LoadingButton } from '@mui/lab';
import { AppGoogleMapsAPI } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [input, setInput] = useState('');
  const [origin, setOrigin, destination, setDestination, waypts, setWaypts, isLoaded, user] = useOutletContext();

  const handleClick = () => {
    setWaypts((prevWaypts) => [
      ...prevWaypts,
      {
        location: input.valueOf(),
      },
    ]);
    console.log(waypts);
    // WAYPOINTS WORK, NEED TO FIGURE OUT HOW TO REFRESH MAP COMPONENT
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
              waypoints={waypts}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ m: 3 }}>
          <Grid item xs={9} md={9} lg={9}>
            <Card sx={{ p: 3 }}>
              Add waypoint?
              <Stack spacing={3}>
                <TextField
                  name="waypoint"
                  label="Set Waypoint..."
                  id="waypoint"
                  defaultValue={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </Stack>
              <LoadingButton fullWidth size="large" variant="contained" onClick={handleClick}>
                Add
              </LoadingButton>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
