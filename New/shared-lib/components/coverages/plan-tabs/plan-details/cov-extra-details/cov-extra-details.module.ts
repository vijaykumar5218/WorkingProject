import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {CovExtraDetailsComponent} from './cov-extra-details.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [CovExtraDetailsComponent],
  exports: [CovExtraDetailsComponent],
})
export class CovExtraDetailsModule {}
