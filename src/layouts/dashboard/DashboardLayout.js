import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import axios from 'axios';
import Header from './header';
import Nav from './nav';
import { VIEW_PROFILE_URL, WHOAMI_URL } from '../../sections/auth/api/urls';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [waypts, setWaypts] = useState([]);
  const [uuid, setUuid] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState('Guest');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [toggleRefresh, setToggleRefresh] = useState(false);

  useEffect(() => {
    axios
      .all([
        axios.get(WHOAMI_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }),
        axios.get(VIEW_PROFILE_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }),
      ])
      .then(
        axios.spread((whoamiResponse, profileResponse) => {
          const whoamiData = whoamiResponse.data;
          const profileData = profileResponse.data;

          if (whoamiData.username) setUser(whoamiData.username);
          if (whoamiData.email) setEmail(whoamiData.email);
          if (whoamiData.role === true) setRole('Admin');
          else if (whoamiData.role === false) setRole('User');
          else if (!whoamiData.role) setRole('');

          setIsLoaded(true);
        })
      )
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, []);

  return (
    <StyledRoot>
      <Header isLoaded={isLoaded} user={user} email={email} onOpenNav={() => setOpen(true)} />

      <Nav isLoaded={isLoaded} user={user} role={role} openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        <Outlet
          context={[
            origin,
            setOrigin,
            destination,
            setDestination,
            waypts,
            setWaypts,
            uuid,
            setUuid,
            name,
            setName,
            startDate,
            setStartDate,
            endDate,
            setEndDate,
            isLoaded,
            setIsLoaded,
            user,
            setUser,
            toggleRefresh,
            setToggleRefresh,
            status,
            setStatus,
          ]}
        />
      </Main>
    </StyledRoot>
  );
}
