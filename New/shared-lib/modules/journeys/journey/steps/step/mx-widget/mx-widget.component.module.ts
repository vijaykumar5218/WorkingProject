import {NgModule} from '@angular/core';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
import {MxWidgetComponent} from './mx-widget.component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [MxWidgetComponent],
  imports: [MXWidgetModule, IonicModule, CommonModule],
  exports: [MxWidgetComponent],
})
export class MxWidgetComponentModule {}
