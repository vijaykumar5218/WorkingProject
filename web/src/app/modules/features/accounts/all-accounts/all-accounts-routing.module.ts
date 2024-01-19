import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllAccountsPage} from './all-accounts.page';

const routes: Routes = [
  {
    path: '',
    component: AllAccountsPage,
    children: [
      {
        path: 'summary',
        loadChildren: () =>
          import('./summary/summary.module').then(m => m.SummaryPageModule),
      },
      {
        path: 'insights',
        loadChildren: () =>
          import('./insights/insights.module').then(m => m.InsightPageModule),
      },
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full',
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import(
            '@shared-lib/modules/accounts/all-account/account-transaction/account-transaction.module'
          ).then(m => m.AccountTransactionPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllAccountsPageRoutingModule {}
