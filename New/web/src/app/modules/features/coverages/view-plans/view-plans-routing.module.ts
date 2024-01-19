import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewPlansPage} from './view-plans.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPlansPage,
    children: [
      {
        path: 'details',
        loadChildren: () =>
          import(
            '@shared-lib/components/coverages/plan-tabs/plan-details/plan-details.module'
          ).then(m => m.PlanDetailsModule),
      },
      {
        path: 'claim',
        loadChildren: () =>
          import(
            '@shared-lib/components/coverages/plan-tabs/plan-transactions/plan-transactions.module'
          ).then(m => m.PlanTransactionsModule),
      },
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPlansPageRoutingModule {}
