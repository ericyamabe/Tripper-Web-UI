import { Helmet } from 'react-helmet-async';
// import { faker } from '@faker-js/faker';
// // @mui
// import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// // components
// import Iconify from '../components/iconify';
// sections
import { AppGoogleMapsAPI } from '../sections/@dashboard/app';
import AppNewGoogleMapsAPI from "../sections/@dashboard/app/AppNewGoogleMapsAPI";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  // const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Tripper </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome Back to Tripper
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <AppGoogleMapsAPI title="Tripper Map" subheader="Plan your next trip!" />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
