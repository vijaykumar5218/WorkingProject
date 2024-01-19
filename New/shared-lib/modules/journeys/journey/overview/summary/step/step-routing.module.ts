import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SummaryStepComponent} from '../step/step.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryStepComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepRoutingModule {}
