import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {GotConsentComponent} from './got-consent.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [GotConsentComponent],
  exports: [GotConsentComponent],
})
export class GotConsentComponentModule {}
