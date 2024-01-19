import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {RetirementAccountPageRoutingModule} from './retirement-account-routing.module';

import {RetirementAccountPage} from './retirement-account.page';
import {OrangeMoneyModule} from '@shared-lib/modules/orange-money/orange-money.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetirementAccountPageRoutingModule,
    OrangeMoneyModule,
  ],
  declarations: [RetirementAccountPage],
  exports: [RetirementAccountPage],
})
export class RetirementAccountPageModule {}
