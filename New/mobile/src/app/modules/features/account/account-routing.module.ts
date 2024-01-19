import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AccountPage} from './account.page';
import {InsightsComponent} from './insights/insights.component';

const routes: Routes = [
  {
    path: '',
    component: AccountPage,

    children: [
      {
        path: 'summary',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./summary/summary.module').then(m => m.SummaryModule),
          },
        ],
      },
      {
        path: 'insights',
        component: InsightsComponent,
      },

      {
        path: 'account-transaction',
        loadChildren: () =>
          import(
            '@shared-lib/modules/accounts/all-account/account-transaction/account-transaction.module'
          ).then(m => m.AccountTransactionPageModule),
      },

      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full',
  },
  {
    path: 'retirement-account',
    loadChildren: () =>
      import('./retirement-account/retirement-account.module').then(
        m => m.RetirementAccountPageModule
      ),
  },
  {
    path: 'manage-accounts',
    loadChildren: () =>
      import(
        '@shared-lib/modules/accounts/manage-accounts/manage-accounts.module'
      ).then(m => m.ManageAccountsPageModule),
  },
  {
    path: 'add-accounts',
    loadChildren: () =>
      import(
        '@shared-lib/modules/accounts/add-accounts/add-accounts.module'
      ).then(m => m.AddAccountsPageModule),
  },
  {
    path: 'mxdetails-account',
    loadChildren: () =>
      import(
        '@shared-lib/modules/accounts/mxdetails-account/mxdetails-account.module'
      ).then(m => m.MXAccountDetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
