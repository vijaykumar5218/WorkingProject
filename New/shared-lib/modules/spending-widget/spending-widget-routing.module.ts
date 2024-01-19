import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SpendingWidgetPage} from './spending-widget.page';

const routes: Routes = [
  {
    path: '',
    component: SpendingWidgetPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpendingWidgetPageRoutingModule {}
