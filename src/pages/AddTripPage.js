import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import Iconify from '../components/iconify';
import axios from '../sections/auth/api/axios';
import { TRIP_CREATE_URL } from '../sections/auth/api/urls';
import GetCookie from '../sections/auth/api/GetCookie';
/* eslint-disable camelcase */

export default function AddTripPage() {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [stop_locations, setStop_locations] = useState([]);
  const [start_date, setStart_date] = useState(new Date().toISOString().substr(0, 10));
  const [end_date, setEnd_date] = useState(new Date().toISOString().substr(0, 10));
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // used to get CSRFToken from current cookie for API calls to verify user.
  const csrfFromCookie = GetCookie('csrftoken');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', name);
    formData.append('start', start);
    formData.append('destination', destination);
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);
    console.log(stop_locations)
    // const stopLocationsArray = stop_locations.map((location) => ({ location }));
    // formData.append('stop_locations', JSON.stringify(stopLocationsArray));
    const stopLocationsString = stop_locations.map(location => `{"location":"${location}"}`).join(',');
    formData.append('stop_locations', stopLocationsString);

    formData.append('stop_criteria', '{}');

    console.log('Form Data:');
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await axios.post(TRIP_CREATE_URL, formData, {
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
      }
    }
  };

  return (
    <>
      <Helmet>
        <title> Add Trip | Tripper </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add New Trip
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
                      value={start}
                      onChange={(event) => {
                        setStart(event.target.value);
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
                            console.log(stop_locations);
                          }}
                        />
                        <Button
                          variant="outlined"
                          sx={{mr: 1}}
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
                    {/* <AddPageStopList tempStop_locations={tempStop_locations} setTempStop_locations={setTempStop_locations} /> */}
                    <TextField
                      id="start_date"
                      label="Start Date"
                      required
                      value={start_date}
                      onChange={(event) => {
                        setStart_date(event.target.value);
                      }}
                    />
                    <TextField
                      id="end_date"
                      label="End Date"
                      required
                      value={end_date}
                      onChange={(event) => {
                        setEnd_date(event.target.value);
                      }}
                    />
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
                          size="large"
                          type="submit"
                          fullWidth
                          startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                          Add Trip
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                          startIcon={<Iconify icon="eva:close-fill" />}
                          onClick={() => navigate('/dashboard/trips', { replace: true })}
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
