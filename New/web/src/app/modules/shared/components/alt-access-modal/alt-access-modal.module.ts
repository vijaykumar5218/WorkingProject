import {CommonModule} from '@angular/common';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AltAccessModalComponent} from './alt-access-modal.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [AltAccessModalComponent],
  exports: [AltAccessModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AltAccessModalModule {}
