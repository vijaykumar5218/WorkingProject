import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BudgetWidgetPage} from './budget-widget.page';

const routes: Routes = [
  {
    path: '',
    component: BudgetWidgetPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetWidgetPageRoutingModule {}
