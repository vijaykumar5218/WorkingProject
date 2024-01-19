import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import content from './constants/content.json';
import headerContent from './constants/headerContent.json';
import {Content, SmallDeviceContent} from './model/content.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {AccountService} from '@shared-lib/services/account/account.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import tabNavContent from '@shared-lib/modules/footer/tabsnav/constants/tabsnav-text.json';
import menuOption from '@shared-lib/components/settings/constants/settingsOption.json';
import {MyVoyageHeaderService} from './services/myvoyage-header.service';
@Component({
  selector: 'app-myvoyage-header',
  templateUrl: 'myvoyage-header.component.html',
  styleUrls: ['myvoyage-header.component.scss'],
})
export class MyvoyageHeaderComponent implements OnInit, OnDestroy {
  content: Content = content;
  headerContent = headerContent;
  numberOfNotifications: number;
  subscription: Subscription = new Subscription();
  smallDeviceContent: SmallDeviceContent;
  tabNavContent = tabNavContent;
  menuOption = menuOption;
  isMxSubscribe: boolean;
  rootPath: string;
  @Input() selectedTab: string;

  constructor(
    private headerTypeService: HeaderTypeService,
    private journeyService: JourneyService,
    private accountService: AccountService,
    private mxService: MXService,
    private benefitsService: BenefitsService,
    private myVoyageHeaderService: MyVoyageHeaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routerNavigation();
    this.checkForNewMsgs();
    this.myVoyageHeaderService.initializeNotificationCount();
    this.headerTypeService.qualtricsInitialize();
  }

  routerNavigation() {
    const routerNavigation = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((data: NavigationEnd) => {
        if (data instanceof NavigationEnd) {
          this.smallDeviceNavContent(data?.url);
          this.fetchCurrentRootPath(data.url);
        }
      });
    this.subscription.add(routerNavigation);
  }

  smallDeviceNavContent(url: string) {
    const arrOfUrl = url.split('/');
    this.smallDeviceContent = {};
    if (arrOfUrl[1] === 'accounts') {
      this.accountNavContent(arrOfUrl);
    } else if (arrOfUrl[1] === 'coverages') {
      this.coveragesNavContent(arrOfUrl);
    } else if (arrOfUrl[1] === 'journeys-list') {
      this.smallDeviceContent.title = this.content.navbarItems.filter(
        data => data.link === '/myvoyageui/#/journeys'
      )[0].text;
    } else if (arrOfUrl[1] === 'journeys') {
      const currentJourney = this.journeyService.getCurrentJourney();
      if (currentJourney) {
        this.smallDeviceContent.title = JSON.parse(
          currentJourney?.landingAndOverviewContent
        )?.intro?.header;
        this.smallDeviceContent.isBackBtn = true;
        this.smallDeviceContent.previousPage = '/journeys-list';
      }
    } else if (arrOfUrl[1] === 'more') {
      this.moreNavContent(arrOfUrl);
    } else if (arrOfUrl[1] === 'net-worth') {
      this.smallDeviceContent.title = headerContent.netWoth;
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage = '/home';
    } else if (arrOfUrl[1] === 'financial-wellness') {
      this.smallDeviceContent.title = headerContent.financialSummary;
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage = '/home';
    } else if (arrOfUrl[1]?.split('?')[0] === 'notification') {
      this.smallDeviceContent.title = `${arrOfUrl[1]?.split('?')[0]}s`;
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage = '';
    }
  }

  accountNavContent(arrOfUrl: string[]) {
    if (arrOfUrl[2] === 'account-details') {
      const accountDetailsObs =
        arrOfUrl[3].split('-isVoyaAccessPlan-').length === 2
          ? this.accountService.getIsVoyaAccessPlanAccountData(
              arrOfUrl[3].split('-isVoyaAccessPlan-')[0],
              arrOfUrl[3].split('-isVoyaAccessPlan-')[1]
            )
          : this.accountService.getAccountDataWithoutType(arrOfUrl[3]);
      this.subscription.add(
        accountDetailsObs.subscribe(data => {
          this.smallDeviceContent.title = data.planName;
          this.smallDeviceContent.isBackBtn = true;
          this.smallDeviceContent.previousPage = '/accounts';
        })
      );
    } else if (arrOfUrl[2] === 'mxdetails-account') {
      this.isMxSubscribe = true;
      this.mxService.getMXAccountData(arrOfUrl[3]).subscribe(data => {
        if (this.isMxSubscribe) {
          this.smallDeviceContent.title = data.name;
          this.smallDeviceContent.isBackBtn = true;
          this.smallDeviceContent.previousPage = '/accounts';
          this.isMxSubscribe = false;
        }
      });
    } else if (
      arrOfUrl[2] === 'spending-widget' ||
      arrOfUrl[2] === 'budget-widget'
    ) {
      this.smallDeviceContent.title = arrOfUrl[2].split('-')[0];
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage = '/accounts';
    } else if (
      arrOfUrl[2] === 'add-accounts' ||
      arrOfUrl[2] === 'manage-accounts'
    ) {
      this.smallDeviceContent.title = `${arrOfUrl[2].split('-')[0]} ${
        arrOfUrl[2].split('-')[1]
      }`;
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage = '/accounts';
    } else {
      this.smallDeviceContent.title = this.content.navbarItems.filter(
        data => data.text === 'Accounts'
      )[0].text;
    }
  }

  coveragesNavContent(arrOfUrl: string[]) {
    if (arrOfUrl[2] === 'view-plans') {
      this.subscription.add(
        this.benefitsService
          .getBenefitEnrolledData(arrOfUrl[3])
          .subscribe(data => {
            this.smallDeviceContent.title = data.name;
            this.smallDeviceContent.isBackBtn = true;
            this.smallDeviceContent.previousPage =
              '/coverages/all-coverages/plans';
          })
      );
    } else {
      this.smallDeviceContent.title = this.content.navbarItems.filter(
        data => data.text === 'Coverages'
      )[0].text;
    }
  }

  moreNavContent(arrOfUrl: string[]) {
    if (
      arrOfUrl[2] === 'manage-accounts' ||
      arrOfUrl[2] === 'notification-settings' ||
      arrOfUrl[2] === 'summary' ||
      arrOfUrl[2] === 'contact-a-coach' ||
      arrOfUrl[2] === 'privacy' ||
      arrOfUrl[2] === 'feedback'
    ) {
      const title = this.menuOption.option.filter(
        data => data.url === arrOfUrl[2]
      )[0].text;
      this.smallDeviceContent.title = title;
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage = '/more';
    } else if (arrOfUrl[2] === 'help') {
      this.helpNavContent(arrOfUrl);
    } else if (arrOfUrl[2] === 'account-and-personal-info') {
      this.accountAndPersonalNavContent(arrOfUrl);
    } else {
      this.smallDeviceContent.title = this.tabNavContent.landingPage.more;
    }
  }

  accountAndPersonalNavContent(arrOfUrl: string[]) {
    if (
      arrOfUrl[3] === 'edit-display-name' ||
      arrOfUrl[3] === 'edit-email' ||
      arrOfUrl[3] === 'edit-phone'
    ) {
      const title = this.content.headerNames.filter(
        data => data.path === arrOfUrl[3]
      )[0].text;
      this.smallDeviceContent.title = title;
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage =
        '/more/account-and-personal-info/account-info';
    } else {
      const title = this.menuOption.option.filter(
        data => data.url === arrOfUrl[2]
      )[0].text;
      this.smallDeviceContent.title = title;
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage = '/more';
    }
  }

  helpNavContent(arrOfUrl: string[]) {
    const helpCategoryData = this.myVoyageHeaderService.getCategoryData();
    if (arrOfUrl[3] === 'help-content') {
      if (helpCategoryData) {
        this.smallDeviceContent.title = helpCategoryData.title;
        this.smallDeviceContent.isBackBtn = true;
        this.smallDeviceContent.previousPage = '/more/help';
      } else {
        this.router.navigateByUrl('/more/help');
      }
    } else {
      const title = this.menuOption.option.filter(
        data => data.url === arrOfUrl[2]
      )[0].text;
      this.smallDeviceContent.title = title;
      this.smallDeviceContent.isBackBtn = true;
      this.smallDeviceContent.previousPage = '/more/menu';
    }
  }

  handleBackClick(url: string) {
    if (this.selectedTab === 'LIFE_EVENTS') {
      this.journeyService.publishLeaveJourney();
    }
    if (url) {
      this.router.navigateByUrl(url);
    } else {
      this.headerTypeService.backToPrevious();
    }
  }

  checkForNewMsgs() {
    this.subscription.add(
      this.myVoyageHeaderService.getNotificationCount().subscribe(data => {
        this.numberOfNotifications = data.newNotificationCount;
      })
    );
  }

  goToNotification() {
    this.router.navigate(['notification'], {
      queryParams: {previousRootPath: this.rootPath},
    });
    this.numberOfNotifications = 0;
  }

  fetchCurrentRootPath(url) {
    const arrOfUrl = url.split('/');
    if (arrOfUrl[1] === 'journeys') {
      if (arrOfUrl[4]?.split('?')[0] === 'steps') {
        this.rootPath = '';
      } else {
        this.rootPath = 'journeys-list';
      }
    } else {
      this.rootPath = arrOfUrl[1];
    }
    if (this.rootPath === 'notification') {
      this.numberOfNotifications = 0;
    }
  }

  ngOnDestroy() {
    this.myVoyageHeaderService.clearCountInterval();
    this.subscription.unsubscribe();
  }
}
