import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HelpPage} from './help.page';

const routes: Routes = [
  {
    path: '',
    component: HelpPage,
    children: [
      {
        path: 'faq',
        loadChildren: () =>
          import('./faq/faq.module').then(m => m.FaqPageModule),
      },
      {
        path: '',
        redirectTo: 'help/faq',
        pathMatch: 'full',
      },
      {
        path: 'feedback',
        loadChildren: () =>
          import(
            '@shared-lib/components/settings/components/feedback/feedback.module'
          ).then(m => m.FeedbackPageModule),
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
export class HelpPageRoutingModule {}
