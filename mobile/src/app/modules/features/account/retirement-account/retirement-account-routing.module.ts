import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {RetirementAccountPage} from './retirement-account.page';

const routes: Routes = [
  {
    path: '',
    component: RetirementAccountPage,

    children: [
      {
        path: 'info',
        children: [
          {
            path: '',
            loadChildren: () =>
              import(
                '@shared-lib/modules/accounts/retirement/info/info.module'
              ).then(m => m.InfoPageModule),
          },
        ],
      },
      {
        path: 'transactions',
        children: [
          {
            path: '',
            loadChildren: () =>
              import(
                '@shared-lib/modules/accounts/retirement/transactions/transactions.module'
              ).then(m => m.TransactionsPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'info',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetirementAccountPageRoutingModule {}
