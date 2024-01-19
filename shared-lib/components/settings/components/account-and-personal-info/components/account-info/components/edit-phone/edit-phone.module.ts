import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EditPhonePageRoutingModule} from './edit-phone-routing.module';

import {EditPhonePage} from './edit-phone.page';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {LegalComponentModule} from '../legal/legal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPhonePageRoutingModule,
    LegalComponentModule,
  ],
  declarations: [EditPhonePage, AlertComponent],
})
export class EditPhonePageModule {}
