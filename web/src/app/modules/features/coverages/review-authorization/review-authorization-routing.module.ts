import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReviewAuthorizationPage} from './review-authorization.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewAuthorizationPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewAuthorizationPageRoutingModule {}
