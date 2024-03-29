import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InsightPage} from './insights.page';

const routes: Routes = [
  {
    path: '',
    component: InsightPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsightPageRoutingModule {}
