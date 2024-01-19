import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountDeatilsPage} from './account-details.page';

const routes: Routes = [
  {
    path: '',
    component: AccountDeatilsPage,
    children: [
      {
        path: 'info',
        loadChildren: () =>
          import(
            '@shared-lib/modules/accounts/retirement/info/info.module'
          ).then(m => m.InfoPageModule),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import(
            '@shared-lib/modules/accounts/retirement/transactions/transactions.module'
          ).then(m => m.TransactionsPageModule),
      },
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountDeatilsPageRoutingModule {}
