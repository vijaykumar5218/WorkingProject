import {NgModule} from '@angular/core';
import {NudgePopupComponent} from './nudge-popup.component';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [NudgePopupComponent],
  exports: [NudgePopupComponent],
})
export class NudgepopupComponentModule {}
