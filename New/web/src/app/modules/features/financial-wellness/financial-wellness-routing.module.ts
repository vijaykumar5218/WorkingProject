import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinancialWellnessPage} from './financial-wellness.page';

const routes: Routes = [
  {
    path: '',
    component: FinancialWellnessPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialWellnessPageRoutingModule {}
