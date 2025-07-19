import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Anomalies',
    url: '/anomalies',
    iconComponent: { name: 'cil-warning' }
  },
  {
    name: 'Articles',
    url: '/articles',
    iconComponent: { name: 'cil-notes' }
  }
];