import {Component} from '@angular/core';
import * as PageText from './constants/orangeMoney.json';
import {
  OrangeData,
  OrangeMoneyEstimates,
  OrangeMoneyHeader,
} from '@shared-lib/services/account/models/orange-money.model';
import {OrangeMoneyService} from 'shared-lib/modules/orange-money/services/orange-money.service';
import {ModalController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';
import {OrangeMoneySizeService} from './orange-money-size-service';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import {LandingOrangeMoneyContent} from '@web/app/modules/shared/services/content/model/landing-om-content.model';
import {AccountGroup} from '@shared-lib/services/account/models/all-accounts.model';

@Component({
  selector: 'app-orange-money',
  templateUrl: './orange-money.component.html',
  styleUrls: ['./orange-money.component.scss'],
})
export class OrangeMoneyComponent {
  detailsLink: string;
  pageText = (PageText as any).default;
  estimates: OrangeMoneyEstimates;
  orangeDataSubscription: Subscription;
  accountContentSubscription: Subscription;
  participantSubscription: Subscription;
  omContentSubscripation: Subscription;
  orangeData: OrangeData;
  omHeader: OrangeMoneyHeader;
  omEligibility: string;
  omTitle: string;
  omTileIncompleteMadlibText: string;
  accounts: AccountGroup;
  private subscription = new Subscription();

  constructor(
    private sizes: OrangeMoneySizeService,
    private orangeMoneyService: OrangeMoneyService,
    private accountService: AccountService,
    public modalController: ModalController,
    private contentService: ContentService
  ) {}

  async ngOnInit() {
    const omEligibleData = await this.orangeMoneyService.getOMEligibility();
    this.omEligibility = omEligibleData.eligible;
    if (this.omEligibility === 'true') {
      this.subscription.add(
        this.accountService.getAggregatedAccounts().subscribe(data => {
          this.accounts = data;
          data.categorizedAccounts[0].accounts.forEach(acct => {
            if (
              acct.planId === omEligibleData.planId &&
              acct.accountType.includes('Investment')
            ) {
              this.detailsLink = acct.actualPlanLink;
            }
          });
        })
      );
      this.fetchData();
      this.fetchOMDrupalContent();
    }
  }

  fetchData() {
    this.participantSubscription = this.accountService
      .getParticipant()
      .subscribe(() => {
        this.orangeDataSubscription = this.orangeMoneyService
          .getOrangeData()
          .subscribe(async omData => {
            this.orangeData = omData;
            this.fetchOmTitle();
            this.estimates = await this.orangeMoneyService.getEstimates(omData);
          });
      });
    this.accountContentSubscription = this.accountService
      .fetchAccountsContent()
      .subscribe((data: OrangeMoneyHeader) => {
        this.omHeader = data;
      });
  }

  fetchOmTitle() {
    if (this.orangeData?.orangeData?.omTitle) {
      this.omTitle = this.orangeData.orangeData.omTitle;
    } else if (this.orangeData?.feForecastData?.omTitle) {
      this.omTitle = this.orangeData.feForecastData.omTitle;
    } else if (this.orangeData?.madLibData?.omTitle) {
      this.omTitle = this.orangeData.madLibData.omTitle;
    } else if (this.orangeData?.omTitle) {
      this.omTitle = this.orangeData.omTitle;
    } else {
      this.omTitle = this.pageText.omText;
    }
  }

  fetchOMDrupalContent() {
    this.omContentSubscripation = this.contentService
      .getOrangeMoneyContent()
      .subscribe((data: LandingOrangeMoneyContent) => {
        this.omTileIncompleteMadlibText = data?.OMTileIncompleteMadlib;
      });
  }

  isSizeOne(): boolean {
    return this.sizes.isSizeOne();
  }

  isSizeTwo(): boolean {
    return this.sizes.isSizeTwo();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.orangeDataSubscription) {
      this.orangeDataSubscription.unsubscribe();
    }
    if (this.participantSubscription) {
      this.participantSubscription.unsubscribe();
    }
    if (this.accountContentSubscription) {
      this.accountContentSubscription.unsubscribe();
    }
    if (this.omContentSubscripation) {
      this.omContentSubscripation.unsubscribe();
    }
  }
}
