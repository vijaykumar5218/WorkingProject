import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {JourneyComponent} from './journey.component';
import {JourneyRoutingModule} from './journey-routing.module';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [JourneyComponent],
  imports: [IonicModule, CommonModule, JourneyRoutingModule],
})
export class JourneyModule {}
