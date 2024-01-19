import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {SpendingWidgetPageRoutingModule} from './spending-widget-routing.module';
import {SpendingWidgetPage} from './spending-widget.page';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpendingWidgetPageRoutingModule,
    MXWidgetModule,
  ],
  declarations: [SpendingWidgetPage],
})
export class SpendingWidgetPageModule {}
