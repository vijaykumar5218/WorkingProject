import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {OrangeMoneyComponent} from './orange-money.component';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {MadLibComponent} from './component/mad-lib/mad-lib.component';
import {OMTooltipComponent} from './component/om-tooltip/omtooltip.component';
import {OmEmployerMatchComponent} from './component/om-employer-match/om-employer-match.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [
    OrangeMoneyComponent,
    MadLibComponent,
    OMTooltipComponent,
    OmEmployerMatchComponent,
  ],
  exports: [OrangeMoneyComponent, MadLibComponent, OmEmployerMatchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrangeMoneyModule {}
