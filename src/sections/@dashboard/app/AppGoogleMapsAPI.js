import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// Google Maps API
import { GoogleMap, useLoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import './map.css';

// ----------------------------------------------------------------------

AppGoogleMapsAPI.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

const lib = ['places', 'routes'];

function Map({ origin, destination, waypoints }) {
  const center = useMemo(() => ({ lat: 34.2407, lng: -118.53 }), []);
  const [response, setResponse] = useState(null);

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

export default function AppGoogleMapsAPI({ title, subheader, origin, destination, waypoints, toggleRefresh }) {
  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ mx: 3, my: 3 }} dir="ltr">
        <MapComponent origin={origin} destination={destination} waypoints={waypoints} toggleRefresh={toggleRefresh} />
      </Box>
    </Card>
  );
}
