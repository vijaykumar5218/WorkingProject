import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {FinancialSummaryPage} from './financial-summary.page';

const routes: Routes = [
  {
    path: '',
    component: FinancialSummaryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialSummaryPageRoutingModule {}
