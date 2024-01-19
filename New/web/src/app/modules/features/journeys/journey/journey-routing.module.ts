import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {JourneyStepGuard} from '@shared-lib/guards/journeys/steps/journey-step.guard';
import {JourneyComponent} from './journey.component';

const routes: Routes = [
  {
    path: '',
    component: JourneyComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () =>
          import(
            '@shared-lib/modules/journeys/journey/overview/overview.module'
          ).then(m => m.OverviewModule),
      },
      {
        path: 'steps',
        loadChildren: () =>
          import(
            '@shared-lib/modules/journeys/journey/steps/steps.module'
          ).then(m => m.StepsModule),
        canActivate: [JourneyStepGuard],
      },
      {
        path: 'resources',
        loadChildren: () =>
          import(
            '@shared-lib/modules/journeys/journey/resources/resources.module'
          ).then(m => m.ResourcesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyRoutingModule {}
