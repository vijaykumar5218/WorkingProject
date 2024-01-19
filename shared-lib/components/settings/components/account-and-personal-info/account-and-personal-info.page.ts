import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component, OnInit} from '@angular/core';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';
import * as pageText from './constants/persionalInfo.json';
import {Router} from '@angular/router';
import {PersonalInfoTab} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'app-account-and-personal-info',
  templateUrl: './account-and-personal-info.page.html',
  styleUrls: ['./account-and-personal-info.page.scss'],
})
export class AccountAndPersonalInfoPage implements OnInit {
  actionOption: ActionOptions = {
    headername: 'Personal & Account Info',
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: 'settings',
    },
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };

  tabs: SubHeaderTab[] = [];
  selectedTab = 'account-info';
  isWeb: boolean;
  content: PersonalInfoTab = (pageText as any).default;

  constructor(
    private headerType: HeaderTypeService,
    private router: Router,
    private sharedUtilityService: SharedUtilityService
  ) {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  ngOnInit(): void {
    this.tabs.push({
      label: this.content.tabslabel.persionalInfo,
      link: 'personal-info',
    });
    this.tabs.push({
      label: this.content.tabslabel.accountInfo,
      link: 'account-info',
    });
  }

  ionViewWillEnter() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    const rootPath = this.isWeb ? 'more' : 'settings';
    if (this.selectedTab == 'personal-info') {
      this.router.navigateByUrl(
        `${rootPath}/account-and-personal-info/personal-info`
      );
    } else {
      this.router.navigateByUrl(
        `${rootPath}/account-and-personal-info/account-info`
      );
    }
  }

  handleClick(selectedTab: SubHeaderTab) {
    this.selectedTab = selectedTab.link;
  }
}
