import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HelpContentPage} from './help-content.page';

const routes: Routes = [
  {
    path: '',
    component: HelpContentPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpContentPageRoutingModule {}
