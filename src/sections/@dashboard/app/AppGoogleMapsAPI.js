import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, CardHeader, Stack, TextField } from '@mui/material';
// Google Maps API
import {
  GoogleMap,
  useLoadScript,
  StandaloneSearchBox,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import './map.css';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

AppGoogleMapsAPI.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

const lib = ['places', 'routes'];
const options = {};

function Map({ origin, destination, waypoints }) {
  const center = useMemo(() => ({ lat: 34.2407, lng: -118.53 }), []);
  // const [searchBox, setSearchBox] = useState(null);
  const [response, setResponse] = useState(null);

  // // search box
  // const onPlacesChanged = () => console.log(searchBox.getPlaces());
  // // search box
  // const onSBLoad = (ref) => {
  //   setSearchBox(ref);
  // };

  const count = useRef(0);

  // directions
  const directionsCallback = (response) => {
    console.log(response);

    if (response !== null && count.current < 2) {
      if (response.status === 'OK') {
        count.current += 1;
        setResponse(response);
      } else {
        count.current = 0;
        console.log('response: ', response);
      }
    }
  };

  const directionsServiceOptions = {
    origin,
    destination,
    waypoints,
    travelMode: 'DRIVING', // default, can change to other modes
  };

  return (
    <GoogleMap zoom={17} center={center} mapContainerStyle={{ width: '100%', height: '60vh' }}>
      <>
        {/* <StandaloneSearchBox onPlacesChanged={onPlacesChanged} onLoad={onSBLoad}> */}
        {/*   <input */}
        {/*     type="text" */}
        {/*     placeholder="Search with Autocomplete" */}
        {/*     style={{ */}
        {/*       boxSizing: 'border-box', */}
        {/*       border: `1px solid transparent`, */}
        {/*       width: `270px`, */}
        {/*       height: `40px`, */}
        {/*       padding: `0 12px`, */}
        {/*       borderRadius: `3px`, */}
        {/*       boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`, */}
        {/*       fontSize: `14px`, */}
        {/*       outline: `none`, */}
        {/*       margin: 'center', */}
        {/*       textOverflow: `ellipses`, */}
        {/*       position: 'absolute', */}
        {/*       top: '0px', */}
        {/*       marginLeft: '40%', */}
        {/*     }} */}
        {/*   /> */}
        {/* </StandaloneSearchBox> */}
        {response !== null && (
          <DirectionsRenderer
            options={{
              directions: response,
            }}
          />
        )}

        <DirectionsService options={directionsServiceOptions} callback={(e) => directionsCallback(e)} />
      </>
    </GoogleMap>
  );
}

function MapComponent({ origin, destination, waypoints, toggleRefresh }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: lib,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <Map origin={origin} destination={destination} waypoints={waypoints} key={toggleRefresh} />;
}

export default function AppGoogleMapsAPI({
  title,
  subheader,
  origin,
  setOrigin,
  destination,
  setDestination,
  waypoints,
  setWaypts,
  setName,
}) {
  const [input, setInput] = useState('');
  const [toggleRefresh, setToggleRefresh] = useState(false);

  const handleAddWaypoint = () => {
    setWaypts((prevWaypts) => [
      ...prevWaypts,
      {
        location: input.valueOf(),
      },
    ]);
    setToggleRefresh((prev) => !prev);
  };

  const handleRemoveWaypoints = () => {
    setWaypts([]);
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
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ mx: 3, my: 3 }} dir="ltr">
        <MapComponent origin={origin} destination={destination} waypoints={waypoints} toggleRefresh={toggleRefresh} />
        {origin === '' ? (
          ''
        ) : (
          <>
            {/* <Grid container spacing={3} sx={{ m: 3 }}> */}
            {/*   <Grid item xs={12} md={12} lg={12}> */}
            <Card sx={{ m: 3, p: 3 }}>
              Add waypoint?
              <Stack spacing={3}>
                <TextField
                  sx={{ m: 2 }}
                  name="waypoint"
                  label="Set Waypoint..."
                  id="waypoint"
                  defaultValue={input}
                  onBlur={(e) => setInput(e.target.value)}
                />
              </Stack>
              <Stack alignItems="center" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                <LoadingButton
                  sx={{ m: 1, p: 1 }}
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleAddWaypoint}
                >
                  Add waypoint
                </LoadingButton>
                <LoadingButton
                  sx={{ m: 1, p: 1 }}
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleRemoveWaypoints}
                >
                  Remove all waypoints
                </LoadingButton>
                <LoadingButton sx={{ m: 1, p: 1 }} fullWidth size="large" variant="contained" onClick={handleClearMap}>
                  Clear map
                </LoadingButton>
              </Stack>
            </Card>
            {/*   </Grid> */}
            {/* </Grid> */}
          </>
        )}
      </Box>
    </Card>
  );
}
