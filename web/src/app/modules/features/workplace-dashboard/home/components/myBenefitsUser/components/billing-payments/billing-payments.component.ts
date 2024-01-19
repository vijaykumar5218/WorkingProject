import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import {MyBenefitHubService} from '@web/app/modules/shared/services/myBenefitHub/mybenefithub.service';
import {BillingPaymentsContent} from '@web/app/modules/shared/services/content/model/mbh-dashboard-conent.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'app-billing-payments',
  templateUrl: './billing-payments.component.html',
  styleUrls: ['./billing-payments.component.scss'],
})
export class BillingPaymentsComponent implements OnInit {
  private subscription = new Subscription();
  content: BillingPaymentsContent = {};
  dataLoading: boolean;
  showPanel: boolean;
  isNonAutoPay: boolean;
  nPaymentsDue: number;
  totalPaymentDue: number;

  constructor(
    private contentService: ContentService,
    private myBenefitHubService: MyBenefitHubService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.subscription.add(
      this.myBenefitHubService
        .allAccountsHaveNonforfeitureOptionStatus()
        .subscribe(data => {
          this.showPanel = data;
          if (this.showPanel) {
            this.fetchBillingAccounts();
          }
        })
    );
  }

  fetchBillingAccounts() {
    this.subscription.add(
      this.myBenefitHubService.fetchBillingAccounts().subscribe(data => {
        this.isNonAutoPay = this.myBenefitHubService.hasNonAutoPay(data);
        const paymentDueDetails = this.myBenefitHubService.setPaymentDueDetails(
          data
        );
        this.nPaymentsDue = paymentDueDetails.nPaymentsDue;
        this.totalPaymentDue = paymentDueDetails.totalPaymentDue;
        this.fetchMbhDashboardContent();
      })
    );
  }

  fetchMbhDashboardContent() {
    this.subscription.add(
      this.contentService.getMbhDashboardContent().subscribe(data => {
        const workplaceBillingAndPayments: any = JSON.parse(
          data.billingandpayments
        )['billingPayments'];
        this.content['header'] = workplaceBillingAndPayments.header;
        const key = this.isNonAutoPay ? 'nonAutoPay' : 'autoPay';
        this.content['info'] =
          this.nPaymentsDue > 0
            ? workplaceBillingAndPayments[key].paymentDue
            : workplaceBillingAndPayments[key].noPaymentDue;
        this.content['info'].message = this.content['info'].message.replace(
          '{{totalPaymentDue}}',
          this.totalPaymentDue.toString()
        );
        this.dataLoading = true;
      })
    );
  }

  onClick(linkURL: string) {
    const myVoyaDomain = this.utilityService.getEnvironment().myVoyaDomain;
    window.open(myVoyaDomain + linkURL, '_self');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
