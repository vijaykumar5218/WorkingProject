import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllCovergesPage} from './all-coverages.page';

const routes: Routes = [
  {
    path: '',
    component: AllCovergesPage,
    children: [
      {
        path: 'insights',
        loadChildren: () =>
          import(
            '@shared-lib/components/coverages/insights/insights.component.module'
          ).then(m => m.InsightsComponentModule),
      },
      {
        path: 'elections',
        loadChildren: () =>
          import('./benefit-elections/benefit-elections.module').then(
            m => m.BenefitElectionsPageModule
          ),
      },
      {
        path: 'tpaclaims',
        loadChildren: () =>
          import('./tpaclaims-nav/tpaclaims-nav.module').then(
            m => m.TPAClaimsNavPageModule
          ),
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
      {
        path: '',
        redirectTo: 'insights',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllCoveragesPageRoutingModule {}
