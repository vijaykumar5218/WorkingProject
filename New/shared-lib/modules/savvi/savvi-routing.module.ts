import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EnrollmentGuidanceComponent} from './components/enrollment-guidance/enrollment-guidance.component';
import {SavviComponent} from './savvi.component';

const routes: Routes = [
  {
    path: '',
    component: SavviComponent,
    children: [
      {
        path: 'enrollment-guidance',
        component: EnrollmentGuidanceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavviRoutingModule {}
