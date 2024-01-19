import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MyIdCardComponent} from './my-id-card.component';
import {CardModalModule} from './card-modal/card-modal.module';
import {ImageModalPageModule} from './image-modal/image-modal.module';

@NgModule({
  imports: [CommonModule, IonicModule, ImageModalPageModule, CardModalModule],
  declarations: [MyIdCardComponent],
  exports: [MyIdCardComponent],
})
export class MyIdCardModule {}
