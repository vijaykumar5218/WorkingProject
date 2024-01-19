import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MXAccountDetailPageRoutingModule} from './mxdetails-account-routing.module';
import {MXAccountDetailPage} from './mxdetails-account.page';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MXAccountDetailPageRoutingModule,
    MXWidgetModule,
  ],
  declarations: [MXAccountDetailPage],
})
export class MXAccountDetailPageModule {}
