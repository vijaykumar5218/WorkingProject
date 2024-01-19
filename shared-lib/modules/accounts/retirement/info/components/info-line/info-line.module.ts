import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {InfoLineComponent} from './info-line.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [InfoLineComponent],
  exports: [InfoLineComponent],
})
export class InfoLineComponentModule {}
