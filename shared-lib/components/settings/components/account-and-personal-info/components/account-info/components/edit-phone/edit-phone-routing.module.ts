import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {EditPhonePage} from './edit-phone.page';

const routes: Routes = [
  {
    path: '',
    component: EditPhonePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPhonePageRoutingModule {}
