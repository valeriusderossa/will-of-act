import { Routes } from '@angular/router';

export const SENTENCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/sentence-list/sentence-list.component')
      .then(c => c.SentenceListComponent)
  }
];
