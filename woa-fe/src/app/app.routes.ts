import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/affirmations',
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
  }
];
