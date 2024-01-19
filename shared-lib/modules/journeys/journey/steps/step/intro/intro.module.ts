import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IonicModule} from '@ionic/angular';
import {IntroComponent} from './intro.component';
import {DescComponent} from './desc/desc.component';

@NgModule({
  declarations: [IntroComponent, DescComponent],
  imports: [IonicModule, CommonModule],
  exports: [IntroComponent],
})
export class IntroComponentModule {}
