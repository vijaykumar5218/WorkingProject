import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MessageCenterPage} from './message-center.page';
import {FormsModule} from '@angular/forms';
import {MessageCenterPageRoutingModule} from './message-center-routing.module';
import {FooterModuleDesktop} from '../../../shared/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    MessageCenterPageRoutingModule,
    FooterModuleDesktop,
  ],
  declarations: [MessageCenterPage],
  exports: [MessageCenterPage],
})
export class MessageCenterModule {}
