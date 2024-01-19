import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SessionTimeoutPage} from './session-timeout.page';
import {SessionTimeoutPageRoutingModule} from './session-timeout-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionTimeoutPageRoutingModule,
  ],
  declarations: [SessionTimeoutPage],
})
export class SessionTimeoutPageModule {}
