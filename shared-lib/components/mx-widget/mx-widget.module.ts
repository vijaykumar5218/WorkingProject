import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MXWidgetComponent} from './mx-widget.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [MXWidgetComponent],
  exports: [MXWidgetComponent],
})
export class MXWidgetModule {}
