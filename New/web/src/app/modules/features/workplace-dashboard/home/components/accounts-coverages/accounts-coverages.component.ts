import {Component} from '@angular/core';
import {AccessService} from '@shared-lib/services/access/access.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {Subscription} from 'rxjs';
import {TileCoverageContent} from './components/claim-coverages/models/tile-coverage-content.model';
import * as pageText from './constants/accounts-coverages-tabs.json';
import {Accountcoverageitems} from './models/accounts-coverages-tabs.model';
import {AccessResult} from '@shared-lib/services/access/models/access.model';

@Component({
  selector: 'app-accounts-coverages',
  templateUrl: './accounts-coverages.component.html',
  styleUrls: ['./accounts-coverages.component.scss'],
})
export class AccountsAndCoveragesComponent {
  isMXUser: boolean;
  pageData: Accountcoverageitems = pageText;
  isDesktop: boolean;
  selectedTab = this.pageData.tabs[0].id;
  isCoverageAccessible: boolean;
  tileCoverageContent: TileCoverageContent;
  subscription = new Subscription();
  myVoyageAccess: AccessResult;
  isMyBenefitsUser: boolean;

  constructor(
    private platformService: PlatformService,
    private accessService: AccessService,
    private benefitsService: BenefitsService,
    private mxService: MXService
  ) {
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  async ngOnInit() {
    this.subscription.add(
      this.mxService.getIsMxUserByMyvoyageAccess().subscribe(data => {
        this.isMXUser = data;
      })
    );
    this.myVoyageAccess = await this.accessService.checkMyvoyageAccess();
    this.isMyBenefitsUser = this.myVoyageAccess.isMyBenefitsUser;
    this.isCoverageAccessible = this.myVoyageAccess.enableCoverages;
    if (this.isCoverageAccessible && !this.isMyBenefitsUser) {
      this.fetchTileCoverageContent();
    }
    if(this.isMyBenefitsUser){
      this.fetchTileCoverageContentOfMyBenefitUser();
    }
  }

  async fetchTileCoverageContent() {
    const {
      workplacedashboardTile,
    } = await this.benefitsService.getNoBenefitContents();
    this.tileCoverageContent = JSON.parse(workplacedashboardTile);
    this.pageData.tabs.forEach((tab, tabIndex) => {
      if (tab.id === 'claim-coverages') {
        this.pageData.tabs[tabIndex].label = this.tileCoverageContent['title'];
      }
    });
  }

  async fetchTileCoverageContentOfMyBenefitUser() {
    this.subscription.add(this.benefitsService.getMBHBenefitDetails().subscribe(data=>{
       this.tileCoverageContent = data;
     }));
  }

  onclick(tab: string) {
    this.selectedTab = tab;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
