import {NgModule} from '@angular/core';
import {NudgeMessagingComponent} from './nudge-messaging.component';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {NudgepopupComponentModule} from '../nudge-popup/nudge-popup.module';

@NgModule({
  imports: [IonicModule, CommonModule, NudgepopupComponentModule],
  declarations: [NudgeMessagingComponent],
  exports: [NudgeMessagingComponent],
})
export class NudgeMessagingComponentModule {}
