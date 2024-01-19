import {MoreDescription} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component} from '@angular/core';
import * as contactText from './constants/contactPage.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {SettingsDisplayFlags} from '../../../../services/settings/models/settings.model';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AccountService} from '@shared-lib/services/account/account.service';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-contact-a-coach',
  templateUrl: './contact-a-coach.page.html',
  styleUrls: ['./contact-a-coach.page.scss'],
})
export class ContactACoachPage {
  pageText = JSON.parse(JSON.stringify(contactText)).default;
  subscription = new Subscription();
  screenMessage: MoreDescription;
  settingsDisplayFlags: SettingsDisplayFlags;
  isWorkplaceDashboard: boolean;
  loading = true;
  hideHeader: boolean;
  routingURL: string;
  actionOption: ActionOptions = {
    headername: this.pageText.actionOptions.header,
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: this.pageText.actionOptions.buttonLeft,
    },
    buttonRight: {
      name: '',
      link: this.pageText.actionOptions.buttonRight,
    },
  };
  isWeb: boolean;
  suppressAppointment: boolean;

  constructor(
    private headerType: HeaderTypeService,
    private accountInfoService: AccountInfoService,
    private sharedUtilityService: SharedUtilityService,
    private settingsService: SettingsService,
    private router: Router,
    private location: Location,
    private accountService: AccountService,
    private accessService: AccessService
  ) {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  async ngOnInit() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.routerNavigation();
    this.fetchScreenContent();
    this.subscription.add(
      this.accessService
        .isMyWorkplaceDashboardEnabled()
        .subscribe(isEnabled => {
          this.isWorkplaceDashboard = isEnabled;
        })
    );
    this.settingsDisplayFlags = await this.settingsService.getSettingsDisplayFlags();
  }

  routerNavigation(): void {
    const routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const arrOfUrl = event['url'].split('/');
        if (arrOfUrl[1] === 'journeys' && arrOfUrl[2] === 'contact-a-coach') {
          this.hideHeader = true;
        }
      });
    this.subscription.add(routerSubscription);
  }

  fetchScreenContent() {
    this.subscription.add(
      this.accountInfoService.getScreenMessage().subscribe(data => {
        this.screenMessage = data;
        this.loading = false;
      })
    );
  }

  openTimeTapUrl() {
    this.settingsDisplayFlags.suppressAppointment
      ? this.openPWEBLink(this.settingsDisplayFlags.pwebStatementUrl)
      : this.openDrirectLink(this.screenMessage.TimetapURL);
  }

  openDrirectLink(link: string) {
    if (this.isWeb) {
      window.open(link, '_blank');
    } else {
      this.accountService.openInAppBrowser(link);
    }
  }

  openPWEBLink(link: string) {
    this.accountService.openPwebAccountLink(decodeURIComponent(link));
  }

  closeDialog() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
