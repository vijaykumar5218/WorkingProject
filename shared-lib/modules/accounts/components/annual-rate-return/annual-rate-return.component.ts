import {Component, OnDestroy} from '@angular/core';
import {OrangeMoneyService} from '@shared-lib/modules/orange-money/services/orange-money.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import * as pageText from '@shared-lib/services/account/constants/annual-rate-return-text.json';
import {Subscription} from 'rxjs';
import {OMStatus} from '@shared-lib/services/account/models/orange-money.model';
import {RootObjectOfferCode} from '@shared-lib/models/predictive-offercode.model';
import {OfferCode} from '@shared-lib/models/offercode.model';

@Component({
  selector: 'app-annual-rate-return',
  templateUrl: './annual-rate-return.component.html',
  styleUrls: ['./annual-rate-return.component.scss'],
})
export class AnnualRateReturnComponent implements OnDestroy {
  ytdReturn: number;
  projReturn: number;
  progressBarValue: number;
  loading: boolean;
  shouldHide: boolean;
  pageText = JSON.parse(JSON.stringify(pageText)).default;
  orangeDataSubscription: Subscription;
  textPredval: RootObjectOfferCode;
  offerVal: OfferCode[];

  constructor(
    private orangeMoneyService: OrangeMoneyService,
    private accountService: AccountService
  ) {}

  async ngOnInit() {
    this.fetchData();
    this.getpredictValue();
    this.getOfferCodeValue();
  }

  async getOfferCodeValue() {
    await this.accountService.getOffercode().then((res: OfferCode[]) => {
      this.offerVal = res?.filter(
        offercode =>
          offercode.offerCode === 'MANACCT' ||
          offercode.offerCode === 'MANACTIPS'
      );
    });
  }

  async getpredictValue() {
    await this.accountService.getPredict().then((data: RootObjectOfferCode) => {
      this.textPredval = data;
    });
  }

  openOffer(link: string) {
    window.open(link, '_blank');
  }

  async fetchData() {
    this.loading = true;

    this.orangeDataSubscription = this.orangeMoneyService
      .getOrangeData()
      .subscribe(async omData => {
        const status = this.orangeMoneyService.getOrangeMoneyStatus(omData);
        this.omStatusChanged(status);
        if (omData.orangeData) {
          this.projReturn =
            omData.orangeData.participantData.investmentRateOfReturn;
        } else if (omData.feForecastData) {
          this.projReturn = omData.feForecastData.investmentRateOfReturn;
        }

        //Multiply by 100 to get percentage value;
        this.projReturn *= 100.0;

        await this.accountService.getRateOfReturn().then(data => {
          this.ytdReturn = data.prr.pct;
        });

        this.progressBarValue = this.ytdReturn / this.projReturn;

        this.loading = false;
      });
  }

  omStatusChanged(status) {
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
    }
  }

  ngOnDestroy(): void {
    this.orangeDataSubscription.unsubscribe();
  }
}
