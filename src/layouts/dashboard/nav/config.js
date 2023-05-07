// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

export const navConfig1 = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_user'),
  },
  {
    title: 'register',
    path: '/register',
    icon: icon('ic_lock'),
  },
];

export const navConfig2 = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'My Profile',
    path: '/dashboard/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'My Trips',
    path: '/dashboard/trips',
    icon: icon('ic_lock'),
  },
];

export const navConfig3 = [
  // {
  //   title: 'User Management',
  //   path: '/dashboard/user',
  //   icon: icon('ic_disabled'),
  // },
];

export const navConfig4 = [
];
