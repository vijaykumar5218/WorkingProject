import {Component, OnInit} from '@angular/core';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import * as loginText from './constants/retirement-account.json';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';

@Component({
  selector: 'app-retirement-account',
  templateUrl: './retirement-account.page.html',
  styleUrls: ['../../../../../../../shared-lib/scss/tab-sub-header.scss'],
})
export class RetirementAccountPage implements OnInit {
  logText: Record<string, Record<string, string>> = JSON.parse(
    JSON.stringify(loginText)
  ).default;
  account: Account;
  actionOption: ActionOptions = {
    headername: '',
    btnright: true,
    btnleft: true,
    buttonRight: {
      name: '',
      link: 'notification',
    },
    buttonLeft: {
      name: '',
      link: 'account',
    },
  };
  tabs: SubHeaderTab[] = [];
  selectedTab = 'info';

  constructor(
    private headerType: HeaderTypeService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.tabs.push({label: this.logText.tabslabel.info, link: 'info'});
    this.tabs.push({
      label: this.logText.tabslabel.transactions,
      link: 'transactions',
    });
    this.tabs.push({label: '', link: ''});
  }

  ionViewWillEnter() {
    this.account = this.accountService.getAccount();
    this.actionOption.headername = this.account.accountTitle;
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  handleClick(selectedTab: SubHeaderTab) {
    this.selectedTab = selectedTab.link;
  }
}
