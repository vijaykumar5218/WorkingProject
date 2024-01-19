import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WorkplaceDashboardLandingGuard} from '../../shared/guards/workplace-dashboard-landing/workplace-dashboard-landing-guard.service';
import {WorkplaceDashboardPage} from './workplace-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: WorkplaceDashboardPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then(m => m.WorkplaceHomePageModule),
        canActivate: [WorkplaceDashboardLandingGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkplaceDashboardRoutingModule {}
