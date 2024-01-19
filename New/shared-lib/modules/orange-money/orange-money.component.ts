import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {
  OMStatus,
  OrangeData,
  OrangeMoneyEstimates,
  OrangeMoneyHeader,
  RetirementAgeSaveResp,
  SalarySaveResp,
} from '@shared-lib/services/account/models/orange-money.model';
import {OrangeMoneyService} from './services/orange-money.service';
import * as orangeMoney from './constants/orangeMoney.json';
import {ModalController} from '@ionic/angular';
import {PopupInputDialogComponent} from '@shared-lib/components/popup-input-dialog/popup-input-dialog.component';
import {PopupInputType} from '@shared-lib/components/popup-input-dialog/constants/popup-input-type.enum';
import {Subscription} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';
import * as moment from 'moment';
import {
  Account,
  AccountsData,
  Participant,
} from '@shared-lib/services/account/models/accountres.model';
import {OMTooltipComponent} from './component/om-tooltip/omtooltip.component';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-orange-money',
  templateUrl: './orange-money.component.html',
  styleUrls: ['./orange-money.component.scss'],
})
export class OrangeMoneyComponent implements OnDestroy {
  estimates: OrangeMoneyEstimates;
  progressWidth = 74;
  orangeText = JSON.parse(JSON.stringify(orangeMoney)).default;
  private orangeDataSubscription: Subscription;
  accountContentSubscription: Subscription;
  shouldHide = false;
  omStatus: OMStatus;
  currentAge: number;
  dateOfBirth: string;
  growthRate: number;
  desiredGoal: number;
  minimumGoal: number;
  participantSubscription: Subscription;
  retirementAgeMin: number;
  retirementAgeMax: number;
  orangeData: OrangeData;
  omHeader: OrangeMoneyHeader;
  account: Account;
  workplaceDashboardEnabled: boolean;
  @Input() displayHeader = true;
  @Input() fromJourneys = false;
  suppressEdit: boolean;
  @Output() madlibClose = new EventEmitter<void>();
  private planLink: string;

  constructor(
    private orangeMoneyService: OrangeMoneyService,
    private accountService: AccountService,
    public modalController: ModalController,
    private accessService: AccessService
  ) {}

  async ngOnInit() {
    this.fetchData();
    this.account = this.accountService.getAccount();
    this.suppressEdit = false;
    await this.accessService.checkMyvoyageAccess().then(async res => {
      this.workplaceDashboardEnabled = res.myWorkplaceDashboardEnabled;
      if (this.workplaceDashboardEnabled && this.fromJourneys) {
        const omEligibleData = await this.orangeMoneyService.getOMEligibility();
        if (omEligibleData?.planId) {
          this.accountService
            .getAllAccountsWithOutHSA()
            .then((accData: AccountsData) => {
              const accIndex = accData.retirementAccounts?.accounts.findIndex(
                account => account.planId === omEligibleData.planId
              );
              if (accIndex != -1) {
                this.planLink =
                  accData.retirementAccounts.accounts[accIndex].planLink;
              } else {
                this.suppressEdit = true;
              }
            });
        } else {
          this.suppressEdit = true;
        }
      }
    });
  }

  async openTooltip() {
    const modal = await this.modalController.create({
      component: OMTooltipComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        tooltipContent: this.omHeader.OMTooltip,
      },
    });
    return modal.present();
  }

  fetchData() {
    this.accountContentSubscription = this.accountService
      .fetchAccountsContent()
      .subscribe((data: OrangeMoneyHeader) => {
        this.omHeader = data;
      });
    this.participantSubscription = this.accountService
      .getParticipant()
      .subscribe((data: Participant) => {
        this.dateOfBirth = data.birthDate;
        this.currentAge = moment().diff(
          moment(this.dateOfBirth, 'MM/DD/YYYY'),
          'years'
        );

        this.orangeDataSubscription = this.orangeMoneyService
          .getOrangeData()
          .subscribe(async omData => {
            this.orangeData = omData;
            const status = this.orangeMoneyService.getOrangeMoneyStatus(omData);
            this.omStatusChanged(status);

            if (status == OMStatus.FE_DATA) {
              //Set retirement age min and max
              this.retirementAgeMax =
                omData.feForecastData.participantData.retirementAgeSlider.max;
              this.retirementAgeMin =
                omData.feForecastData.participantData.retirementAgeSlider.min;

              //Set props for saving salary
              this.growthRate =
                omData.feForecastData.participantData.salary.growthRate;
              this.desiredGoal = omData.feForecastData.feForecast.desiredGoal;
              this.minimumGoal = omData.feForecastData.feForecast.minimumGoal;
            } else {
              this.retirementAgeMin = this.currentAge + 1;
              this.retirementAgeMax = 80;
            }

            this.estimates = await this.orangeMoneyService.getEstimates(omData);
            if (this.estimates) {
              if (this.estimates.retirementAge <= this.currentAge) {
                this.estimates.retirementAge = this.currentAge + 1;
              }
              this.setProgressWidth();
            }
          });
      });
  }

  refreshData() {
    this.estimates = null;
    this.orangeMoneyService.getOrangeData(true);
  }

  omStatusChanged(status) {
    this.omStatus = status;
    switch (status) {
      case OMStatus.ORANGE_DATA:
      case OMStatus.FE_DATA:
        this.shouldHide = false;
        break;

      case OMStatus.MADLIB_OM:
      case OMStatus.MADLIB_FE:
      case OMStatus.SERVICE_DOWN:
      case OMStatus.UNKNOWN:
        this.shouldHide = true;
        break;
    }
  }

  setProgressWidth() {
    let prog =
      (this.estimates.estimatedMonthlyIncome * 100.0) /
      this.estimates.estimatedMonthlyGoal;
    if (prog > 100) {
      prog = 100;
    }
    this.progressWidth = prog;
  }

  async editOrangeMoney() {
    let link;
    if (this.workplaceDashboardEnabled) {
      link = this.fromJourneys ? this.planLink : this.account.planLink;
    } else {
      link = this.omHeader.OMDeeplink;
    }
    this.accountService.openPwebAccountLink(
      decodeURIComponent(link),
      this.workplaceDashboardEnabled ? '_self' : ''
    );
  }

  async editCurrentSalary() {
    const modal = await this.modalController.create({
      component: PopupInputDialogComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        title: this.orangeText.dialogs.currentSalaryTitle,
        inputTitle: this.orangeText.dialogs.currentSalaryInputTitle,
        value: this.estimates?.currSalary,
        inputType: PopupInputType.currency,
        validator: (input?: number | string): string => {
          const numVal = +input;
          if (numVal == this.estimates?.currSalary) {
            return this.orangeText.dialogs.validations.incomeSame;
          } else if (numVal < 1.0 || numVal > 9999999.0) {
            return this.orangeText.dialogs.validations.incomeBetween;
          }
          return null;
        },
        saveFunction: async (value: string): Promise<boolean> => {
          return new Promise(res => {
            if (this.omStatus == OMStatus.FE_DATA) {
              this.orangeMoneyService
                .saveSalaryFE(
                  +value,
                  this.growthRate,
                  this.desiredGoal,
                  this.minimumGoal
                )
                .then((resp: SalarySaveResp) => {
                  res(resp.feForecastData != null);
                });
            } else if (this.omStatus == OMStatus.ORANGE_DATA) {
              const dob = moment(this.dateOfBirth, 'MM/DD/YYYY').toISOString();
              this.orangeMoneyService
                .saveSalaryNonFE(+value, dob, this.orangeData)
                .then((resp: SalarySaveResp) => {
                  res(resp.success);
                });
            } else {
              res(false);
            }
          });
        },
      },
    });
    modal.onDidDismiss().then(data => {
      const saved = data.data.saved;
      if (saved) {
        this.refreshData();
      }
    });
    return modal.present();
  }

  async editRetirementAge() {
    const modal = await this.modalController.create({
      component: PopupInputDialogComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        title: this.orangeText.dialogs.RetirementAgeTitle,
        inputTitle: this.orangeText.dialogs.RetirementAgeInputTitle,
        value: this.estimates?.retirementAge,
        inputType: PopupInputType.number,
        validator: (input?: number | string): string => {
          const num = +input;

          if (!num) {
            return this.orangeText.dialogs.validations.retirementBetween
              .replace('{1}', this.retirementAgeMin)
              .replace('{2}', this.retirementAgeMax);
          }

          if (this.estimates?.retirementAge == num) {
            return this.orangeText.dialogs.validations.retirementAgeSame;
          }

          if (num > this.retirementAgeMax) {
            return (
              this.orangeText.dialogs.validations.retirementExcedes +
              this.retirementAgeMax
            );
          } else if (num < this.retirementAgeMin) {
            return (
              this.orangeText.dialogs.validations.retirementBelow +
              this.retirementAgeMin
            );
          }
        },
        saveFunction: async (value: number | string): Promise<boolean> => {
          return new Promise(res => {
            if (this.omStatus == OMStatus.FE_DATA) {
              this.orangeMoneyService
                .saveRetiremnetAgeFE(+value)
                .then((resp: RetirementAgeSaveResp) => {
                  res(resp.result.valid);
                });
            } else if (this.omStatus == OMStatus.ORANGE_DATA) {
              this.orangeMoneyService
                .saveRetirementAgeNonFE(+value, this.orangeData)
                .then((resp: RetirementAgeSaveResp) => {
                  res(resp.result.valid);
                });
            } else {
              res(false);
            }
          });
        },
      },
    });
    modal.onDidDismiss().then(data => {
      if (data.data.saved) {
        this.refreshData();
      }
    });
    return modal.present();
  }

  emitMadlibClose() {
    this.madlibClose.emit();
  }

  ngOnDestroy(): void {
    if (this.accountContentSubscription) {
      this.accountContentSubscription.unsubscribe();
    }
    if (this.orangeDataSubscription) {
      this.orangeDataSubscription.unsubscribe();
    }
    if (this.participantSubscription) {
      this.participantSubscription.unsubscribe();
    }
  }
}
