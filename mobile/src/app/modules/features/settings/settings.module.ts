import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {SettingsPageRoutingModule} from './settings-routing.module';
import {SettingsPage} from './settings.page';
import {MenuComponentModule} from '@shared-lib/components/settings/components/menu/menu.module';

import {LoadingComponentModule} from '@shared-lib/components/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    MenuComponentModule,
    LoadingComponentModule,
  ],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
