import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {UnregisterDevicePage} from './unregister-device.page';

const routes: Routes = [
  {
    path: '',
    component: UnregisterDevicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnregisterDevicePageRoutingModule {}
