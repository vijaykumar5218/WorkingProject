import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JourneysRoutingModule} from './journeys-routing.module';
import {JourneysComponent} from './journeys.component';
import {JourneyComponent} from './components/journey/journey.component';
import {ListComponent} from './components/list/list.component';
import {IonicModule} from '@ionic/angular';
import {StatusModule} from './components/status/status.module';
import {FooterModuleDesktop} from '@web/app/modules/shared/components/footer/footer.module';

@NgModule({
  declarations: [JourneysComponent, JourneyComponent, ListComponent],
  imports: [
    IonicModule,
    CommonModule,
    JourneysRoutingModule,
    StatusModule,
    FooterModuleDesktop,
  ],
  exports: [JourneyComponent, ListComponent],
})
export class JourneysModule {}
