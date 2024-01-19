import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {HelpPageRoutingModule} from './help-routing.module';
import {HelpPage} from './help.page';
import {MenuComponentModule} from '@shared-lib/components/settings/components/menu/menu.module';
import {HelpEmailCardModule} from '@shared-lib/components/settings/components/help/components/help-content/components/help-email-card/help-email-card.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpPageRoutingModule,
    MenuComponentModule,
    HelpEmailCardModule,
  ],
  declarations: [HelpPage],
})
export class HelpPageModule {}
