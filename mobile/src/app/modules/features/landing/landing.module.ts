import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SwiperModule} from 'swiper/angular';
import {IonicModule} from '@ionic/angular';
import {LandingPageRoutingModule} from './landing-routing.module';
import {LandingPage} from './landing.page';
import {StepProgressBarComponentModule} from '@shared-lib/components/step-progress-bar/step-progress-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule,
    SwiperModule,
    StepProgressBarComponentModule,
  ],
  declarations: [LandingPage],
})
export class LandingPageModule {}
