import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ModalComponent} from './modal.component';
import {VideoModalComponent} from '../../journey/steps/step/video/video-modal/video-modal.component';
import {ContactCoachPopupComponent} from '@shared-lib/components/contact-coach-popup/contact-coach-popup.component';
import {HelpModalComponent} from '@shared-lib/modules/journeys/journey/steps/step/help/help-modal/help-modal.component';
import {RevisitJourneyComponent} from '@shared-lib/components/revisit-journey/revisit-journey.component';
import {ErrorMessagePopupComponent} from '../errorMessagePopup/error-message-popup.component';
import {ModalStepComponent} from './modal-generic/modal-step/modal-step.component';
import {StepModule} from '../../journey/steps/step/step.module';
import {ContentLinkModalComponent} from '../../journey/steps/step/contentLink/contentLinkModal/contentLinkModal.component';
import {ModalHeaderComponentModule} from '@shared-lib/components/modal-header/modal-header.module';
import {SafeHtmlPipeModule} from '@shared-lib/pipes/safeHtml/safeHtml.pipe.module';
import {InputComponentModule} from '../../journey/steps/step/input/input.module';
import {AddAccountsPageModule} from '../../../accounts/add-accounts/add-accounts.module';
import {IntroComponentModule} from '../../journey/steps/step/intro/intro.module';
import {ModalGenericComponent} from './modal-generic/modal-generic.component';
import {ModalNavComponent} from './modal-nav/modal-nav.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    StepModule,
    ModalHeaderComponentModule,
    SafeHtmlPipeModule,
    InputComponentModule,
    AddAccountsPageModule,
    IntroComponentModule,
  ],
  declarations: [
    ModalComponent,
    VideoModalComponent,
    ContactCoachPopupComponent,
    HelpModalComponent,
    RevisitJourneyComponent,
    ErrorMessagePopupComponent,
    ModalStepComponent,
    ContentLinkModalComponent,
    ModalGenericComponent,
    ModalNavComponent,
  ],
  exports: [ModalComponent],
})
export class ModalComponentModule {}
