import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SettingsPage} from './settings.page';
import {SettingsPageRoutingModule} from './settings-routing.module';
import {FooterModuleDesktop} from '../../shared/components/footer/footer.module';
import {AccountInfoPageModule} from '@shared-lib/components/settings/components/account-and-personal-info/components/account-info/account-info.module';
import {PersonalInfoPageModule} from '@shared-lib/components/settings/components/account-and-personal-info/components/personal-info/personal-info.module';
import {NotificationSettingsPageModule} from '@shared-lib/components/settings/components/notification-settings/notification-settings.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    FooterModuleDesktop,
    AccountInfoPageModule,
    PersonalInfoPageModule,
    NotificationSettingsPageModule,
  ],
  declarations: [SettingsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingsPageModule {}
