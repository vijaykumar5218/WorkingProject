import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AddUpdateEmailPage} from './add-update-email.page';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateEmailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUpdateEmailPageRoutingModule {}
