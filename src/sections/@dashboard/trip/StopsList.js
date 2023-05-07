import React, { useEffect, useState } from 'react';
import { Button, Card, CardHeader, List, ListItem, ListItemText, Typography } from '@mui/material';
import {valueOf} from "lodash/seq";

async function fetchStops(origin, destination, waypoints, mileageText, setIsLoaded) {
  let url = `http://localhost:8080/api/v1/trips/find_stops/?origin=${origin}&destination=${destination}`;
  if (waypoints && waypoints.length > 0) {
    url += `&waypoints=${JSON.stringify(waypoints)}`;
  }
  url += `&mileage=${mileageText}`;
  // console.log(url);
  const response = await fetch(url);
  const data = await response.json();
  setIsLoaded(true);

  return data;
}

export default function StopsList({ origin, destination, waypoints, mileageText, handleAddField, isLoaded, setIsLoaded }) {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    async function getStops() {
      // console.log(waypoints); // log the waypoints array
      const data = await fetchStops(origin, destination, waypoints, mileageText, setIsLoaded);
      setStops(data);
      console.log(stops);
    }
    getStops();
  }, [origin, destination, waypoints]);

  return (
    <Card style={{ backgroundColor: '#f5f5f5', color: '#333', height: '400px', overflowY: 'scroll' }}>
      <CardHeader
        title="Recommended Stops"
        titleTypographyProps={{ variant: 'h4' }}
        sx={{ textAlign: 'center', my: 1 }}
      />
      {!isLoaded ? (
        <Typography sx={{ ml: 2, mt: 2 }} fontWeight="bold">Loading...</Typography>
      ) : (
        <>
          {stops.length > 0 ? (
            <List>
              {stops.map((stop, index) => (
                <ListItem key={index}>
                  <ListItemText
                      primary={
                        <div dangerouslySetInnerHTML={{ __html: `${stop.type === 'waypoint' ? '<strong>Existing Stop:</strong>' : `<strong>${stop.type.charAt(0).toUpperCase()}${stop.type.slice(1)}:</strong>`} ${stop.name}` }} />
                      }
                      secondary={stop.address}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleAddField(`${stop.address}`)}
                  >
                    Add
                  </Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ ml: 2, mt: 2 }} fontWeight="bold">No results found...</Typography>
          )}
        </>
      )}
    </Card>
  );
}
