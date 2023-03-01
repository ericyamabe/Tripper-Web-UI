import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import Iconify from '../components/iconify';
import axios from '../sections/auth/api/axios';
import { TRIP_UPDATE_URL } from '../sections/auth/api/urls';
import GetCookie from '../sections/auth/api/GetCookie';
/* eslint-disable camelcase */

export default function EditTripPage() {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [stop_locations, setStop_locations] = useState('');
  const [stop_criteria, setStop_criteria] = useState('');
  const [start_date, setStart_date] = useState('');
  const [end_date, setEnd_date] = useState('');
  const [notes, setNotes] = useState('');
  const [emergency_contacts, setEmergency_contacts] = useState('');
  const [packing_list, setPacking_list] = useState('');
  const [misc, setMisc] = useState('');
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
    // formData.append('stop_locations', stop_locations);
    // formData.append('stop_criteria', stop_criteria);
    // formData.append('notes', notes);
    // formData.append('emergency_contacts', emergency_contacts);
    // formData.append('packing_list', packing_list);
    // formData.append('misc', misc);

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
                    {/* <TextField */}
                    {/*   id="stop_locations" */}
                    {/*   label="Stop Locations" */}
                    {/*   disabled */}
                    {/*   value={stop_locations} */}
                    {/*   onChange={(event) => { */}
                    {/*     setStop_locations(event.target.value); */}
                    {/*   }} */}
                    {/* /> */}
                    {/* <TextField */}
                    {/*   id="stop_criteria" */}
                    {/*   label="Stop Criteria" */}
                    {/*   disabled */}
                    {/*   value={stop_criteria} */}
                    {/*   onChange={(event) => { */}
                    {/*     setStop_criteria(event.target.value); */}
                    {/*   }} */}
                    {/* /> */}
                    {/* <TextField */}
                    {/*   id="notes" */}
                    {/*   label="Notes" */}
                    {/*   disabled */}
                    {/*   value={notes} */}
                    {/*   onChange={(event) => { */}
                    {/*     setNotes(event.target.value); */}
                    {/*   }} */}
                    {/* /> */}
                    {/* <TextField */}
                    {/*   id="emergency_contacts" */}
                    {/*   label="Emergency Contacts" */}
                    {/*   disabled */}
                    {/*   value={emergency_contacts} */}
                    {/*   onChange={(event) => { */}
                    {/*     setEmergency_contacts(event.target.value); */}
                    {/*   }} */}
                    {/* /> */}
                    {/* <TextField */}
                    {/*   id="packing_list" */}
                    {/*   label="Packing List" */}
                    {/*   disabled */}
                    {/*   value={packing_list} */}
                    {/*   onChange={(event) => { */}
                    {/*     setPacking_list(event.target.value); */}
                    {/*   }} */}
                    {/* /> */}
                    {/* <TextField */}
                    {/*   id="misc" */}
                    {/*   label="Miscellaneous" */}
                    {/*   disabled */}
                    {/*   value={misc} */}
                    {/*   onChange={(event) => { */}
                    {/*     setMisc(event.target.value); */}
                    {/*   }} */}
                    {/* /> */}
                    <div>{error && <small className="text-danger">{error}</small>}</div>
                    <Button variant="contained" type="submit" startIcon={<Iconify icon="eva:plus-fill" />}>
                      Add Trip
                    </Button>
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
