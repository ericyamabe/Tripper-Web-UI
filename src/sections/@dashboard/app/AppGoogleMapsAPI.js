import { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// Google Maps API
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  StandaloneSearchBox,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import './map.css';

// ----------------------------------------------------------------------

AppGoogleMapsAPI.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

const lib = ['places', 'routes'];
const options = {};

function Map({origin, destination, waypoints}) {
  const center = useMemo(() => ({ lat: 34.2407, lng: -118.53 }), []);
  const [searchBox, setSearchBox] = useState(null);
  const [response, setResponse] = useState(null);

  // search box
  const onPlacesChanged = () => console.log(searchBox.getPlaces());
  // search box
  const onSBLoad = (ref) => {
    setSearchBox(ref);
  };

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
        <StandaloneSearchBox onPlacesChanged={onPlacesChanged} onLoad={onSBLoad}>
          <input
            type="text"
            placeholder="Search with Autocomplete"
            style={{
              boxSizing: 'border-box',
              border: `1px solid transparent`,
              width: `270px`,
              height: `40px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              margin: 'center',
              textOverflow: `ellipses`,
              position: 'absolute',
              top: '0px',
              marginLeft: '40%',
            }}
          />
        </StandaloneSearchBox>
        {response !== null && (
          <DirectionsRenderer
            options={{
              directions: response,
            }}
          />
        )}

        <DirectionsService options={directionsServiceOptions} callback={(e) => directionsCallback(e)} />
      </>

      {/* <MarkerF title={'CSUN'} name={'CSUN'} key={1} position={center} /> */}
    </GoogleMap>
  );
}

function MapComponent({origin, destination, waypoints}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: lib,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <Map origin={origin} destination={destination} waypoints={waypoints} />;
}

export default function AppGoogleMapsAPI({ title, subheader, origin, destination, waypoints }) {
  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ mx: 3, my: 3 }} dir="ltr">
        <MapComponent origin={origin} destination={destination} waypoints={waypoints} />
      </Box>
    </Card>
  );
}
