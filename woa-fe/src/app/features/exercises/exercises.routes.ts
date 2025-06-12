import { Routes } from '@angular/router';

export const EXERCISE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'gym',
    pathMatch: 'full'
  },
  {
    path: 'gym',
    loadComponent: () => import('./components/gym-list/gym-list.component')
      .then(c => c.GymListComponent)
  },
  {
    path: 'running',
    loadComponent: () => import('./components/running-list/running-list.component')
      .then(c => c.RunningListComponent)
  }
];
