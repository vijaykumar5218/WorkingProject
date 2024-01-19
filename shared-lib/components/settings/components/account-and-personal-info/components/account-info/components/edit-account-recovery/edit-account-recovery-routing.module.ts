import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {EditAccountRecoveryPage} from './edit-account-recovery.page';

const routes: Routes = [
  {
    path: '',
    component: EditAccountRecoveryPage,
  },
  {
    path: 'add-update-mobile',
    loadChildren: () =>
      import('./components/add-update-mobile/add-update-mobile.module').then(
        m => m.AddUpdateMobilePageModule
      ),
  },
  {
    path: 'add-update-email',
    loadChildren: () =>
      import('./components/add-update-email/add-update-email.module').then(
        m => m.AddUpdateEmailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAccountRecoveryPageRoutingModule {}
