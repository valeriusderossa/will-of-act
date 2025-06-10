import { Routes } from '@angular/router';

export const learningsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/learning-list/learning-list.component').then(m => m.LearningListComponent),
    title: 'My Learnings'
  }
];
