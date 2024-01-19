import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AccountAndPersonalInfoPage} from './account-and-personal-info.page';

const routes: Routes = [
  {
    path: '',
    component: AccountAndPersonalInfoPage,
    children: [
      {
        path: 'account-info',
        loadChildren: () =>
          import('./components/account-info/account-info.module').then(
            m => m.AccountInfoPageModule
          ),
      },
      {
        path: 'personal-info',
        loadChildren: () =>
          import('./components/personal-info/personal-info.module').then(
            m => m.PersonalInfoPageModule
          ),
      },
    ],
  },
  {
    path: 'edit-display-name',
    loadChildren: () =>
      import(
        './components/account-info/components/edit-display-name/edit-display-name.module'
      ).then(m => m.EditDisplayNamePageModule),
  },
  {
    path: 'edit-email',
    loadChildren: () =>
      import(
        './components/account-info/components/edit-email/edit-email.module'
      ).then(m => m.EditEmailPageModule),
  },
  {
    path: 'edit-phone',
    loadChildren: () =>
      import(
        './components/account-info/components/edit-phone/edit-phone.module'
      ).then(m => m.EditPhonePageModule),
  },
  {
    path: 'edit-password',
    loadChildren: () =>
      import(
        './components/account-info/components/edit-password/edit-password.module'
      ).then(m => m.EditPasswordPageModule),
  },

  {
    path: 'edit-account-recovery',
    loadChildren: () =>
      import(
        './components/account-info/components/edit-account-recovery/edit-account-recovery.module'
      ).then(m => m.EditAccountRecoveryPageModule),
  },

  {
    path: 'unregister-device',
    loadChildren: () =>
      import(
        './components/account-info/components/unregister-device/unregister-device.module'
      ).then(m => m.UnregisterDevicePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountAndPersonalInfoPageRoutingModule {}
