import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EditEmailPageRoutingModule} from './edit-email-routing.module';

import {EditEmailPage} from './edit-email.page';
import {LegalComponentModule} from '../legal/legal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditEmailPageRoutingModule,
    LegalComponentModule,
  ],
  declarations: [EditEmailPage],
})
export class EditEmailPageModule {}
