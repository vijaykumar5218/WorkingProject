import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddCardComponent} from '@shared-lib/components/coverages/plan-tabs/plan-details/add-card/add-card.component';
import {PlanDetailsComponent} from '@shared-lib/components/coverages/plan-tabs/plan-details/plan-details.component';
import {PlanTransactionsComponent} from '@shared-lib/components/coverages/plan-tabs/plan-transactions/plan-transactions.component';
import {PlanTabsPage} from './plan-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: PlanTabsPage,
    children: [
      {
        path: 'details',
        component: PlanDetailsComponent,
      },
      {
        path: 'transactions',
        component: PlanTransactionsComponent,
      },
      {
        path: 'add-card',
        component: AddCardComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'details',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanTabsPageRoutingModule {}
