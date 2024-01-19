import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {UnregisterDevicePageRoutingModule} from './unregister-device-routing.module';

import {UnregisterDevicePage} from './unregister-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnregisterDevicePageRoutingModule,
  ],
  declarations: [UnregisterDevicePage],
})
export class UnregisterDevicePageModule {}
