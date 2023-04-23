import React, { useEffect, useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';

function InitializeTextfield({ value, onChange, onRemove, index }) {
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

export default function StopList({ setToggleRefresh, waypoints, setWaypts, setOrigin, setDestination, setName }) {
  const [localFields, setLocalFields] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (waypoints.length > 0) {
      const initialFields = waypoints.map((waypoint) => waypoint.location);
      setLocalFields(initialFields);
      setFields(initialFields);
    }
  }, [waypoints]);

  const handleAddField = () => {
    if (localFields.length < 10) {
      setLocalFields([...localFields, '']);
    }
  };

  const handleUpdate = (index, newValue) => {
    const newFields = [...localFields];
    newFields[index] = newValue;
    setLocalFields(newFields);
  };

  const handleRemove = (index) => {
    const newFields = [...localFields];
    newFields.splice(index, 1);
    setLocalFields(newFields);

    const newWaypoints = [...waypoints];
    newWaypoints.splice(index, 1);
    setWaypts(newWaypoints);

    setToggleRefresh((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredFields = localFields.filter((field) => field !== '');
    const formattedFields = filteredFields.map((field) => ({ location: field }));
    setWaypts(formattedFields);
    setFields(localFields);
    setLocalFields([]);
    setToggleRefresh((prev) => !prev);
  };

  const handleRemoveWaypoints = () => {
    setWaypts([]);
    setFields([]);
    setLocalFields([]);
    setToggleRefresh((prev) => !prev);
  };

  const handleClearMap = () => {
    setOrigin('');
    setDestination('');
    setName('');
    setWaypts([]);
    setFields([]);
    setLocalFields([]);
    setToggleRefresh((prev) => !prev);
  };

  return (
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
      <LoadingButton
        sx={{ my: 1, p: 1 }}
        fullWidth
        size="large"
        variant="contained"
        type="button"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={handleAddField}
      >
        {localFields.length === 0 && 'Add a Stop'}
        {localFields.length > 0 && localFields.length !== 10 && <div>Add a Stop: ({localFields.length} of 10)</div>}
        {localFields.length === 10 && <div>Max stops added!</div>}
      </LoadingButton>
      {localFields.map((value, index) => (
        <InitializeTextfield
          key={index}
          value={value}
          onChange={(e) => handleUpdate(index, e.target.value)}
          onRemove={() => handleRemove(index)}
          index={index}
        />
      ))}
      {localFields.length > 0 && (
        <>
          <LoadingButton
            sx={{ m: 1, p: 1 }}
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
      )}
    </form>
  );
}
