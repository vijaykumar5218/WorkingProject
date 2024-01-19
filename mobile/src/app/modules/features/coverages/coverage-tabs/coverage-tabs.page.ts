import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';
import * as pageText from '@shared-lib/components/coverages/constants/text-data.json';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';

@Component({
  selector: 'app-coverage-tabs',
  templateUrl: './coverage-tabs.page.html',
  styleUrls: ['./coverage-tabs.page.scss'],
})
export class CoverageTabsPage implements OnInit, OnDestroy {
  tabs: SubHeaderTab[] = [];
  pageText: Record<string, string> = pageText;
  actionOption: ActionOptions = {
    headername: this.pageText.headerLable,
    btnright: true,
    buttonRight: {
      name: '',
      link: this.pageText.rightLink,
    },
  };
  selectedTab = 'insights';

  private selectedTabSubscription;

  constructor(
    private headerType: HeaderTypeService,
    private footerType: FooterTypeService,
    private router: Router,
    private benefitsService: BenefitsService,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.managingTabs();
    this.selectedTabSubscription = this.benefitsService
      .getSelectedTab$()
      .subscribe(tab => {
        this.selectedTab = tab;
      });
  }

  tabChange() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.footerType.publish({
      type: FooterType.tabsnav,
      selectedTab: 'coverages',
    });
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  handleClick(selectedTab: SubHeaderTab) {
    this.selectedTab = selectedTab.link;
  }

  ngOnDestroy(): void {
    if (this.selectedTabSubscription) {
      this.selectedTabSubscription.unsubscribe();
    }
  }

  async managingTabs() {
    const {
      enableBST,
      enableTPA,
    } = await this.accessService.checkMyvoyageAccess();

    if (enableTPA === 'Y') {
      this.selectedTab = 'insights';
      this.tabs.push({
        label: this.pageText.insights,
        link: 'insights',
      });
      this.tabs.push({
        label: this.pageText.myClaims,
        link: 'tpaclaims',
      });
    } else if (enableBST === 'Y') {
      this.selectedTab = 'insights';
      this.tabs.push({
        label: this.pageText.insights,
        link: 'insights',
      });
      this.tabs.push({
        label: this.pageText.myClaims,
        link: 'claims',
      });
    } else {
      this.selectedTab = 'plans';
    }

    this.tabs.push({
      label: this.pageText.plans,
      link: 'plans',
    });
    this.routeToSelectedTab();
  }

  routeToSelectedTab() {
    const urlPieces = this.router.url.split('/');
    if (urlPieces.length > 3) {
      const endUrl = urlPieces[3];
      const removeParam = endUrl.split('?')[0];
      this.selectedTab = removeParam;
    }

    if (this.selectedTab == 'tpaclaims') {
      this.router.navigateByUrl('/coverages/coverage-tabs/tpaclaims');
    } else if (this.selectedTab == 'claims') {
      this.router.navigateByUrl('/coverages/coverage-tabs/claims');
    } else if (this.selectedTab == 'insights') {
      this.router.navigateByUrl('/coverages/coverage-tabs/insights');
    } else {
      this.router.navigateByUrl('/coverages/coverage-tabs/plans');
    }
  }
}
