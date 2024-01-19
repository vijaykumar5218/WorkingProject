import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ContactACoachPage} from './contact-a-coach.page';

const routes: Routes = [
  {
    path: '',
    component: ContactACoachPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactACoachPageRoutingModule {}
