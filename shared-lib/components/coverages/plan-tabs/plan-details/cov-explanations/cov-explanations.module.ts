//as-of.module
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {CovExplanationsComponent} from './cov-explanations.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [CovExplanationsComponent],
  exports: [CovExplanationsComponent],
})
export class CovExplanationsModule {}
