import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {MXAccountDetailPage} from './mxdetails-account.page';

const routes: Routes = [
  {
    path: '',
    component: MXAccountDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MXAccountDetailPageRoutingModule {}
