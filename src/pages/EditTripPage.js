import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
// @mui
import { Box, Button, Card, Checkbox, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import axios from '../sections/auth/api/axios';
import { TRIP_UPDATE_URL } from '../sections/auth/api/urls';
import GetCookie from '../sections/auth/api/GetCookie';
import Iconify from '../components/iconify';
/* eslint-disable camelcase */

export default function EditTripPage() {
  const [error, setError] = useState('');
  const { state } = useLocation();
  const { passStatus } = state;
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
    status,
    setStatus,
  ] = useOutletContext();
  const [stop_locations, setStop_locations] = useState(waypts.map((waypoint) => waypoint.location));

  const navigate = useNavigate();

  // used to get CSRFToken from current cookie for API calls to verify user.
  const csrfFromCookie = GetCookie('csrftoken');

  useEffect(() => {
    if (waypts.length > 0) {
      setStop_locations(waypts.map((waypoint) => waypoint.location));
    }
    setStatus(passStatus);
  }, [waypts]);

  const handleCancel = () => {
    setOrigin('');
    setDestination('');
    setWaypts([]);
    setUuid('');
    setName('');
    setStartDate('');
    setEndDate('');
    setStatus('');
    navigate('/dashboard/trips', { replace: true });
  };

  const handleCheckboxClick = (event) => {
    if (event.target.checked) {
      setStatus('complete');
    } else {
      setStatus('planned');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('uuid', uuid);
    formData.append('name', name);
    formData.append('start', origin);
    formData.append('destination', destination);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    const stopLocationsArray = stop_locations.map((location) => ({ location }));
    formData.append('stop_locations', JSON.stringify(stopLocationsArray));
    formData.append('stop_criteria', '{}');
    formData.append('notes', status);

    try {
      const response = await axios.post(TRIP_UPDATE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-CSRFToken': csrfFromCookie },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      navigate('/dashboard/trips', { replace: true });
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setError('No Server Response');
      } else if (err.response?.status === 501) {
        setError('Wrong format.');
      } else if (err.response?.status === 500) {
        setError('Wrong format.');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title> Edit Trip | Tripper </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Edit Trip
          </Typography>
        </Stack>
        <Card>
          <Grid container alignItems="center" justifyContent="center" spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Box py={5}>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      id="name"
                      label="Name"
                      required
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                      }}
                    />
                    <TextField
                      id="start"
                      label="Start Location"
                      required
                      value={origin}
                      onChange={(event) => {
                        setOrigin(event.target.value);
                      }}
                    />
                    <TextField
                      id="destination"
                      label="Destination"
                      required
                      value={destination}
                      onChange={(event) => {
                        setDestination(event.target.value);
                      }}
                    />
                    <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item xs={6}>
                        <Box display="flex" sx={{ pl: 1 }} alignItems="center">
                          <Typography>Add stops?</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center" sx={{ pr: 1 }} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            onClick={() => {
                              if (stop_locations.length < 10) {
                                const newLocations = [...stop_locations, ''];
                                setStop_locations(newLocations);
                              }
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                    {stop_locations.map((location, index) => (
                      <Box key={index} display="flex" alignItems="center">
                        <TextField
                          value={location}
                          label="Add Stop..."
                          fullWidth
                          required
                          sx={{ pr: 2 }}
                          onChange={(event) => {
                            const newLocations = [...stop_locations];
                            newLocations[index] = event.target.value;
                            setStop_locations(newLocations);
                          }}
                        />
                        <Button
                          variant="outlined"
                          sx={{ mr: 1 }}
                          onClick={() => {
                            const newLocations = [...stop_locations];
                            newLocations.splice(index, 1);
                            setStop_locations(newLocations);
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <TextField
                      id="start_date"
                      label="Start Date"
                      required
                      value={startDate}
                      onChange={(event) => {
                        setStartDate(event.target.value);
                      }}
                    />
                    <TextField
                      id="end_date"
                      label="End Date"
                      required
                      value={endDate}
                      onChange={(event) => {
                        setEndDate(event.target.value);
                      }}
                    />
                    <div>
                      <Checkbox checked={status === 'complete'} onClick={handleCheckboxClick} />
                      Trip Completed?
                    </div>
                    <div>{error && <small className="text-danger">{error}</small>}</div>
                    <Grid container item xs={12} justifyContent="center">
                      <Stack
                        alignItems="center"
                        sx={{ width: 0.75 }}
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2, md: 4 }}
                      >
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          startIcon={<Iconify icon="eva:checkmark-fill" />}
                        >
                          Submit Edit
                        </Button>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<Iconify icon="eva:close-fill" />}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Grid>
                  </Stack>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
}
