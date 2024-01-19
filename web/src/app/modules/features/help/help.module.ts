import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {HelpPage} from './help.page';
import {HelpPageRoutingModule} from './help-routing.module';
import {FooterModuleDesktop} from '../../shared/components/footer/footer.module';
import {MenuComponentModule} from '@shared-lib/components/settings/components/menu/menu.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpPageRoutingModule,
    FooterModuleDesktop,
    MenuComponentModule,
  ],
  declarations: [HelpPage],
})
export class HelpPageModule {}
