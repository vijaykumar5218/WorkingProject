import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {InfoPageRoutingModule} from './info-routing.module';
import {InfoPage} from './info.page';
import {SwiperModule} from 'swiper/angular';
import {OrangeMoneyModule} from '@shared-lib/modules/orange-money/orange-money.module';
import {AnnualRateReturnComponent} from '@shared-lib/modules/accounts/components/annual-rate-return/annual-rate-return.component';
import {MoreAccountInfoComponent} from '@shared-lib/modules/accounts/components/more-acount-info/more-account-info.component';
import {NudgeMessagingComponentModule} from '@shared-lib/modules/accounts/components/nudge-messaging/nudge-messaging.module';
import {LoadingTextComponentModule} from '@shared-lib/components/loading-text/loading-text.module';
import {CarouselPage} from '@mobile/app/modules/features/account/components/carousel/carousel.page';
import {HSANudgeComponent} from '../../components/hsa-nudge/hsa-nudge.component';
import {InfoLineComponentModule} from './components/info-line/info-line.module';
import {HSASummaryCardComponentModule} from '@shared-lib/modules/journeys/hsa-summary-card/hsa-summary-card.module';
import {HSAStoreNudgeComponentModule} from '@shared-lib/components/hsastore-nudge/hsastore-nudge.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoPageRoutingModule,
    LoadingTextComponentModule,
    OrangeMoneyModule,
    NudgeMessagingComponentModule,
    SwiperModule,
    InfoLineComponentModule,
    HSASummaryCardComponentModule,
    HSAStoreNudgeComponentModule,
  ],
  declarations: [
    InfoPage,
    AnnualRateReturnComponent,
    MoreAccountInfoComponent,
    CarouselPage,
    HSANudgeComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InfoPageModule {}
