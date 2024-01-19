import {Component} from '@angular/core';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {Observable, Subscription} from 'rxjs';
import * as PageText from '@shared-lib/constants/home/home-content.json';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {AccountService} from '@shared-lib/services/account/account.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {BenefitEnrollment} from '@shared-lib/services/benefits/models/benefits.model';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {HomeService} from '@shared-lib/services/home/home.service';
import {ViewWillEnter} from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements ViewWillEnter {
  participantName: string;
  pageText = (PageText as any).default;
  subscription: Subscription = new Subscription();
  readonly widgetType = WidgetType;
  benefitsEnrollment$: Observable<BenefitEnrollment>;
  isDesktop: boolean;
  isLoad = true;

  constructor(
    private headerTypeService: HeaderTypeService,
    private accountService: AccountService,
    private footerType: FooterTypeService,
    private mxService: MXService,
    private benefitsService: BenefitsService,
    private platformService: PlatformService,
    private homeService: HomeService
  ) {
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  async ngOnInit() {
    this.benefitsEnrollment$ = await this.benefitsService.getBenefitsEnrollment();
    await this.homeService.openPreferenceSettingModal();
    this.openBenefitSelectionModal();
    this.fetchDisplayName();
  }

  ionViewWillEnter(): void {
    this.headerTypeService.publishSelectedTab('HOME');
  }

  fetchDisplayName() {
    this.subscription.add(
      this.accountService.getParticipant().subscribe(participant => {
        this.participantName = this.accountService.getDisplayNameOrFirst(
          participant
        );
      })
    );
  }

  displayWidgets() {
    this.mxService.displayWidget(WidgetType.FINSTRONG_MINI, {
      id: 'mx-finstrong-mini',
      height: '400px',
      autoload: false,
    });
    this.mxService.displayWidget(WidgetType.NET_WORTH_MINI, {
      id: 'mx-net-worth-mini',
      height: '410px',
      autoload: false,
    });
  }

  ngAfterViewInit() {
    this.footerType.publish({type: FooterType.tabsnav, selectedTab: 'home'});
  }

  ngAfterViewChecked() {
    if (this.isLoad) {
      this.displayWidgets();
      this.isLoad = false;
    }
  }

  openBenefitSelectionModal() {
    this.benefitsService.openBenefitsSelectionModalIfEnabled();
  }

  netWorthClicked() {
    this.platformService.navigateByUrl('net-worth');
  }

  completeFinancialSummaryClicked() {
    this.platformService.navigateByUrl('/financial-wellness');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
