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
        <title> Coming Soon... | Tripper </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Tripper is Coming Soon...
          </Typography>

          {/* <Typography sx={{ color: 'text.secondary' }}> */}
          {/*   Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your */}
          {/*   spelling. */}
          {/* </Typography> */}

          <Box
            component="img"
            src="/assets/illustrations/Arrow.svg"
            sx={{ height: 260, mx: 'auto', mt: { xs: 5, sm: 5 }, mb: { xs: 5, sm: 10 } }}
          />

          <Stack direction="row" spacing={2}>
            <Button to="/" size="large" variant="contained" sx={{ px: 3 }} component={RouterLink}>
              Go to Home
            </Button>

            <Button to="/login" size="large" variant="contained" sx={{ px: 5 }} component={RouterLink}>
              Login
            </Button>
          </Stack>
        </StyledContent>
      </Container>
    </>
  );
}
