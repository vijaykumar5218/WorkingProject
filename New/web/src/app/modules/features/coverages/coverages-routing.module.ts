import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CoveragesPage} from './coverages.page';
import {BSTSmartCardModalComponent} from '@shared-lib/components/coverages/bst-smart-card/bstsmart-card-modal/bstsmart-card-modal.component';
const routes: Routes = [
  {
    path: '',
    component: CoveragesPage,
    children: [
      {
        path: '',
        redirectTo: 'all-coverages/insights',
        pathMatch: 'full',
      },
      {
        path: 'all-coverages',
        loadChildren: () =>
          import('./all-coverages/all-coverages.module').then(
            m => m.AllCovergesPageModule
          ),
      },
      {
        path: 'view-plans/:planId',
        loadChildren: () =>
          import('./view-plans/view-plans.module').then(
            m => m.ViewPlansPageModule
          ),
      },
      {
        path: 'review',
        loadChildren: () =>
          import('./review-authorization/review-authorization.module').then(
            m => m.ReviewAuthorizationPageModule
          ),
      },
      {
        path: 'smartCardModal',
        component: BSTSmartCardModalComponent,
      },
    ],
  },
  {
    path: 'coverage-tabs',
    redirectTo: 'all-coverages',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoveragesRoutingModule {}
