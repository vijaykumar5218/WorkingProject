import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {NotificationItemComponent} from './notification-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [NotificationItemComponent],
  exports: [NotificationItemComponent],
})
export class NotificationItemComponentModule {}
