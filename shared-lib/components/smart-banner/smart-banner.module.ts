import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {SmartBannerComponent} from './smart-banner.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [SmartBannerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SmartBannerComponent],
})
export class SmartBannerModule {}
