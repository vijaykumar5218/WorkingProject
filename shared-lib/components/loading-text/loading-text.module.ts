import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {LoadingTextComponent} from './loading-text.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [LoadingTextComponent],
  exports: [LoadingTextComponent],
})
export class LoadingTextComponentModule {}
