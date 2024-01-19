import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './modules/shared/guards/auth/auth-guard.service';
import {BenefitsGuard} from '../../../shared-lib/guards/benefit/benefits.guard';
import {CoveragesGuard} from './modules/shared/guards/coverages/coverages-guard.service';
import {HomeGuard} from './modules/shared/guards/home/home-guard.service';
import {InsightsGuard} from '../../../shared-lib/guards/insights/insight.guard';
const loadchildrenObj = () =>
  import('./modules/features/accounts/accounts.module').then(
    m => m.AccountsPageModule
  );
const noAccessPageModuleFun = () =>
  import('@shared-lib/components/no-access/no-access.module').then(
    m => m.NoAccessPageModule
  );
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/features/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard, HomeGuard],
    title: 'MyVoyage',
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'workplace-dashboard',
    loadChildren: () =>
      import(
        './modules/features/workplace-dashboard/workplace-dashboard.module'
      ).then(m => m.WorkplaceDashboardModule),
    canActivate: [AuthGuard],
    title: 'Dashboard',
  },
  {
    path: 'accounts',
    loadChildren: loadchildrenObj,
    canActivate: [AuthGuard],
    title: 'Accounts',
  },
  {
    path: 'coverages',
    loadChildren: () =>
      import('./modules/features/coverages/coverages.module').then(
        m => m.CoveragesPageModule
      ),
    canActivate: [AuthGuard, CoveragesGuard],
    title: 'Benefits & Coverages',
  },
  {
    path: 'journeys',
    loadChildren: () =>
      import('./modules/features/journeys/journeys.module').then(
        m => m.JourneysPageModule
      ),
    canActivate: [AuthGuard],
    title: 'Life Events',
  },
  {
    path: 'journeys-list',
    loadChildren: () =>
      import('@shared-lib/modules/journeys/journeys.module').then(
        m => m.JourneysModule
      ),
    canActivate: [AuthGuard],
    title: 'Life Events',
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./modules/features/help/help.module').then(m => m.HelpPageModule),
    canActivate: [AuthGuard],
    title: 'Help',
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./modules/features/settings/settings.module').then(
        m => m.SettingsPageModule
      ),
    canActivate: [AuthGuard],
    title: 'Settings',
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./modules/features/notification/notification.module').then(
        m => m.NotificationWebModule
      ),
    canActivate: [AuthGuard],
    title: 'Notifications',
  },
  {
    path: 'net-worth',
    loadChildren: () =>
      import('./modules/features/net-worth/net-worth.page.module').then(
        m => m.NetWorthPageModule
      ),
    canActivate: [AuthGuard],
    title: 'Dashboard',
  },
  {
    path: 'financial-wellness',
    loadChildren: () =>
      import(
        './modules/features/financial-wellness/financial-wellness.page.module'
      ).then(m => m.FinancialWellnessPageModule),
    canActivate: [AuthGuard],
    title: 'Dashboard',
  },
  {
    path: 'more',
    loadChildren: () =>
      import('./modules/features/more/more.module').then(m => m.MorePageModule),
    canActivate: [AuthGuard],
    title: 'Settings',
  },
  {
    path: 'no-access',
    loadChildren: noAccessPageModuleFun,
    title: 'No Access',
  },
  {
    path: 'session-timeout',
    loadChildren: () =>
      import('./modules/features/session-timeout/session-timeout.module').then(
        m => m.SessionTimeoutPageModule
      ),
    title: 'Session Time-out',
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./modules/features/logout/logout.module').then(
        m => m.LogoutPageModule
      ),
    title: 'Logout',
  },
  {
    path: 'home/guidelines',
    loadChildren: () =>
      import('./modules/features/home/home.module').then(m => m.HomePageModule),
    canActivate: [BenefitsGuard],
    title: 'MyVoyage',
  },
  {
    path: 'accounts/insights',
    loadChildren: loadchildrenObj,
    canActivate: [InsightsGuard],
    title: 'Accounts',
  },
  {
    path: 'savvi',
    loadChildren: () =>
      import('@shared-lib/modules/savvi/savvi.module').then(m => m.SavviModule),
    title: 'Personalized Enrollment Guidance',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
