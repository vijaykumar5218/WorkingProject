import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IonicModule} from '@ionic/angular';
import {HelpComponent} from './help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [IonicModule, CommonModule],
  exports: [HelpComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelpComponentModule {}
