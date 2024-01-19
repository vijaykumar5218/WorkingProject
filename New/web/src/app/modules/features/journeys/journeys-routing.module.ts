import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JourneysPage} from './journeys.page';

const routes: Routes = [
  {
    path: '',
    component: JourneysPage,
    children: [
      {
        path: 'journey/:id',
        loadChildren: () =>
          import('./journey/journey.module').then(m => m.JourneyModule),
      },
      {
        path: 'contact-a-coach',
        loadChildren: () =>
          import(
            '@shared-lib/components/settings/components/contact-a-coach/contact-a-coach.module'
          ).then(m => m.ContactACoachPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneysRoutingModule {}
