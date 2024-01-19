import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JourneyComponent} from './journey.component';
import {JourneyRoutingModule} from './journey-routing.module';
import {IonicModule} from '@ionic/angular';
import {SubHeaderComponentModule} from '@web/app/modules/shared/components/sub-header/sub-header.module';
@NgModule({
  declarations: [JourneyComponent],
  imports: [
    IonicModule,
    CommonModule,
    JourneyRoutingModule,
    SubHeaderComponentModule,
  ],
})
export class JourneyModule {}
