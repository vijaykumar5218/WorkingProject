import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EditAccountRecoveryPageRoutingModule} from './edit-account-recovery-routing.module';

import {EditAccountRecoveryPage} from './edit-account-recovery.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EditAccountRecoveryPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditAccountRecoveryPage],
})
export class EditAccountRecoveryPageModule {}
