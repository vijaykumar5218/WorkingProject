import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {OrangeMoneyComponent} from './orange-money.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [OrangeMoneyComponent],
  exports: [OrangeMoneyComponent],
})
export class OrangeMoneyModule {}
