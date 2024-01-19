import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SpendingWidgetComponent} from './spending-widget.component';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MXWidgetModule],
  declarations: [SpendingWidgetComponent],
  exports: [SpendingWidgetComponent],
})
export class SpendingWidgetModule {}
