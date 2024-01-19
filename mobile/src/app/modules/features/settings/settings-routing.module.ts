import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SettingsPage} from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
  },
  {
    path: 'summary',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/summary/summary.module'
      ).then(m => m.SummaryPageModule),
  },
  {
    path: 'notification-settings',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/notification-settings/notification-settings.module'
      ).then(m => m.NotificationSettingsPageModule),
  },
  {
    path: 'help',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/help/help.module'
      ).then(m => m.HelpPageModule),
  },
  {
    path: 'privacy',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/privacy/privacy.module'
      ).then(m => m.PrivacyPageModule),
  },
  {
    path: 'feedback',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/feedback/feedback.module'
      ).then(m => m.FeedbackPageModule),
  },
  {
    path: 'account-and-personal-info',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/account-and-personal-info/account-and-personal-info.module'
      ).then(m => m.AccountAndPersonalInfoPageModule),
  },
  {
    path: 'contact-a-coach',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/contact-a-coach/contact-a-coach.module'
      ).then(m => m.ContactACoachPageModule),
  },

  {
    path: 'manage-accounts',
    loadChildren: () =>
      import(
        '@shared-lib/modules/accounts/manage-accounts/manage-accounts.module'
      ).then(m => m.ManageAccountsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
