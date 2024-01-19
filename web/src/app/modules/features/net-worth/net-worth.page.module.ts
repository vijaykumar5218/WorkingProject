import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {NetWorthPage} from './net-worth.page';
import {NetWorthPageRoutingModule} from './net-worth-routing.module';
import {MXWidgetPageModule} from '../../shared/components/mxwidget-page/mxwidget-page.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NetWorthPageRoutingModule,
    MXWidgetPageModule,
  ],
  declarations: [NetWorthPage],
})
export class NetWorthPageModule {}
