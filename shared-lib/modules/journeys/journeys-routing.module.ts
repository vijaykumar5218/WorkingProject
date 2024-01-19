import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {JourneysGuard} from '../../../shared-lib//guards/journeys/journeys.guard';
import {JourneysComponent} from './journeys.component';

const routes: Routes = [
  {
    path: '',
    component: JourneysComponent,
  },
  {
    path: 'journey/:id',
    loadChildren: () =>
      import(
        '@mobile/app/modules/features/journeys/journey/journey.module'
      ).then(m => m.JourneyModule),
    canActivate: [JourneysGuard],
  },

  {
    path: 'contact-a-coach',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/contact-a-coach/contact-a-coach.module'
      ).then(m => m.ContactACoachPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneysRoutingModule {}
