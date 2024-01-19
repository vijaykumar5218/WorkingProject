import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {FooterComponentDesktop} from './footer.component';
import {LanguageDisclamerModalModule} from '../language-disclaimer-modal/language-disclaimer-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LanguageDisclamerModalModule,
  ],
  declarations: [FooterComponentDesktop],
  exports: [FooterComponentDesktop],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FooterModuleDesktop {}
