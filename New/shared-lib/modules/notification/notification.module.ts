import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {NotificationPageRoutingModule} from './notification-routing.module';
import {NotificationPage} from './notification.page';
import {NotificationItemComponentModule} from './components/notification-item/notification-item.module';
import {LoadingComponentModule} from '@shared-lib/components/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationPageRoutingModule,
    NotificationItemComponentModule,
    LoadingComponentModule,
  ],
  declarations: [NotificationPage],
  exports: [NotificationPage],
})
export class NotificationPageModule {}
