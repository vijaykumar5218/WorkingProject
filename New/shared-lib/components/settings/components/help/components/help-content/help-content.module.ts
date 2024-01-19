import {AccordionComponent} from './components/accordion/accordion.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {HelpContentPageRoutingModule} from './help-content-routing.module';
import {HelpContentPage} from './help-content.page';
import {HelpEmailCardModule} from './components/help-email-card/help-email-card.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpContentPageRoutingModule,
    HelpEmailCardModule,
  ],
  declarations: [HelpContentPage, AccordionComponent],
})
export class HelpContentPageModule {}
