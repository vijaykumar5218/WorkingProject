import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {BSTSmartCardComponent} from './bstsmart-card/bstsmart-card.component';
import {BSTSmartCardListComponent} from './bstsmart-card-list/bstsmart-card-list.component';
import {FormsModule} from '@angular/forms';
import {BSTSmartCardModalComponent} from './bstsmart-card-modal/bstsmart-card-modal.component';
import {ModalHeaderComponentModule} from '@shared-lib/components/modal-header/modal-header.module';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ModalHeaderComponentModule],
  declarations: [
    BSTSmartCardComponent,
    BSTSmartCardListComponent,
    BSTSmartCardModalComponent,
  ],
  exports: [
    BSTSmartCardComponent,
    BSTSmartCardListComponent,
    BSTSmartCardModalComponent,
  ],
})
export class BSTSmartCardModule {}
