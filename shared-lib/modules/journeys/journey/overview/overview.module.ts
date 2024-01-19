import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {OverviewRoutingModule} from './overview-routing.module';
import {OverviewComponent} from './overview.component';
import {IntroductionComponent} from './introduction/introduction.component';
import {ImageWithValueSummaryComponent} from './summary/step/imageWithValue/image-with-value.component';
import {SummaryStepComponent} from './summary/step/step.component';
import {WordSummaryComponent} from './summary/step/word/word.component';
import {SummaryComponent} from './summary/summary.component';
import {MadlibModalComponentModule} from '@shared-lib/modules/orange-money/component/madlib-modal/madlib-modal.module';
import {OrangeMoneyModule} from '@shared-lib/modules/orange-money/orange-money.module';
import {TextFieldSummaryComponent} from './summary/step/textField/text-field.component';
import {TableSummaryComponent} from './summary/step/table/table.component';
import {StatusModule} from '@shared-lib/modules/journeys/components/status/status.module';
import {ImageWithValueComponentModule} from '@shared-lib/modules/journeys/journey/steps/step/imageWithValue/imageWithValue.module';
import {NudgeMessagingComponentModule} from '@shared-lib/modules/accounts/components/nudge-messaging/nudge-messaging.module';
import {PopupInputDialogModule} from '@shared-lib/components/popup-input-dialog/popup-input-dialog.module';
import {CheckboxComponent} from './summary/step/checkbox/checkbox.component';
import {LottieModule} from 'ngx-lottie';
import {SummaryStepModule} from './summary/step/step.module';
import {SummaryCardComponent} from './summary/summary-card/summary-card.component';
import player from 'lottie-web';
import {HSASummaryCardComponentModule} from '../../hsa-summary-card/hsa-summary-card.module';
import {StepTableComponentModule} from '@shared-lib/components/table/table.component.module';
import {LineModule} from '../../components/line/line.module';
import {ListComponent} from './summary/step/list/list.component';
import {LabelComponent} from './summary/step/label/label.component';
import {UnExpectedExpensesSummaryCardComponentModule} from '../../unexpected-summary-card/unexpected-summary-card.module';
import {ModalComponentModule} from '@shared-lib/modules/journeys/components/modal/modal.module';
import {StepModule} from '../steps/step/step.module';
import {MxWidgetComponentModule} from '../steps/step/mx-widget/mx-widget.component.module';
import {CollegeSummaryCardComponent} from './summary/summary-card/college/college-summary-card.component';
import {ProgressBarModule} from '@shared-lib/components/progress-bar/progress-bar.module';
import {HSAStoreNudgeComponentModule} from '@shared-lib/components/hsastore-nudge/hsastore-nudge.module';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    OverviewComponent,
    IntroductionComponent,
    SummaryComponent,
    SummaryStepComponent,
    ImageWithValueSummaryComponent,
    WordSummaryComponent,
    TextFieldSummaryComponent,
    TableSummaryComponent,
    CheckboxComponent,
    SummaryCardComponent,
    ListComponent,
    LabelComponent,
    CollegeSummaryCardComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    OverviewRoutingModule,
    PopupInputDialogModule,
    StatusModule,
    OrangeMoneyModule,
    NudgeMessagingComponentModule,
    ImageWithValueComponentModule,
    MadlibModalComponentModule,
    LottieModule.forRoot({player: playerFactory}),
    SummaryStepModule,
    HSASummaryCardComponentModule,
    StepTableComponentModule,
    UnExpectedExpensesSummaryCardComponentModule,
    LineModule,
    ModalComponentModule,
    StepModule,
    MxWidgetComponentModule,
    ProgressBarModule,
    HSAStoreNudgeComponentModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OverviewModule {}
