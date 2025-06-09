import { Routes } from '@angular/router';

export const THINKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/think-list/think-list.component').then(m => m.ThinkListComponent)
  }
];
