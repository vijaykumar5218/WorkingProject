import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {NetWorthPageRoutingModule} from './net-worth-routing.module';
import {NetWorthPage} from './net-worth.page';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NetWorthPageRoutingModule,
    MXWidgetModule,
  ],
  declarations: [NetWorthPage],
})
export class NetWorthPageModule {}
