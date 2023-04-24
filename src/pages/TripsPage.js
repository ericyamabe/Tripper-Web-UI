import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { TripListHead, TripListToolbar } from '../sections/@dashboard/trip';
import { TRIP_DASHBOARD_URL } from '../sections/auth/api/urls';
/* eslint-disable camelcase */

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'start', label: 'Start', alignRight: false },
  { id: 'destination', label: 'Destination', alignRight: false },
  { id: 'start_date', label: 'Start Date', alignRight: false },
  { id: 'end_date', label: 'End Date', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  // if values are equal, return the opposite of ascending order result
  return orderBy === 'status' ? -descendingComparator(a, b, 'name') : 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : orderBy === 'status'
          ? (a, b) => descendingComparator(a, b, 'notes')
          : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TripsPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [trips, setTrips] = useState([]);
  const [tempUuid, setTempUuid] = useState('');
  const [tempName, setTempName] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [tempOrigin, setTempOrigin] = useState('');
  const [tempDestination, setTempDestination] = useState('');
  const [tempStopLocations, setTempStopLocations] = useState([]);
  const [tempStatus, setTempStatus] = useState('');

  const [
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
  ] = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips().catch((err) => {
      console.log(err);
    });
  }, []);

  async function fetchTrips() {
    try {
      const res = await axios.get(TRIP_DASHBOARD_URL, {
        withCredentials: true,
      });
      setTrips(res.data);
      setIsLoaded(true);
    } catch (err) {
      throw new Error(err);
    }
  }

  const TRIPSLIST = [...Array(trips.length)].map((_, index) => ({
    uuid: trips[index].uuid,
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
    name: trips[index].name,
    start: trips[index].start,
    destination: trips[index].destination,
    start_date: trips[index].start_date,
    end_date: trips[index].end_date,
    stop_locations: trips[index].stop_locations,
    notes: trips[index].notes,
  }));

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleAddTrip = () => {
    navigate('addtrip', { replace: true });
  };

  const handleEditTrip = () => {
    setUuid(tempUuid);
    setName(tempName);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setOrigin(tempOrigin);
    setDestination(tempDestination);
    setWaypts([]);
    if (tempStopLocations.length > 0) {
      setWaypts(tempStopLocations);
    }
    navigate('edittrip', {
      replace: true,
      state: {
        passStatus: tempStatus,
      },
    });
  };

  const handleViewTrip = () => {
    setUuid(tempUuid);
    setName(tempName);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setOrigin(tempOrigin);
    setDestination(tempDestination);
    setWaypts([]);
    if (tempStopLocations.length > 0) {
      setWaypts(tempStopLocations);
    }
    navigate('..', { replace: true });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = TRIPSLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, uuid, name, start, destination, start_date, end_date, stop_locations, notes) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);

    if (selectedIndex === 0) setIsSelected(false);
    else setIsSelected(true);

    setTempUuid(uuid);
    setTempName(name);
    setTempStartDate(start_date);
    setTempEndDate(end_date);
    setTempOrigin(start);
    setTempDestination(destination);
    setTempStopLocations(stop_locations);
    setTempStatus(notes);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - TRIPSLIST.length) : 0;
  const filteredUsers = applySortFilter(TRIPSLIST, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Trips | Tripper </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Trips
          </Typography>
          {!isSelected ? (
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAddTrip}>
              Add Trip
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              color="secondary"
              startIcon={<Iconify icon="ic:baseline-remove-red-eye" />}
              onClick={handleViewTrip}
            >
              View Trip
            </Button>
          )}
        </Stack>

        <Card>
          <TripListToolbar
            numSelected={selected.length}
            filterName={filterName}
            name={tempName}
            onFilterName={handleFilterByName}
            onHandleEditTrip={handleEditTrip}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TripListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={TRIPSLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // eslint-disable-next-line camelcase
                    const { uuid, name, start_date, notes, start, destination, avatarUrl, end_date, stop_locations } =
                      row;
                    const selectedTrip = selected.indexOf(name) !== -1;
                    const disabled = selected.length > 0 && !selectedTrip; // Add this line

                    return (
                      <TableRow hover key={uuid} tabIndex={-1} role="checkbox" selected={selectedTrip}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedTrip}
                            onChange={(event) =>
                              handleClick(event, uuid, name, start, destination, start_date, end_date, stop_locations, notes)
                            }
                            disabled={disabled}
                          />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{start}</TableCell>
                        <TableCell align="left">{destination}</TableCell>
                        {/* eslint-disable-next-line camelcase */}
                        <TableCell align="left" style={{ minWidth: 130 }}>
                          {start_date}
                        </TableCell>
                        {/* eslint-disable-next-line camelcase */}
                        <TableCell align="left" style={{ minWidth: 130 }}>
                          {end_date}
                        </TableCell>

                        <TableCell align="left">
                          <Label color={(notes === 'planned' && 'warning') || 'success'}>{sentenceCase(notes)}</Label>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={TRIPSLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleViewTrip}>
          <Iconify icon={'ic:baseline-remove-red-eye'} sx={{ mr: 2 }} />
          View
        </MenuItem>

        <MenuItem onClick={handleEditTrip}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
