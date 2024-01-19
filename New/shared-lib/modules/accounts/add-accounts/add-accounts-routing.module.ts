import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AddAccountsPage} from './add-accounts.page';

const routes: Routes = [
  {
    path: '',
    component: AddAccountsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAccountsPageRoutingModule {}
