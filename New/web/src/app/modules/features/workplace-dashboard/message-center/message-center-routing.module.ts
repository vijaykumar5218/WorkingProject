import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MessageCenterPage} from './message-center.page';

const routes: Routes = [
  {
    path: '',
    component: MessageCenterPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageCenterPageRoutingModule {}
