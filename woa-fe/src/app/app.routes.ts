import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/quotations',
    pathMatch: 'full'
  },
  {
    path: 'affirmations',
    loadChildren: () => import('./features/affirmations/affirmations.routes')
      .then(r => r.AFFIRMATION_ROUTES)
  },
  {
    path: 'sentences',
    loadChildren: () => import('./features/sentences/sentences.routes')
      .then(r => r.SENTENCE_ROUTES)
  },
  {
    path: 'quotations',
    loadChildren: () => import('./features/quotations/quotations.routes')
      .then(r => r.QUOTATION_ROUTES)
  },
  {
    path: 'thinks',
    loadChildren: () => import('./features/thinks/thinks.routes')
      .then(r => r.THINKS_ROUTES)
  }
];
