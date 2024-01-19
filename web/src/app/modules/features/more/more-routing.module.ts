import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MorePage} from './more.page';

const routes: Routes = [
  {
    path: '',
    component: MorePage,
    children: [
      {
        path: 'menu',
        loadChildren: () =>
          import('./menu/menu.module').then(m => m.MenuPageModule),
      },
      {
        path: '',
        redirectTo: 'menu',
        pathMatch: 'full',
      },
      {
        path: 'manage-accounts',
        loadChildren: () =>
          import(
            '@shared-lib/modules/accounts/manage-accounts/manage-accounts.module'
          ).then(m => m.ManageAccountsPageModule),
      },
      {
        path: 'privacy',
        loadChildren: () =>
          import(
            '@shared-lib/components/settings/components/privacy/privacy.module'
          ).then(m => m.PrivacyPageModule),
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
        path: 'feedback',
        loadChildren: () =>
          import(
            '@shared-lib/components/settings/components/feedback/feedback.module'
          ).then(m => m.FeedbackPageModule),
      },
      {
        path: 'help',
        loadChildren: () =>
          import(
            '@shared-lib/components/settings/components/help/help.module'
          ).then(m => m.HelpPageModule),
      },
      {
        path: 'contact-a-coach',
        loadChildren: () =>
          import(
            '@shared-lib/components/settings/components/contact-a-coach/contact-a-coach.module'
          ).then(m => m.ContactACoachPageModule),
      },
      {
        path: 'account-and-personal-info',
        loadChildren: () =>
          import(
            '@shared-lib/components/settings/components/account-and-personal-info/account-and-personal-info.module'
          ).then(m => m.AccountAndPersonalInfoPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MorePageRoutingModule {}
