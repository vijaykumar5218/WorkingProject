import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsPage} from './accounts.page';

const routes: Routes = [
  {
    path: '',
    component: AccountsPage,
    children: [
      {
        path: '',
        redirectTo: 'all-account/summary',
        pathMatch: 'full',
      },
      {
        path: 'all-account',
        loadChildren: () =>
          import('./all-accounts/all-accounts.module').then(
            m => m.AllAccountsPageModule
          ),
      },
      {
        path: 'account-details/:planId',
        loadChildren: () =>
          import('./account-details/account-details.module').then(
            m => m.AccountDeatilsPageModule
          ),
      },
      {
        path: 'mxdetails-account/:guid',
        loadChildren: () =>
          import(
            '@shared-lib/modules/accounts/mxdetails-account/mxdetails-account.module'
          ).then(m => m.MXAccountDetailPageModule),
      },
      {
        path: 'budget-widget',
        loadChildren: () =>
          import('@shared-lib/modules/budget-widget/budget-widget.module').then(
            m => m.BudgetWidgetPageModule
          ),
      },
      {
        path: 'spending-widget',
        loadChildren: () =>
          import(
            '@shared-lib/modules/spending-widget/spending-widget.module'
          ).then(m => m.SpendingWidgetPageModule),
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsPageRoutingModule {}
