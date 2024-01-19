import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {SecureSignOutPageRoutingModule} from './secure-sign-out-routing.module';
import {SecureSignOutPage} from './secure-sign-out.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecureSignOutPageRoutingModule,
  ],
  declarations: [SecureSignOutPage],
})
export class SecureSignOutPageModule {}
