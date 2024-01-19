import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {InputComponentModule} from './input/input.module';
import {StepComponent} from './step.component';
import {ButtonComponent} from './button/button.component';
import {AnimationComponent} from './animation/animation.component';
import {HelpCardComponent} from './help-card/help-card.component';
import {VideoComponent} from './video/video.component';
import {ExpandCollapseComponent} from './expandCollapse/expand-collapse.component';
import {RowWithImageComponent} from './rowWithImage/row-with-image.component';
import {ContentLinkModalComponentModule} from './contentLink/contentLinkModal.module';
import {HeaderWithLogoComponent} from './header-with-logo/header-with-logo.component';
import {PopupInputDialogModule} from '@shared-lib/components/popup-input-dialog/popup-input-dialog.module';
import {NudgeMessagingComponentModule} from '@shared-lib/modules/accounts/components/nudge-messaging/nudge-messaging.module';
import {ExpandCollapseComponentModule} from '../../../components/expandCollapse/expand-collapse.module';
import {AddAccountsPageModule} from '@shared-lib/modules/accounts/add-accounts/add-accounts.module';
import {StepTableComponentModule} from '@shared-lib/components/table/table.component.module';
import {SafeHtmlPipeModule} from '@shared-lib/pipes/safeHtml/safeHtml.pipe.module';
import {ModalHeaderComponentModule} from '@shared-lib/components/modal-header/modal-header.module';
import {LineModule} from '@shared-lib/modules/journeys/components/line/line.module';
import {OrangeMoneyModule} from '@shared-lib/modules/orange-money/orange-money.module';
import {MadlibModalComponentModule} from '@shared-lib/modules/orange-money/component/madlib-modal/madlib-modal.module';
import {ImageWithValueComponentModule} from './imageWithValue/imageWithValue.module';
import {LinkComponent} from '../../../components/link/link.component';
import {ChartsComponent} from './charts/charts.component';
import {PieChartComponent} from './charts/pie-chart/pie-chart.component';
import {IntroComponentModule} from './intro/intro.module';
import {MxWidgetComponentModule} from '../step/mx-widget/mx-widget.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    InputComponentModule,
    PopupInputDialogModule,
    OrangeMoneyModule,
    NudgeMessagingComponentModule,
    ImageWithValueComponentModule,
    MadlibModalComponentModule,
    AddAccountsPageModule,
    ExpandCollapseComponentModule,
    StepTableComponentModule,
    SafeHtmlPipeModule,
    ModalHeaderComponentModule,
    LineModule,
    IntroComponentModule,
    MxWidgetComponentModule,
    ContentLinkModalComponentModule,
  ],
  declarations: [
    StepComponent,
    ButtonComponent,
    AnimationComponent,
    HelpCardComponent,
    VideoComponent,
    ExpandCollapseComponent,
    RowWithImageComponent,
    HeaderWithLogoComponent,
    LinkComponent,
    ChartsComponent,
    PieChartComponent,
  ],
  exports: [StepComponent, LinkComponent, ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StepModule {}
