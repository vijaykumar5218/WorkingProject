import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotificationWebPage} from './notification.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationWebPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@shared-lib/modules/notification/notification.module').then(
            m => m.NotificationPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationWebRoutingModule {}
