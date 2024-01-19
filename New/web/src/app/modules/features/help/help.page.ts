import {Component, ElementRef, ViewChild} from '@angular/core';
import {HeaderTypeService} from '../../shared/services/header-type/header-type.service';
import pageText from './constants/pageText.json';
import webSettingsOptions from '@shared-lib/components/settings/constants/webSettingsOptions.json';
import {MenuConfig} from '@shared-lib/components/settings/components/menu/model/menuConfig.model';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map, startWith} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {HelpService} from '@shared-lib/services/help/help.service';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
@Component({
  selector: 'app-help',
  templateUrl: 'help.page.html',
  styleUrls: ['help.page.scss'],
})
export class HelpPage {
  menuConfig: MenuConfig = {items: []};
  webOptions = webSettingsOptions.option;
  selectedTab: string;
  help: string = pageText.help;
  subscription = new Subscription();
  myWorkplaceDashboardEnabled: boolean;
  @ViewChild('focusedElementHelp', {read: ElementRef})
  focusedElementHelp: ElementRef;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;

  constructor(
    private headerTypeService: HeaderTypeService,
    private router: Router,
    private helpService: HelpService,
    private settingsService: SettingsService,
    private accessService: AccessService,
    private sharedUtilityService: SharedUtilityService
  ) {}

  async ionViewWillEnter() {
    this.headerTypeService.publishSelectedTab('HELP_ITEMS');
    this.subscription.add(
      this.accessService
        .isMyWorkplaceDashboardEnabled()
        .subscribe(isEnabled => {
          this.myWorkplaceDashboardEnabled = isEnabled;
        })
    );
    this.routerNavigation();
    this.isfocusedOnRouterOutlet();
  }

  isfocusedOnRouterOutlet() {
    this.subscription.add(
      this.helpService.isfocusedOnRouterOutlet().subscribe(() => {
        this.onFocusElement();
      })
    );
  }

  setMenuItems(displayContactLink: boolean, enableMyVoyage?: string) {
    const route = '/help/';
    this.menuConfig.items = [];
    for (const option of this.webOptions) {
      this.menuConfig.items.push({
        id: option.id,
        route: route + option.route,
        text: option.text,
        icon: option.icon,
      });
    }
    if (enableMyVoyage === 'N' || !displayContactLink) {
      this.menuConfig.items = this.menuConfig.items.filter(
        item => item.id !== 'contactAdvisor'
      );
    }
  }

  routerNavigation(): void {
    const routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(this.router),
        map((navigationEnd: NavigationEnd) => {
          return navigationEnd.url;
        })
      )
      .subscribe(url => {
        const arrOfUrl = url.split('/');
        this.fetchSelectedTab(arrOfUrl);
        if (
          arrOfUrl[2] === 'faq' &&
          arrOfUrl[3] === 'help-content' &&
          !this.helpService.getCategoryData()
        ) {
          this.router.navigateByUrl('help/faq');
        }
        this.sharedUtilityService.scrollToTop(this.topmostElement);
      });
    this.subscription.add(routerSubscription);
  }

  async fetchSelectedTab(arrOfUrl: string[]): Promise<void> {
    const {
      displayContactLink,
    } = await this.settingsService.getSettingsDisplayFlags();
    if (this.myWorkplaceDashboardEnabled) {
      const {enableMyVoyage} = await this.accessService.checkMyvoyageAccess();
      if (!displayContactLink || enableMyVoyage === 'N') {
        this.headerTypeService.publishSelectedTab('FAQS_NAVBAR_ITEM');
      }
      this.setMenuItems(displayContactLink, enableMyVoyage);
    } else {
      this.setMenuItems(displayContactLink);
    }
    this.selectedTab = `more-items-${
      this.menuConfig.items.find(
        item => item.route.split('/')[2] === arrOfUrl[2]
      )?.id
    }`;
  }

  onFocusElement(): void {
    const element = this.focusedElementHelp.nativeElement as HTMLElement;
    element.focus();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
