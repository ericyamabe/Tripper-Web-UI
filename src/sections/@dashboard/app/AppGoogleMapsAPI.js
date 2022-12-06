import PropTypes from 'prop-types';
// import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// Google Maps API
import {
    GoogleMap,
    MarkerF,
    useLoadScript,
} from "@react-google-maps/api";
// useMemo
import { useMemo } from "react";
import "./map.css";

// ----------------------------------------------------------------------

AppGoogleMapsAPI.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
};

function Map() {
    const center = useMemo(() => ({ lat: 34.2407, lng: -118.5300 }), []);

    return (
        <GoogleMap zoom={17} center={center} mapContainerStyle={{width: "100%", height: "60vh" }}>
            <MarkerF
                title={"CSUN"}
                name={"CSUN"}
                key={1}
                position={center}
            />
        </GoogleMap>
    );
}

function MapComponent() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    if (!isLoaded) return <div>Loading...</div>;

    return <Map />;
}

export default function AppGoogleMapsAPI({ title, subheader }) {
    return (
        <Card>
            <CardHeader title={title} subheader={subheader} />
            <Box sx={{ mx: 3, my: 3 }} dir="ltr">
                <MapComponent />
            </Box>
        </Card>
    );
}
