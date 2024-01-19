import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
  Benefit,
  Benefits,
  BenefitsSummaryContent,
  MyHealthWealth,
  BenefitForBenefitUser
} from '@shared-lib/services/benefits/models/benefits.model';
import * as jsonText from '../../../constants/coverage.json';
import {Coverage} from '../../../models/coverage.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '../../../services/utility/utility.service';
import {Subscription} from 'rxjs';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss'],
})
export class PlansPage implements OnInit {
  coverages: Benefit[];
  covText: Coverage = (jsonText as any).default;
  benefitContent: BenefitsSummaryContent;
  planId: string;
  isWeb: boolean;
  subscription: Subscription = new Subscription();
  isDesktop: boolean;
  guidanceEnabled: boolean;
  myHealthWealth: MyHealthWealth;
  @Input() isWorkplaceDashboard = false;
  @Input() showPagination = false;
  @Input() forHomePageMobile = false;
  @Input() isMyBenefitsUser =false;
  @Input() benefitHubContent :BenefitForBenefitUser
  paginationConfig: string;
  currentPage = 1;
  totalItems: number;
  itemsPerPage: number;

  constructor(
    private benefitsService: BenefitsService,
    private router: Router,
    private utilityService: SharedUtilityService,
    private platformService: PlatformService,
    private footerType: FooterTypeService
  ) {}

  async ngOnInit() {
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
      this.itemsPerPage = this.isDesktop ? 5 : 3;
      this.fetchData();
    });
    this.getBenefitContent();
    this.fetchPlanId();
    this.isWeb = this.utilityService.getIsWeb();
    const benefitContent = await this.benefitsService.getNoBenefitContents();
    this.myHealthWealth = JSON.parse(
      benefitContent.Insights_ManageMyHealthandWealth
    );
    this.getGuidanceEnable();
  }

  async getGuidanceEnable() {
    this.guidanceEnabled = (
      await this.benefitsService.getGuidanceEnabled()
    ).guidanceEnabled;
  }

  fetchPlanId() {
    const routerSubscription = this.utilityService
      .fetchUrlThroughNavigation(3)
      .subscribe(data => {
        this.planId = data?.paramId;
      });
    this.subscription.add(routerSubscription);
  }

  fetchData(): Promise<void> {
    return this.benefitsService
      .getBenefits()
      .then((data: Benefits) => {
        this.coverages = data && data.enrolled;
        if (
          this.showPagination &&
          ((this.isDesktop && this.coverages.length > 5) ||
            (!this.isDesktop && this.coverages.length > 3))
        ) {
          this.managePaginationConfig(this.currentPage);
        } else if (this.forHomePageMobile) {
          this.itemsPerPage = 3;
        } else {
          this.currentPage = 1;
          this.totalItems = this.coverages.length;
          this.itemsPerPage = this.totalItems;
        }
      })
      .catch(() => {
        this.coverages = [];
      });
  }

  managePaginationConfig(page: number) {
    this.currentPage = page;
    this.totalItems = this.coverages.length;
    this.paginationConfig = JSON.stringify({
      conjunction: '',
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      dataSize: this.totalItems,
    });
  }

  paginationChange(currentPage: number) {
    this.managePaginationConfig(currentPage);
  }

  viewBenefit(benefit: Benefit) {
    this.benefitsService.setBenefit(benefit);
    if (!this.isWeb) {
      this.footerType.publish({
        type: FooterType.tabsnav,
        selectedTab: 'coverages',
      });
      this.router.navigateByUrl('/coverages/plan-tabs/details');
    } else {
      this.router.navigateByUrl(`coverages/view-plans/${benefit.id}/details`);
    }
  }

  viewAllBenefits() {
    if (this.isWeb) {
      this.router.navigateByUrl('/coverages');
    } else {
      this.router.navigateByUrl('/coverages/coverage-tabs/plans');
      this.benefitsService.publishSelectedTab('plans');
    }
  }

  async getBenefitContent(): Promise<void> {
    return this.benefitsService
      .getBenefitContent()
      .then((res: BenefitsSummaryContent) => {
        this.benefitContent = res;
      });
  }

  manageWidthOfCard(benefit: Benefit): Record<string, string> | null {
    if (this.isWeb) {
      if (this.planId === benefit.id) {
        return {width: '385px'};
      } else {
        return {width: 'auto'};
      }
    }
    return null;
  }

  openGuidelines() {
    this.benefitsService.openGuidelines();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
