import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RecommendedJourneyComponent} from './recommended-journey.component';
import {StatusModule} from '@shared-lib/modules/journeys/components/status/status.module';

@NgModule({
  imports: [CommonModule, IonicModule, StatusModule],
  declarations: [RecommendedJourneyComponent],
  exports: [RecommendedJourneyComponent],
})
export class RecommendedJourneyModule {}
