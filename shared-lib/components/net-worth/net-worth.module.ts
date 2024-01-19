import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {NetWorthComponent} from './net-worth.component';
import {MXWidgetModule} from '../mx-widget/mx-widget.module';
import {AddAccountNudgeComponentModule} from '@shared-lib/components/home/add-account-nudge/add-account-nudge.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MXWidgetModule,
    AddAccountNudgeComponentModule,
  ],
  declarations: [NetWorthComponent],
  exports: [NetWorthComponent],
})
export class NetWorthModule {}
