import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FaqPage} from './faq.page';

const routes: Routes = [
  {
    path: '',
    component: FaqPage,
  },
  {
    path: 'help-content',
    loadChildren: () =>
      import(
        '@shared-lib/components/settings/components/help/components/help-content/help-content.module'
      ).then(m => m.HelpContentPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqRoutingModule {}
