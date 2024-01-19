import {Component, OnDestroy} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {AlertWindowService} from '@mobile/app/modules/shared/service/alert-window/alert-window.service';
import pageText from '../../constants/madlib.json';
import {
  MadlibData,
  OrangeData,
} from '@shared-lib/services/account/models/orange-money.model';
import {OrangeMoneyService} from '../../services/orange-money.service';
import {HelpPopoverComponent} from './help-popover/help-popover.component';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-madlib-modal',
  templateUrl: './madlib-modal.component.html',
  styleUrls: ['./madlib-modal.component.scss'],
})
export class MadlibModalComponent implements OnDestroy {
  pageText = pageText;
  name: string;
  age: number;
  salaryString: string;
  madlib: MadlibData;
  selectedFeeling: string;
  showSalary = true;
  loading = false;
  saving = false;
  saveFailed = false;

  minDate: string;
  maxDate: string;

  salaryValid = true;
  salaryInBounds = true;
  feelValid = true;

  private orangeDataSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    private orangeMoneyService: OrangeMoneyService,
    private alertWindowService: AlertWindowService,
    private popoverController: PopoverController
  ) {}

  async ngOnInit() {
    this.minDate = moment()
      .subtract(99, 'year')
      .format('YYYY-MM-DD');
    this.maxDate = moment()
      .subtract(17, 'year')
      .format('YYYY-MM-DD');

    this.fetchData();
  }

  fetchData() {
    this.loading = true;

    this.orangeDataSubscription = this.orangeMoneyService
      .getOrangeData()
      .subscribe(async omData => {
        if (omData.errorCode === 'opt-out') {
          this.orangeMoneyService
            .updateOrangeMoneyOptOut()
            .then(async (data: OrangeData) => {
              if (data.errorCode) {
                await this.alertWindowService.presentAlert({
                  message: pageText.errorUpdatingMadlib,
                });
                this.closeDialog();
              } else {
                this.setMadLib(data.madLibData);
              }

              this.loading = false;
            });
        } else {
          this.setMadLib(omData.madLibData);
          this.loading = false;
        }
      });
  }

  setMadLib(madLib: MadlibData) {
    if (madLib.annualSalary) {
      this.salaryString = madLib.annualSalary.toString();
    } else {
      this.salaryString = '0';
    }
    this.madlib = madLib;
    this.age = this.getAgeFromDOB(this.madlib.dob);
  }

  toggleShowSalary() {
    this.showSalary = !this.showSalary;
  }

  getAgeFromDOB(dob) {
    return moment().diff(moment(dob, 'YYYY-MM-DDTh:mm:ss'), 'years');
  }

  onDobChanged(event: CustomEvent) {
    const val = formatDate(event.detail.value, 'YYYY-MM-dd', 'en-US');
    this.madlib.dob = val;
    this.age = this.getAgeFromDOB(this.madlib.dob);
  }

  onSalaryValueChanged(sal: string | number) {
    this.salaryString = sal?.toString();

    this.validateSalary();
  }

  onFeelingChange(feeling) {
    this.selectedFeeling = feeling;

    this.validateFeeling();
  }

  validateSalary() {
    const salaryNum = +this.getCleanedSalaryValue(this.salaryString);
    if (salaryNum) {
      this.salaryValid = true;

      if (salaryNum > 9999999.0) {
        this.salaryInBounds = false;
      } else {
        this.salaryInBounds = true;
      }
    } else {
      this.salaryValid = false;
    }
  }

  validateFeeling() {
    if (this.selectedFeeling) {
      this.feelValid = true;
    } else {
      this.feelValid = false;
    }
  }

  validate(): boolean {
    this.validateSalary();
    this.validateFeeling();

    return this.salaryValid && this.feelValid;
  }

  getCleanedSalaryValue(val: any): number {
    return +val.replace(/,/g, '');
  }

  async saveMadlibData() {
    if (!this.validate()) {
      return;
    }

    this.saving = true;
    this.saveFailed = false;

    const salary = this.getCleanedSalaryValue(this.salaryString);
    const resp = await this.orangeMoneyService.postMadlibData(
      this.madlib.dob,
      salary,
      this.selectedFeeling
    );

    if (resp.orangeData) {
      this.orangeMoneyService.setOrangeData(resp);
      this.closeDialog();
    } else {
      this.saveFailed = true;
    }
    this.saving = false;
  }

  async openHelp() {
    const popover = await this.popoverController.create({
      component: HelpPopoverComponent,
      mode: 'md',
      showBackdrop: false,
    });
    await popover.present();
  }

  closeDialog() {
    this.modalController.dismiss();
  }

  ngOnDestroy(): void {
    this.orangeDataSubscription.unsubscribe();
  }
}
