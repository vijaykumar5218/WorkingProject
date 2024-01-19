import {AccountInfoPageModule} from './components/account-info/account-info.module';
import {PersonalInfoPageModule} from './components/personal-info/personal-info.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AccountAndPersonalInfoPageRoutingModule} from './account-and-personal-info-routing.module';
import {AccountAndPersonalInfoPage} from './account-and-personal-info.page';
import {LoadingTextComponentModule} from '@shared-lib/components/loading-text/loading-text.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountAndPersonalInfoPageRoutingModule,
    LoadingTextComponentModule,
    AccountInfoPageModule,
    PersonalInfoPageModule,
  ],
  declarations: [AccountAndPersonalInfoPage],
})
export class AccountAndPersonalInfoPageModule {}
