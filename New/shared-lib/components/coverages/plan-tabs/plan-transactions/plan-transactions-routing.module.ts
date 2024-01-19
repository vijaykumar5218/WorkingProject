import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PlanTransactionsComponent} from './plan-transactions.component';
const routes: Routes = [
  {
    path: '',
    component: PlanTransactionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanTransactionsPageRoutingModule {}
