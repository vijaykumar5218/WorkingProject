import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SubHeaderComponentModule} from '@web/app/modules/shared/components/sub-header/sub-header.module';
import {AccountDeatilsPage} from './account-details.page';
import {AccountDeatilsPageRoutingModule} from './account-details-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountDeatilsPageRoutingModule,
    SubHeaderComponentModule,
  ],
  declarations: [AccountDeatilsPage],
})
export class AccountDeatilsPageModule {}
