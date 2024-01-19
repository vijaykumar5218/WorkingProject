import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {HomeContent} from '@shared-lib/components/home/models/home-content.model';
import * as homeContent from '@shared-lib/constants/home/home-content.json';
import {OrangeMoneyService} from '@shared-lib/modules/orange-money/services/orange-money.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {BenefitEnrollment} from '@shared-lib/services/benefits/models/benefits.model';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {ViewWillEnter, ViewWillLeave} from '@ionic/angular';
import {MXWidgetComponent} from '@shared-lib/components/mx-widget/mx-widget.component';
import {NetWorthComponent} from '@shared-lib/components/net-worth/net-worth.component';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HomeService} from '@shared-lib/services/home/home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage
  implements OnInit, OnDestroy, ViewWillEnter, ViewWillLeave {
  readonly widgetType = WidgetType;
  journeyResponse$: Observable<JourneyResponse>;
  hasMXError = false;
  firstLoad = true;
  firstName = '';
  actionOption: ActionOptions = {
    headername: 'Home',
    btnright: true,
    displayLogo: true,
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  @ViewChild('homeFinstrong') finstrongWidget: MXWidgetComponent;
  @ViewChild(NetWorthComponent) netWorthWidget: NetWorthComponent;

  private participantSubscription: Subscription;
  benefitsEnrollment$: Observable<BenefitEnrollment>;

  content: HomeContent = (homeContent as any).default;

  constructor(
    private headerFooterType: HeaderFooterTypeService,
    private journeyService: JourneyService,
    private orangeMoneyService: OrangeMoneyService,
    private benefitsService: BenefitsService,
    private accountService: AccountService,
    private homeService: HomeService
  ) {}

  async ngOnInit() {
    await this.homeService.openPreferenceSettingModal();
    this.orangeMoneyService.getOrangeData();
    this.openBenefitSelectionModal();
    this.participantSubscription = this.accountService
      .getParticipant()
      .subscribe(async (data: Participant) => {
        this.firstName = this.accountService.getDisplayNameOrFirst(data);
      });
    this.benefitsEnrollment$ = await this.benefitsService.getBenefitsEnrollment();
  }

  async ionViewWillEnter() {
    this.journeyResponse$ = this.journeyService.fetchJourneys();

    this.headerFooterType.publishType(
      {
        type: HeaderType.navbar,
        actionOption: this.actionOption,
      },
      {type: FooterType.tabsnav}
    );
    this.benefitsService.setBenefitSummaryBackButton('settings');

    if (!this.firstLoad) {
      this.finstrongWidget.refreshWidget();
      this.netWorthWidget.widget.refreshWidget();
    }
    this.firstLoad = false;
  }

  async openBenefitSelectionModal() {
    await this.benefitsService.openBenefitsSelectionModalIfEnabled();
  }

  ionViewWillLeave() {
    this.journeyResponse$ = undefined;
  }

  ngOnDestroy(): void {
    this.participantSubscription.unsubscribe();
  }
}
