import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AccountTransactionPage} from './account-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: AccountTransactionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountTransactionPageRoutingModule {}
