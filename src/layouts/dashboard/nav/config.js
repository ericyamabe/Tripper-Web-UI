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
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },

  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },

  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: icon('ic_lock'),
  // },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
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
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },

  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },

  {
    title: 'My Trips',
    path: '/login',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: icon('ic_lock'),
  // },
];
