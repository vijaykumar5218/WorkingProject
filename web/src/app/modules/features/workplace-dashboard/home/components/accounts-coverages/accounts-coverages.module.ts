import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AccountsAndCoveragesComponent} from './accounts-coverages.component';
import {ClaimCoveragestModule} from './components/claim-coverages/claim-coverages.module';
import {SubHeaderComponentModule} from '@web/app/modules/shared/components/sub-header/sub-header.module';
import {AccountsComponentsModule} from './components/accounts/accounts.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AccountsComponentsModule,
    ClaimCoveragestModule,
    SubHeaderComponentModule,
  ],
  declarations: [AccountsAndCoveragesComponent],
  exports: [AccountsAndCoveragesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountsAndCoveragesComponentsModule {}
