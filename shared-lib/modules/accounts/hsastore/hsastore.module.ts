import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {HSAStorePage} from './hsastore.page';
import {ModalHeaderComponentModule} from '@shared-lib/components/modal-header/modal-header.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ModalHeaderComponentModule],
  declarations: [HSAStorePage],
})
export class HSAStorePageModule {}
