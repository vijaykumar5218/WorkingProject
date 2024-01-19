import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TPAStreamConnectPage} from './tpastream-connect.page';
import {ModalHeaderComponentModule} from '../../modal-header/modal-header.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ModalHeaderComponentModule],
  declarations: [TPAStreamConnectPage],
  exports: [TPAStreamConnectPage],
})
export class TPAStreamConnectPageModule {}
