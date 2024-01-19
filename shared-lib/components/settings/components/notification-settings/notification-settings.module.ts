import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {NotificationSettingsPageRoutingModule} from './notification-settings-routing.module';
import {NotificationSettingsPage} from './notification-settings.page';
import {FormsModule} from '@angular/forms';
import {NotificationEventsPageModule} from './components/notification-events/notification-events.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    NotificationSettingsPageRoutingModule,
    NotificationEventsPageModule,
  ],
  declarations: [NotificationSettingsPage],
  exports: [NotificationSettingsPage],
})
export class NotificationSettingsPageModule {}
