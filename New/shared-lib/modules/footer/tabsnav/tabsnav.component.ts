import {Component, Input, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {SharedUtilityService} from '../../../services/utility/utility.service';
import {FooterInfo} from '../models/footerInfo.model';
import * as pageText from './constants/tabsnav-text.json';
import {TabsNavText} from './models/tabsnav-text.model';

@Component({
  selector: 'app-tabsnav',
  templateUrl: './tabsnav.component.html',
  styleUrls: ['./tabsnav.component.scss'],
})
export class TabsnavPage {
  content: TabsNavText = (pageText as any).default;
  isWeb: boolean;

  selectedTab = 'home';
  @Input() info: FooterInfo;
  config: {text: string; route: string; icon: string}[];

  constructor(
    private router: Router,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    if (this.isWeb) {
      this.config = [
        {
          text: this.content.landingPage.home,
          route: 'home',
          icon: 'assets/icon/tabsnav/home',
        },
        {
          text: this.content.landingPage.accounts,
          route: 'accounts',
          icon: 'assets/icon/tabsnav/accounts',
        },
        {
          text: this.content.landingPage.coverages,
          route: 'coverages',
          icon: 'assets/icon/tabsnav/coverages',
        },
        {
          text: this.content.landingPage.journeys,
          route: 'journeys-list',
          icon: 'assets/icon/tabsnav/journeys',
        },
        {
          text: this.content.landingPage.more,
          route: 'more',
          icon: 'assets/icon/tabsnav/more',
        },
      ];
    } else {
      this.config = [
        // Tabsnav for App
        {
          text: this.content.landingPage.home,
          route: 'home',
          icon: 'assets/icon/tabsnav/home',
        },
        {
          text: this.content.landingPage.accounts,
          route: 'account',
          icon: 'assets/icon/tabsnav/accounts',
        },
        {
          text: this.content.landingPage.coverages,
          route: 'coverages',
          icon: 'assets/icon/tabsnav/coverages',
        },
        {
          text: this.content.landingPage.journeys,
          route: 'journeys',
          icon: 'assets/icon/tabsnav/journeys',
        },
        {
          text: this.content.landingPage.more,
          route: 'settings',
          icon: 'assets/icon/tabsnav/more',
        },
      ];
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.info?.currentValue?.selectedTab) {
      this.selectedTab = this.info.selectedTab;
    }
  }

  handleTabClick(route: string) {
    this.selectedTab = route;
    this.router.navigateByUrl(route);
  }
}
