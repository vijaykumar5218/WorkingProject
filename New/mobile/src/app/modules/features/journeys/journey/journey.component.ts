import {Component, OnInit} from '@angular/core';
import {IonTabs, ViewWillEnter, ViewWillLeave} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {Journey} from '@shared-lib/services/journey/models/journey.model';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
@Component({
  selector: 'journeys-journey-shared',
  templateUrl: './journey.component.html',
  styleUrls: ['../../../../../../../shared-lib/scss/tab-sub-header.scss'],
})
export class JourneyComponent implements OnInit, ViewWillEnter, ViewWillLeave {
  content: JourneyContent = (journeyContent as any).default;
  tabs: SubHeaderTab[] = [];
  private journey: Journey;
  selectedTab = 'steps';
  private selectedTabSubscription: Subscription;
  private activeTab: HTMLElement;

  constructor(
    private journeyService: JourneyService,
    private headerType: HeaderTypeService
  ) {}

  ngOnInit() {
    this.tabs = this.journeyService.fetchTabs([
      'overview',
      'steps',
      'resources',
    ]);
    this.selectedTabSubscription = this.journeyService
      .getSelectedTab$()
      .subscribe((selectedTab: string) => {
        this.selectedTab = selectedTab;
      });
  }

  ionViewWillEnter() {
    this.journey = this.journeyService.getCurrentJourney();
    const actionOption: ActionOptions = {
      headername: this.journey.parsedLandingAndOverviewContent.intro.header,
      btnright: true,
      buttonRight: {
        name: '',
        link: 'notification',
      },
      btnleft: true,
      buttonLeft: {
        name: '',
        link: 'journeys',
      },
    };
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: actionOption,
    });
    this.propagateToActiveTab('ionViewWillEnter');
  }

  handleClick(selectedTab: string) {
    this.selectedTab = selectedTab;
  }

  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
    this.journeyService.publishLeaveJourney();
  }

  tabChange(tabsRef: IonTabs) {
    this.activeTab = tabsRef.outlet.activatedView.element;
  }

  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }

  ngOnDestroy() {
    this.selectedTabSubscription.unsubscribe();
  }
}
