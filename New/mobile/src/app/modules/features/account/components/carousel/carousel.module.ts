import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SwiperModule} from 'swiper/angular';
import {IonicModule} from '@ionic/angular';
import {CarouselPage} from './carousel.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SwiperModule],
  declarations: [CarouselPage],
  exports: [CarouselPage],
})
export class CarouselPageModule {}
