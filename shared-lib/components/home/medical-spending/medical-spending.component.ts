import {Component, Input, OnInit} from '@angular/core';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {HomeContent} from '@shared-lib/components/home/models/home-content.model';
import homeContent from '@shared-lib/constants/home/home-content.json';
import moment from 'moment';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AccessService} from '../../../services/access/access.service';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {TPAClaimsData} from '@shared-lib/services/tpa-stream/models/tpa.model';

@Component({
  selector: 'app-medical-spending',
  templateUrl: './medical-spending.component.html',
  styleUrls: ['./medical-spending.component.scss'],
})
export class MedicalSpendingComponent implements OnInit {
  currentDate: string;
  totalSpend = 0;
  totalPremiumSavvi = 0;
  content: HomeContent = homeContent;
  subscription: Subscription = new Subscription();
  hasConsent = false;
  isTPA = false;
  isTPAWaiting = false;
  isMyvoyageEnabled: boolean;
  @Input() isWorkplaceDashboard: boolean;
  @Input() forMobilePlansPage = false;

  constructor(
    private benefitsService: BenefitsService,
    private router: Router,
    private consentService: ConsentService,
    private accessService: AccessService,
    private tpaService: TPAStreamService
  ) {}

  async ngOnInit() {
    const accessResult = await this.accessService.checkMyvoyageAccess();
    this.isMyvoyageEnabled = accessResult.enableMyVoyage === 'Y';
    this.isTPA = accessResult.enableTPA === 'Y';
    this.currentDate = moment(Date.now()).format('MMMM DD, YYYY');
    if (this.isTPA) {
      this.skipConsentInitTPA();
    } else {
      this.checkAuthorization();
    }
  }

  skipConsentInitTPA() {
    this.getBenefits();
    this.getTotalSpendTPA();
  }

  checkAuthorization() {
    this.subscription.add(
      this.consentService.getMedicalConsent().subscribe((consent: boolean) => {
        this.hasConsent = consent;
        if (this.hasConsent) {
          this.getSpending();
          this.getBenefits();
        }
      })
    );
  }

  getTotalSpendTPA() {
    this.subscription.add(
      this.tpaService.getTPAData().subscribe((tpaData: TPAClaimsData) => {
        this.hasConsent = tpaData.carriers.length > 0;
        this.isTPAWaiting = this.hasConsent && tpaData.claims.length < 1;
        try {
          const year = moment().year();
          const data = tpaData.groupingClaimsByYear[year.toString()];
          if (data) {
            this.totalSpend = data.outOfPocketAmountTotal;
          } else {
            this.totalSpend = 0;
          }
        } catch (e) {
          console.log('Error in medical spend nudge: ', e);
        }
      })
    );
  }

  async getSpending() {
    const healthDates = {
      startDate: moment()
        .startOf('year')
        .format('MM/DD/YYYY'),
      endDate: moment()
        .endOf('year')
        .format('MM/DD/YYYY'),
    };
    const healthValues = await this.benefitsService.fetchSpending(healthDates);
    this.totalSpend = this.benefitsService.getTotalCostBST(healthValues);
  }

  async getBenefits() {
    const benefitValues = await this.benefitsService.getBenefits();
    this.totalPremiumSavvi = this.benefitsService.getTotalPremium(
      benefitValues
    );
  }

  viewDetails() {
    this.router.navigateByUrl('coverages');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
