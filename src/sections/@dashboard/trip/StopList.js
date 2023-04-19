import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

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
      <Button sx={{ p: 1 }} variant="outlined" onClick={onRemove}>
        Remove
      </Button>
    </Stack>
  );
}

export default function StopList({ setToggleRefresh, waypoints, setWaypts, setOrigin, setDestination, setName }) {
  const [fields, setFields] = useState([]);

  const handleAddField = () => {
    if (fields.length < 10) {
      setFields([...fields, '']);
    }
  };

  const handleUpdate = (index, newValue) => {
    const newFields = [...fields];
    newFields[index] = newValue;
    setFields(newFields);
  };

  const handleRemove = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);

    const nonEmptyFields = newFields.filter((field) => field !== '');
    setFields(newFields);

    if (nonEmptyFields.length === 0) {
      setWaypts([]);
    } else {
      const formattedFields = nonEmptyFields.map((field) => ({ location: field }));
      setWaypts(formattedFields);
    }

    setToggleRefresh((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredFields = fields.filter((field) => field !== '');
    const formattedFields = filteredFields.map((field) => ({ location: field }));
    setWaypts(formattedFields);
    setToggleRefresh((prev) => !prev);
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
    setToggleRefresh((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack alignItems="center" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
        <LoadingButton
            sx={{ my: 1, p: 1 }}
            fullWidth
            size="large"
            variant="contained"
            onClick={handleRemoveWaypoints}
        >
          Remove all waypoints
        </LoadingButton>
        <LoadingButton
            sx={{ my: 1, p: 1 }}
            fullWidth
            size="large"
            variant="contained"
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
        onClick={handleAddField}
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
      {fields.length > 0 && (
        <>
          <LoadingButton
            sx={{ m: 1, p: 1 }}
            fullWidth
            size="large"
            variant="contained"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </LoadingButton>
        </>
      )}
    </form>
  );
}
