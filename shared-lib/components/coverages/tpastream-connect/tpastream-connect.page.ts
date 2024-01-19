import {Component, NgZone, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {
  QualtricsService,
  QualtricsUserProps,
} from '@shared-lib/services/qualtrics/qualtrics.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {TPAStreamService} from '../../../services/tpa-stream/tpastream.service';
import * as pageText from './constants/text-data.json';

export enum StreamStep {
  NONE,
  LOAD,
  CHOOSE_PAYER,
  TERMS_OF_SERVICE,
  CREATED_FORM,
  POST_CREDS,
  REAL_TIME,
  POPUP,
  DONE_ENROLL,
  FORM_ERROR,
}

@Component({
  selector: 'app-tpastream-connect',
  templateUrl: './tpastream-connect.page.html',
  styleUrls: ['./tpastream-connect.page.scss'],
})
export class TPAStreamConnectPage implements OnInit {
  pageText: Record<string, string> = pageText;
  isWeb = false;
  streamStep = StreamStep;
  step = StreamStep.NONE;
  subscription = new Subscription();

  constructor(
    private utilityService: SharedUtilityService,
    private accountService: AccountService,
    private qualtricsService: QualtricsService,
    private ngZone: NgZone,
    private modalController: ModalController,
    private tpaStreamService: TPAStreamService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  ngOnInit() {
    this.displayTPA('#tpa-stream');
  }

  displayTPA(elementId: string, streamConnect = window.StreamConnect) {
    const prefix = this.utilityService.getEnvironment().tpaPrefix;
    this.subscription.add(
      this.accountService
        .getParticipant()
        .pipe(first())
        .subscribe(async (part: Participant) => {
          const userProps: QualtricsUserProps = await this.qualtricsService.getUserProperties();
          streamConnect({
            el: elementId,
            isDemo: false,
            sdkToken: this.utilityService.getEnvironment().tpaSdk,
            user: {
              firstName: part.firstName,
              lastName: part.lastName,
              email: part.profileId + '@voya.com',
              memberSystemKey: part.profileId,
            },
            employer: {
              name: prefix + userProps.clientName,
              systemKey: prefix + userProps.clientId,
              vendor: 'internal',
            },
            doneGetSDK: () => {
              this.setStep(StreamStep.LOAD);
            },
            doneChoosePayer: () => {
              this.setStep(StreamStep.CHOOSE_PAYER);
            },
            doneTermsOfService: () => {
              this.setStep(StreamStep.TERMS_OF_SERVICE);
            },
            doneCreatedForm: () => {
              this.setStep(StreamStep.CREATED_FORM);
            },
            donePostCredentials: () => {
              this.setStep(StreamStep.POST_CREDS);
            },
            doneRealTime: () => {
              this.setStep(StreamStep.REAL_TIME);
            },
            donePopUp: () => {
              this.setStep(StreamStep.POPUP);
            },
            doneEasyEnroll: () => {
              this.setStep(StreamStep.DONE_ENROLL);
            },
            handleFormErrors: () => {
              this.setStep(StreamStep.FORM_ERROR);
            },
            userSchema: {},
          });
        })
    );
  }

  setStep(aStep: StreamStep) {
    this.ngZone.run(() => {
      this.step = aStep;
    });
  }

  closeClicked() {
    this.tpaStreamService.getTPAData(true);
    if (this.isWeb) {
      this.utilityService.navigateByUrl('coverages/all-coverages/tpaclaims');
    } else {
      this.modalController.dismiss();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
