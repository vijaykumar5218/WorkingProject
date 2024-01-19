import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BenefitElectionsPage} from './benefit-elections.page';

const routes: Routes = [
  {
    path: '',
    component: BenefitElectionsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenefitElectionsPageRoutingModule {}
