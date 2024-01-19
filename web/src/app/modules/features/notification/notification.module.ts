import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {NotificationWebPage} from './notification.page';
import {NotificationWebRoutingModule} from './notification-routing.module';
import {FooterModuleDesktop} from '../../shared/components/footer/footer.module';
import {NotificationPageModule} from '@shared-lib/modules/notification/notification.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationWebRoutingModule,
    FooterModuleDesktop,
    NotificationPageModule,
  ],
  declarations: [NotificationWebPage],
})
export class NotificationWebModule {}
