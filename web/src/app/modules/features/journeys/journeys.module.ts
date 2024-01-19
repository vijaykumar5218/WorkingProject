import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {JourneysPage} from './journeys.page';
import {JourneysRoutingModule} from './journeys-routing.module';
import {FooterModuleDesktop} from '@web/app/modules/shared/components/footer/footer.module';
import {JourneyComponent} from './components/journey/journey.component';
import {StatusModule} from '@shared-lib/modules/journeys/components/status/status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JourneysRoutingModule,
    FooterModuleDesktop,
    StatusModule,
  ],
  declarations: [JourneysPage, JourneyComponent],
})
export class JourneysPageModule {}
