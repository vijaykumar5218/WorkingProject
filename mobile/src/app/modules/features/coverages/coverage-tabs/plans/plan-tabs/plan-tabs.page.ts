import {Component, OnInit} from '@angular/core';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import * as pageText from '@shared-lib/constants/coverage.json';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {
  DependentsData,
  Benefit,
} from '@shared-lib/services/benefits/models/benefits.model';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';

@Component({
  selector: 'app-plan-tabs',
  templateUrl: './plan-tabs.page.html',
  styleUrls: ['./plan-tabs.page.scss'],
})
export class PlanTabsPage implements OnInit {
  pageText: Record<string, string> = pageText;

  tabs: SubHeaderTab[] = [];

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
      link: this.pageText.backLink,
    },
  };

  selectedBenefit: Benefit;

  selectedTab = 'details';

  constructor(
    private headerType: HeaderTypeService,
    private footerType: FooterTypeService,
    private benefitsService: BenefitsService
  ) {}

  ngOnInit() {
    this.tabs.push({
      label: this.pageText.detailsLabel,
      link: 'details',
    });
  }

  dependent: DependentsData;

  tabChange() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.selectedBenefit = this.benefitsService.getSelectedBenefit();
    this.actionOption.headername = this.selectedBenefit.name;
    this.footerType.publish({type: FooterType.tabsnav});
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  handleClick(selectedTab: SubHeaderTab) {
    this.selectedTab = selectedTab.link;
  }
}
