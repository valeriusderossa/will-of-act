import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/affirmations',
    pathMatch: 'full'
  },
  {
    path: 'affirmations',
    loadChildren: () => import('./features/affirmations/affiramtions.routes')
      .then(r => r.AFFIRMATION_ROUTES)
  }
];
