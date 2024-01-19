import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {LanguageDisclamerModalComponent} from './language-disclaimer-modal.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [LanguageDisclamerModalComponent],
  exports: [LanguageDisclamerModalComponent],
})
export class LanguageDisclamerModalModule {}
