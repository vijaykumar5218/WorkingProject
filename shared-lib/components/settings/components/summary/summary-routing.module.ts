import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SummaryPage} from './summary.page';

const routes: Routes = [
  {
    path: '',
    component: SummaryPage,
  },
  {
    path: 'add-benefits',
    loadChildren: () =>
      import('./components/add-benefits/add-benefits.module').then(
        m => m.AddBenefitsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryPageRoutingModule {}
