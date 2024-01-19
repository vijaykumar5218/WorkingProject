import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ReviewAuthorizationPage} from './review-authorization.page';
import {ReviewAuthorizationPageRoutingModule} from './review-authorization-routing.module';
import {ModalHeaderComponentModule} from '@shared-lib/components/modal-header/modal-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewAuthorizationPageRoutingModule,
    ModalHeaderComponentModule,
  ],
  declarations: [ReviewAuthorizationPage],
  exports: [ReviewAuthorizationPage],
})
export class ReviewAuthorizationPageModule {}
