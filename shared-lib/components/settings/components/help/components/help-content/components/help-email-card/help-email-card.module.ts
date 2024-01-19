import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {HelpEmailCardComponent} from './help-email-card.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [HelpEmailCardComponent],
  declarations: [HelpEmailCardComponent],
})
export class HelpEmailCardModule {}
