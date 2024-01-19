import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BenefitsGuard} from '../../../shared-lib/guards/benefit/benefits.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'no-access',
    loadChildren: () =>
      import('@shared-lib/components/no-access/no-access.module').then(
        m => m.NoAccessPageModule
      ),
  },
  {
    path: 'biometrics',
    loadChildren: () =>
      import('./modules/features/landing/biometrics/biometrics.module').then(
        m => m.BiometricsPageModule
      ),
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./modules/features/landing/landing.module').then(
        m => m.LandingPageModule
      ),
  },
  {
    path: 'secure-sign-out',
    loadChildren: () =>
      import(
        './modules/features/logout/secure-sign-out/secure-sign-out.module'
      ).then(m => m.SecureSignOutPageModule),
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./modules/features/logout/logout.module').then(
        m => m.LogoutPageModule
      ),
  },
  {
    path: 'journeys',
    loadChildren: () =>
      import('@shared-lib/modules/journeys/journeys.module').then(
        m => m.JourneysModule
      ),
  },
  {
    path: 'coverages',
    loadChildren: () =>
      import('./modules/features/coverages/coverages.module').then(
        m => m.CoveragesModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./modules/features/settings/settings.module').then(
        m => m.SettingsPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/features/home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'home/guidelines',
    loadChildren: () =>
      import('./modules/features/home/home.module').then(m => m.HomePageModule),
    canActivate: [BenefitsGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/features/account/account.module').then(
        m => m.AccountPageModule
      ),
  },
  {
    path: 'accounts',
    redirectTo: 'account',
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('@shared-lib/modules/notification/notification.module').then(
        m => m.NotificationPageModule
      ),
  },
  {
    path: 'financial-wellness',
    loadChildren: () =>
      import(
        './modules/features/financial-wellness/financial-wellness.module'
      ).then(m => m.FinancialWellnessModule),
  },
  {
    path: 'net-worth',
    loadChildren: () =>
      import('./modules/features/net-worth/net-worth.page.module').then(
        m => m.NetWorthPageModule
      ),
  },
  {
    path: 'spending-widget',
    loadChildren: () =>
      import('@shared-lib/modules/spending-widget/spending-widget.module').then(
        m => m.SpendingWidgetPageModule
      ),
  },
  {
    path: 'budget-widget',
    loadChildren: () =>
      import('@shared-lib/modules/budget-widget/budget-widget.module').then(
        m => m.BudgetWidgetPageModule
      ),
  },
  {
    path: 'claims',
    loadChildren: () =>
      import('@shared-lib/components/coverages/claims/claims.module').then(
        m => m.ClaimsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
