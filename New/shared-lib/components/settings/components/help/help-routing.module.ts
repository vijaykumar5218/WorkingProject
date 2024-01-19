import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HelpPage} from './help.page';

const routes: Routes = [
  {
    path: '',
    component: HelpPage,
  },
  {
    path: 'help-content',
    loadChildren: () =>
      import('./components/help-content/help-content.module').then(
        m => m.HelpContentPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpPageRoutingModule {}
