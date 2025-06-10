import { Routes } from '@angular/router';

export const technicalLearningsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/technical-learning-list/technical-learning-list.component').then(m => m.TechnicalLearningListComponent),
    title: 'My Technical Learnings'
  }
];
