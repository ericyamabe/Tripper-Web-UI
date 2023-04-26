import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import axios from '../../auth/api/axios';
import { TRIP_UPDATE_URL } from '../../auth/api/urls';
import GetCookie from '../../auth/api/GetCookie';

function InitializeTextfield({ value, onChange, onRemove }) {
  return (
    <Stack alignItems="center" sx={{ m: 1 }} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
      <TextField
        sx={{ m: 1 }}
        name="stop"
        label="Choose stop..."
        id="stop"
        type="text"
        fullWidth
        value={value}
        onChange={onChange}
      />
      <Stack alignItems="center" direction={{ xs: 'row', sm: 'row' }}>
        <Button variant="outlined" startIcon={<Iconify icon="eva:minus-fill" />} onClick={onRemove}>
          Remove
        </Button>
      </Stack>
    </Stack>
  );
}

export default function TripDashboardControls({
  uuid,
  setToggleRefresh,
  waypoints,
  setWaypts,
  origin,
  setOrigin,
  destination,
  setDestination,
  name,
  setName,
  startDate,
  endDate,
  fields,
  setFields,
  handleAddField,
}) {
  // const [fields, setFields] = useState([]);
  const [tempOrigin, setTempOrigin] = useState('');
  const [tempDestination, setTempDestination] = useState('');
  const [error, setError] = useState('');

  // used to get CSRFToken from current cookie for API calls to verify user.
  const csrfFromCookie = GetCookie('csrftoken');

  const navigate = useNavigate();

  useEffect(() => {
    if (waypoints.length > 0) {
      const initialFields = waypoints.map((waypoint) => waypoint.location);
      setFields(initialFields);
    }

    setTempOrigin(origin);
    setTempDestination(destination);
  }, [origin, destination, waypoints]);

  // const handleAddField = () => {
  //   if (fields.length < 10) {
  //     setFields([...fields, '']);
  //   }
  // };

  const handleUpdate = (index, newValue) => {
    const newFields = [...fields];
    newFields[index] = newValue;
    setFields(newFields);
  };

  const handleOriginChange = (e) => {
    setTempOrigin(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setTempDestination(e.target.value);
  };

  const handleRemove = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredFields = fields.filter((field) => field !== '');
    const formattedFields = filteredFields.map((field) => ({ location: field }));
    if (tempOrigin !== '') setOrigin(tempOrigin);
    if (tempDestination !== '') setDestination(tempDestination);
    setWaypts(formattedFields);
    setFields([]);

    const formData = new FormData();

    formData.append('uuid', uuid);
    formData.append('name', name);
    formData.append('start', tempOrigin !== '' ? tempOrigin : origin);
    formData.append('destination', tempDestination !== '' ? tempDestination : destination);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('stop_locations', JSON.stringify(formattedFields));
    formData.append('stop_criteria', '{}');
    formData.append('notes', 'planned');
    formData.append('deleted', 'False');

    try {
      const response = await axios.post(TRIP_UPDATE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-CSRFToken': csrfFromCookie },
        withCredentials: true,
      });
      console.log(JSON.stringify(response?.data));
      setToggleRefresh((prev) => !prev);
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

  const handleRemoveWaypoints = () => {
    setWaypts([]);
    setFields([]);
    setToggleRefresh((prev) => !prev);
  };

  const handleClearMap = () => {
    setOrigin('');
    setDestination('');
    setName('');
    setWaypts([]);
    setFields([]);
    setToggleRefresh((prev) => !prev);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack alignItems="center" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
          {waypoints.length > 0 ? (
            <LoadingButton
              sx={{ my: 1, p: 1 }}
              fullWidth
              size="large"
              variant="contained"
              startIcon={<Iconify icon="eva:minus-fill" />}
              onClick={handleRemoveWaypoints}
            >
              Remove all stops
            </LoadingButton>
          ) : (
            <LoadingButton
              sx={{ my: 1, p: 1 }}
              fullWidth
              size="large"
              variant="contained"
              disabled
              startIcon={<Iconify icon="eva:minus-fill" />}
              onClick={handleRemoveWaypoints}
            >
              Remove all stops
            </LoadingButton>
          )}
          <LoadingButton
            sx={{ my: 1, p: 1 }}
            fullWidth
            size="large"
            variant="contained"
            startIcon={<Iconify icon="eva:close-fill" />}
            onClick={handleClearMap}
          >
            Clear map
          </LoadingButton>
        </Stack>
        <Stack alignItems="center" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
          <TextField
            sx={{ my: 1 }}
            name="origin"
            label="Choose origin..."
            id="origin"
            type="text"
            fullWidth
            value={tempOrigin}
            onChange={handleOriginChange}
          />
          <TextField
            sx={{ my: 1 }}
            name="destination"
            label="Choose destination..."
            id="destination"
            type="text"
            fullWidth
            value={tempDestination}
            onChange={handleDestinationChange}
          />
        </Stack>
        <LoadingButton
          sx={{ my: 1, p: 1 }}
          fullWidth
          size="large"
          variant="contained"
          type="button"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleAddField('')}
        >
          {fields.length === 0 && 'Add a Stop'}
          {fields.length > 0 && fields.length !== 10 && <div>Add a Stop: ({fields.length} of 10)</div>}
          {fields.length === 10 && <div>Max stops added!</div>}
        </LoadingButton>
        {fields.map((value, index) => (
          <InitializeTextfield
            key={index}
            value={value}
            onChange={(e) => handleUpdate(index, e.target.value)}
            onRemove={() => handleRemove(index)}
          />
        ))}

        <>
          <div>{error && <small className="text-danger">{error}</small>}</div>
          <LoadingButton
            sx={{ mt: 1, p: 1 }}
            fullWidth
            size="large"
            variant="contained"
            type="submit"
            startIcon={<Iconify icon="eva:checkmark-fill" />}
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>
        </>
      </form>
    </>
  );
}
