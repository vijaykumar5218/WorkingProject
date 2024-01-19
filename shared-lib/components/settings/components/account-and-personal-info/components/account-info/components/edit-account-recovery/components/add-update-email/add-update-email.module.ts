import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddUpdateEmailPageRoutingModule} from './add-update-email-routing.module';

import {AddUpdateEmailPage} from './add-update-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUpdateEmailPageRoutingModule,
  ],
  declarations: [AddUpdateEmailPage],
})
export class AddUpdateEmailPageModule {}
