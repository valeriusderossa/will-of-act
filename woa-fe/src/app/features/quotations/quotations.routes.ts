import { Routes } from '@angular/router';

export const QUOTATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/quotation-list/quotation-list.component')
      .then(c => c.QuotationListComponent)
  }
];
