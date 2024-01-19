import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ManageAccountsPage} from './manage-accounts.page';

const routes: Routes = [
  {
    path: '',
    component: ManageAccountsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAccountsPageRoutingModule {}
