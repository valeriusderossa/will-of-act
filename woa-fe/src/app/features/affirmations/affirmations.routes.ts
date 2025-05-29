import { Routes } from '@angular/router';

export const AFFIRMATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/affirmation-list/affirmation-list.component')
      .then(c => c.AffirmationListComponent)
  }
];
