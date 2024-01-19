import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InsightsComponent} from '@shared-lib/components/coverages/insights/insights.component';
import {CoverageTabsPage} from './coverage-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: CoverageTabsPage,

    children: [
      {
        path: 'insights',
        component: InsightsComponent,
      },
      {
        path: 'tpaclaims',
        loadChildren: () =>
          import(
            '@shared-lib/components/coverages/tpaclaims/tpaclaims.component.module'
          ).then(m => m.TPAClaimsComponentModule),
      },
      {
        path: 'claims',
        loadChildren: () =>
          import(
            '@shared-lib/components/coverages/plan-tabs/plan-transactions/plan-transactions.module'
          ).then(m => m.PlanTransactionsModule),
      },
      {
        path: 'plans',
        loadChildren: () =>
          import('@shared-lib/components/coverages/plans/plans.module').then(
            m => m.PlansPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoverageTabsPageRoutingModule {}
