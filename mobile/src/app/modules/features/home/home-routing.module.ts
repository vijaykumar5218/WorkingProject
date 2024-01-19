import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomePage} from './home.page';
import {InsightsComponent} from '@shared-lib/components/coverages/insights/insights.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'insight',
    component: InsightsComponent,
  },
  {
    path: 'financial-summary',
    loadChildren: () =>
      import('./financial-summary/financial-summary.module').then(
        m => m.FinancialSummaryPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
