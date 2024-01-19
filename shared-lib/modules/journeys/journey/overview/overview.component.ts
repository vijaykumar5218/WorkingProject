import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  Journey,
  JourneyStep,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {ViewWillEnter, ViewWillLeave} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Observable, Subscription} from 'rxjs';
@Component({
  selector: 'journeys-overview',
  templateUrl: './overview.component.html',
  styleUrls: [],
})
export class OverviewComponent
  implements ViewWillEnter, ViewWillLeave, OnInit, OnDestroy {
  journey: Journey;
  showSummary: boolean;
  isWeb: boolean;
  private value: string;
  private leaveJourney$: Observable<void>;
  private subscription = new Subscription();

  constructor(
    private journeyService: JourneyService,
    private footerService: FooterTypeService,
    private sharedUtilityService: SharedUtilityService,
    private eventManagerService: EventManagerService
  ) {}

  ngOnInit() {
    this.isWeb = this.sharedUtilityService.getIsWeb();
    this.leaveJourney$ = this.eventManagerService.createSubscriber(
      eventKeys.leaveJourney
    );
    this.subscription.add(
      this.leaveJourney$.subscribe(() => {
        this.saveValue();
      })
    );
  }

  ionViewWillEnter() {
    if (!this.isWeb) {
      this.footerService.publish({
        type: FooterType.tabsnav,
        selectedTab: 'journeys',
      });
    } else {
      this.footerService.publish({
        type: FooterType.tabsnav,
        selectedTab: 'journeys-list',
      });
    }
    this.journeyService.publishSelectedTab('overview');
    this.journey = this.journeyService.getCurrentJourney();
    if (
      this.journeyService.getAddAccount() &&
      this.journeyService.getAddAccount() === 'true'
    ) {
      this.journeyService.journeyServiceMap[
        this.journey.journeyID
      ].setAccountLinkFlag(this.journey.journeyID);
      this.journeyService.setAddAccount('false');
    }
    this.setShowSummary();
  }

  setShowSummary() {
    this.showSummary = this.journeyService.isSummaryStepCompleted();
  }

  updateValue(value: string) {
    this.value = value;
  }

  private saveValue() {
    if (this.value) {
      const firstStep: JourneyStep = this.journey.steps[0];
      if (firstStep.answer) {
        const value = this.journeyService.safeParse(firstStep.answer) as Record<
          string,
          string
        >;
        value.summary = this.value;
        firstStep.value = value;
      } else {
        firstStep.value = {summary: this.value};
      }
      firstStep.answer = JSON.stringify(firstStep.value);
      this.journeyService.updateJourneySteps(
        this.journey.steps,
        this.journey.journeyID
      );
      this.journeyService.saveProgress([
        this.journeyService.removeContent(firstStep),
      ]);
    }
  }

  ionViewWillLeave() {
    this.saveValue();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
