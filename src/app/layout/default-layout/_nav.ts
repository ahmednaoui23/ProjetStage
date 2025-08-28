import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Tableau de bord',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    
  },
  {
    name: 'Utilisateurs',
    url: '/utilisateurs',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Anomalies',
    url: '/anomalies',
    iconComponent: { name: 'cil-notes' }
  },
  {
    name: 'Articles',
    url: '/articles',
    iconComponent: { name: 'cil-notes' }
  }
];