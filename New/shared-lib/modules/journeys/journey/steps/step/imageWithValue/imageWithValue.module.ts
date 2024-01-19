import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IonicModule} from '@ionic/angular';
import {ImageWithValueComponent} from './imageWithValue.component';

@NgModule({
  declarations: [ImageWithValueComponent],
  imports: [IonicModule, CommonModule],
  exports: [ImageWithValueComponent],
})
export class ImageWithValueComponentModule {}
