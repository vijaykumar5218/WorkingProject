import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddUpdateMobilePageRoutingModule} from './add-update-mobile-routing.module';

import {AddUpdateMobilePage} from './add-update-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUpdateMobilePageRoutingModule,
  ],
  declarations: [AddUpdateMobilePage],
})
export class AddUpdateMobilePageModule {}
