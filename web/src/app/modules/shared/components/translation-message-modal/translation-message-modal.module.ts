import {CommonModule} from '@angular/common';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {TranslationMessageModalComponent} from './translation-message-modal.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [TranslationMessageModalComponent],
  exports: [TranslationMessageModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TranslationMessageModalModule {}
