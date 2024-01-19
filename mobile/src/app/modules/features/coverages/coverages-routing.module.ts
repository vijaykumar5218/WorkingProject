import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CoveragesPage} from './coverages.page';

const routes: Routes = [
  {
    path: '',
    component: CoveragesPage,
    children: [
      {
        path: 'coverage-tabs',
        loadChildren: () =>
          import('./coverage-tabs/coverage-tabs.module').then(
            m => m.CoverageTabsPageModule
          ),
      },
      {
        path: 'plan-tabs',
        loadChildren: () =>
          import('./coverage-tabs/plans/plan-tabs/plan-tabs.module').then(
            m => m.PlanTabsPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoveragesRoutingModule {}
