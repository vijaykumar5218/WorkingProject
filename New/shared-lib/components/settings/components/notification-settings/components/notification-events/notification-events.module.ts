import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {NotificationEventsComponent} from './notification-events.component';
import {FormsModule} from '@angular/forms';
import {CardModalModule} from './../../../../../coverages/plan-tabs/plan-details/my-id-card/card-modal/card-modal.module';

@NgModule({
  imports: [FormsModule, CommonModule, IonicModule, CardModalModule],
  declarations: [NotificationEventsComponent],
  exports: [NotificationEventsComponent],
})
export class NotificationEventsPageModule {}
