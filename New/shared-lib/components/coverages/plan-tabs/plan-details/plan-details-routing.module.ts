import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddCardComponent} from './add-card/add-card.component';
import {PlanDetailsComponent} from './plan-details.component';
const routes: Routes = [
  {
    path: '',
    component: PlanDetailsComponent,
  },
  {
    path: 'add-card',
    component: AddCardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanDetailsPageRoutingModule {}
