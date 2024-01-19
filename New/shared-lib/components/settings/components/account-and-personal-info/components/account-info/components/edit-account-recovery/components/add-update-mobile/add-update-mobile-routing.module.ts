import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AddUpdateMobilePage} from './add-update-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateMobilePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUpdateMobilePageRoutingModule {}
