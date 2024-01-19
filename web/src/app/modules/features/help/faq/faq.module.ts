import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {FaqPage} from './faq.page';
import {FaqRoutingModule} from './faq-routing.module';
import {HelpEmailCardModule} from '@shared-lib/components/settings/components/help/components/help-content/components/help-email-card/help-email-card.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqRoutingModule,
    HelpEmailCardModule,
  ],
  declarations: [FaqPage],
  exports: [FaqPage],
})
export class FaqPageModule {}
