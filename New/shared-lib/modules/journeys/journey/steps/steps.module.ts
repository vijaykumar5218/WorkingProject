import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {StepsComponent} from './steps.component';
import {StepsRoutingModule} from './steps-routing.module';
import {StepProgressBarComponentModule} from '@shared-lib/components/step-progress-bar/step-progress-bar.module';
import {SwiperModule} from 'swiper/angular';
import {StepModule} from './step/step.module';
import {ModalComponentModule} from '../../components/modal/modal.module';

@NgModule({
  declarations: [StepsComponent],
  imports: [
    IonicModule,
    CommonModule,
    StepsRoutingModule,
    SwiperModule,
    StepProgressBarComponentModule,
    StepModule,
    ModalComponentModule,
  ],
  schemas: [],
})
export class StepsModule {}
