import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WorkplaceHomePage} from './home.page';

const routes: Routes = [
  {
    path: '',
    component: WorkplaceHomePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkplaceHomePageRoutingModule {}
