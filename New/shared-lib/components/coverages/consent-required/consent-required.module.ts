import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ConsentRequiredComponent} from './consent-required.component';
import {MedicalConsentPage} from './medical-consent/medical-consent.page';
import {ModalHeaderComponentModule} from '../../modal-header/modal-header.module';
import {TPAStreamConnectPageModule} from '../tpastream-connect/tpastream-connect.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalHeaderComponentModule,
    TPAStreamConnectPageModule,
  ],
  declarations: [ConsentRequiredComponent, MedicalConsentPage],
  exports: [ConsentRequiredComponent, MedicalConsentPage],
})
export class ConsentRequiredComponentModule {}
