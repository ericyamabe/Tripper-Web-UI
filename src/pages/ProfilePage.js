import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Button, Card, Container, Grid, Stack, TextField } from '@mui/material';

export default function ProfilePage() {
  const [data, setData] = useState('');
  const [showFields, setShowFields] = useState(false); // Add state variables

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/accounts/profile/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEditProfileClick = () => {
    if (showFields === false) setShowFields(true); // show fields when the button is clicked
    else setShowFields(false);
  };

  const handleSubmit = () => {
    // do stuff
    setShowFields(false);
  };

  return (
    <>
      <Helmet>
        <title> Profile | Tripper </title>
      </Helmet>

      <Container>
        <Card>
          {data ? (
            <>
              {/* Show if showFields state variable is true */}
              {showFields ? (
                <>
                  <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={6} lg={6}>
                      <Box py={3}>
                        <Stack spacing={2}>
                          <TextField label="Username" id="username" defaultValue={data.username} />
                          <TextField label="First Name" id="first_name" defaultValue={data.first_name} />
                          <TextField label="Last Name" id="last_name" defaultValue={data.last_name} />
                          <TextField label="Email Address" id="email" defaultValue={data.email} />
                          <Button variant="contained" onClick={handleSubmit}>
                            Submit Changes
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  {/* Show if showFields state variable is false */}
                  <Grid container spacing={2} alignItems="center" justifyContent="left">
                    <Grid item xs={12} sm={6} lg={6}>
                      <Box sx={{ p: 5 }}>
                        <Stack spacing={2}>
                          <div>Username: {data.username}</div>
                          <div>First Name: {data.first_name}</div>
                          <div>Last Name: {data.last_name}</div>
                          <div>Email: {data.email}</div>

                          <Button variant="contained" onClick={handleEditProfileClick}>
                            Edit Profile?
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          ) : (
            <div>Loading profile data...</div>
          )}
        </Card>
      </Container>
    </>
  );
}
