import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AddBenefitsPage} from './add-benefits.page';

const routes: Routes = [
  {
    path: '',
    component: AddBenefitsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBenefitsPageRoutingModule {}
