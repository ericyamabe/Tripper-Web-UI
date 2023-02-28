import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, Stack } from '@mui/material';
import Iconify from '../components/iconify';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Landing() {
  return (
    <>
      <Helmet>
        <title> Email Verified </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Your email has been verified
          </Typography>
          <Typography variant="h5" paragraph>
            You can now sign in with your new account
          </Typography>

          {/* <Typography sx={{ color: 'text.secondary' }}> */}
          {/*   Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your */}
          {/*   spelling. */}
          {/* </Typography> */}

          <Box
            component="img"
            src="assets/logo.svg"
            sx={{ height: 260, mx: 'auto', mt: { xs: 5, sm: 5 }, mb: { xs: 5, sm: 10 } }}
          />

          <Stack direction="row" spacing={1}>
            {/* Change this back to "/" when landing page is deprecated */}
            <Button to="/dashboard" size="large" variant="contained" sx={{ px: 3 }} component={RouterLink}>
              Go to Home
            </Button>


          </Stack>
        </StyledContent>
      </Container>
    </>
  );
}
