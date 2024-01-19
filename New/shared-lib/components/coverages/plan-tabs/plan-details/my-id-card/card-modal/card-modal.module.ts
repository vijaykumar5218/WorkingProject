import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {CardModalComponent} from './card-modal.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [CardModalComponent],
  exports: [CardModalComponent],
})
export class CardModalModule {}
