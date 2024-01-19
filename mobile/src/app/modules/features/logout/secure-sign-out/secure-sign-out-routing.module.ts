import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SecureSignOutPage} from './secure-sign-out.page';

const routes: Routes = [
  {
    path: '',
    component: SecureSignOutPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecureSignOutPageRoutingModule {}
