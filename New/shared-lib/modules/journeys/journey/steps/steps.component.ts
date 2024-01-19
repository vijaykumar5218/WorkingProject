import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {Router} from '@angular/router';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import Swiper from 'swiper';
import {Status} from '@shared-lib/constants/status.enum';
import {
  JourneyStep,
  SwipeEnabledEvent,
  ContinueEvent,
  Journey,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {Keyboard, KeyboardPlugin} from '@capacitor/keyboard';
import {ViewWillEnter, ViewWillLeave, ViewDidEnter} from '@ionic/angular';
import {ProgressBarStep} from '@shared-lib/components/step-progress-bar/models/step-progress-bar-model';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Subscription} from 'rxjs';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';

@Component({
  selector: 'journeys-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsComponent
  implements OnInit, ViewWillEnter, ViewWillLeave, ViewDidEnter {
  @ViewChildren('journeyStep', {read: ElementRef}) stepEls: QueryList<
    ElementRef
  >;
  currentStep = 0;
  steps: JourneyStep[];
  progressBarSteps: ProgressBarStep[];
  journey: Journey;
  slideOpts: Record<string, number | boolean | string> = {};
  slides: Swiper;
  keyboard: KeyboardPlugin = Keyboard;
  private subscription = new Subscription();
  private updateStatuses = true;
  private refreshJourneyStatusPublisher: Publisher;
  isWeb: boolean;
  private scrollToTopPublisher: Publisher;
  private swipeEnabledList: boolean[];
  private stepToSave: number;
  private saveLastStep = true;

  constructor(
    private footerService: FooterTypeService,
    private journeyService: JourneyService,
    private ngZone: NgZone,
    private router: Router,
    private eventManager: EventManagerService,
    private eventTracking: EventTrackingService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit(): void {
    this.isWeb = this.utilityService.getIsWeb();
    this.slideOpts = this.isWeb
      ? {
          slidesPerView: 1,
          centeredSlides: true,
          spaceBetween: 50,
          noSwipingSelector: 'ion-range',
          longSwipes: true,
          longSwipesMs: 100,
          longSwipesRatio: 0.1,
          shortSwipes: false,
        }
      : {
          slidesPerView: 1.1,
          centeredSlides: true,
          spaceBetween: 10,
          noSwipingSelector: 'ion-range',
        };
    this.subscription.add(
      this.eventManager
        .createSubscriber(eventKeys.leaveJourney)
        .subscribe(() => {
          this.leaveJourney();
        })
    );
    this.refreshJourneyStatusPublisher = this.eventManager.createPublisher(
      eventKeys.refreshJourneyStatus
    );
    this.scrollToTopPublisher = this.eventManager.createPublisher(
      eventKeys.journeyStepsScrollToTop
    );
    this.subscription.add(
      this.journeyService.fetchJourneys().subscribe(() => {
        const currentJourney = this.journeyService.getCurrentJourney();
        if (this.journey && this.journey !== currentJourney) {
          this.journey = this.journeyService.getCurrentJourney();
          this.steps = this.journey.steps;
        }
      })
    );
  }

  ionViewWillEnter() {
    this.footerService.publish({type: FooterType.none});
    this.journeyService.publishSelectedTab('steps');
    this.journey = this.journeyService.getCurrentJourney();
    this.steps = this.journey.steps;
    this.swipeEnabledList = Array(this.steps.length).fill(true);
    this.progressBarSteps = JSON.parse(
      JSON.stringify(Array(this.steps.length).fill({status: Status.notStarted}))
    );
    if (this.steps && this.steps.length > 0) {
      this.updateStepStatuses(0, undefined, false);
      if (this.isWeb) {
        this.refreshJourneyStatusPublisher.publish(undefined);
      }
    }
    this.journeyService.publishCurrentStep(this.currentStep);
    this.saveLastStep = true;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.slides.slideTo(this.journey.lastModifiedStepIndex, 0);
      for (let i = 0; i < this.journey.lastModifiedStepIndex; i++) {
        this.progressBarSteps[i] = {status: Status.completed};
      }
    }, 100);
  }

  setSwiperInstance(swiper: Swiper) {
    this.slides = swiper;
    if (this.swipeEnabledList) {
      this.slides.allowTouchMove = this.swipeEnabledList[this.currentStep];
    }
  }

  handleSlideChange() {
    this.ngZone.run(() => {
      if (!this.isWeb) {
        this.keyboard.hide();
      }
      const currentStepIndex = this.slides
        ? this.slides.activeIndex
        : (this.slideOpts.initialSlide as number);
      if (currentStepIndex === this.steps.length) {
        this.updateStepStatuses(this.currentStep);
        this.finishJourney();
        return;
      }
      this.updateStepStatuses(currentStepIndex);
      this.currentStep = currentStepIndex;
      if (this.slides) {
        this.slides.allowTouchMove = this.swipeEnabledList[this.currentStep];
      }
      this.journeyService.publishCurrentStep(this.currentStep);
      if (this.isWeb) {
        this.scrollToTopPublisher.publish(undefined);
      }
    });
  }

  updateStepStatuses(
    newIndex: number,
    prevIndex = this.currentStep,
    isCompleted = true
  ): void {
    if (this.updateStatuses) {
      const stepsToSave = [];
      if (isCompleted) {
        const completedStep = this.getUpdatedCompleteStep(prevIndex);
        if (completedStep) {
          stepsToSave.push(this.journeyService.removeContent(completedStep));
        }
      }

      if (!this.steps[newIndex].status) {
        if (newIndex === 0) {
          this.eventTracking.eventTracking({
            eventName: 'Journey Not Completed',
            journeyID: this.journey.journeyID,
            journeyName: this.journey.journeyName,
          });
        }
        this.steps[newIndex].status = Status.inProgress;
        stepsToSave.push(
          this.journeyService.removeContent(this.steps[newIndex])
        );
      }
      this.saveProgress(stepsToSave);
      this.journeyService.updateJourneySteps(
        this.steps,
        this.journey.journeyID
      );
      if (newIndex > 0) {
        this.progressBarSteps[newIndex - 1].status = Status.completed;
      }
      this.progressBarSteps[newIndex].status = Status.notStarted;
    }
    this.updateStatuses = true;
  }

  private getUpdatedCompleteStep(index: number): JourneyStep {
    let journeyStep;
    if (
      this.steps[index].status !== Status.completed ||
      this.steps[index].answer !== JSON.stringify(this.steps[index].value)
    ) {
      if (
        this.steps[index].status !== Status.completed &&
        index === this.steps.length - 1
      ) {
        this.eventTracking.eventTracking({
          eventName: 'Journey Not Completed',
          journeyID: this.journey.journeyID,
          updateInd: 'Y',
          journeyName: this.journey.journeyName,
        });
      }
      this.steps[index].status = Status.completed;
      if (this.steps[index].value && this.steps[index].value !== {})
        this.steps[index].answer = JSON.stringify(this.steps[index].value);
      journeyStep = this.steps[index];
    }
    return journeyStep;
  }

  saveProgress(steps: JourneyStep[]) {
    if (steps.length > 0) {
      this.journeyService.saveProgress(steps);
    }
  }

  handleContinueClick(event: ContinueEvent) {
    if (this.currentStep < this.steps.length - 1) {
      this.slides.slideNext();
    } else {
      this.updateStepStatuses(this.currentStep);
      if (event.route) {
        this.finishJourney();
      } else {
        this.leaveJourney();
      }
    }
  }

  handleBackClick() {
    if (this.currentStep !== 0) {
      this.slides.slideTo(this.currentStep - 1);
    }
  }

  finishJourney() {
    this.stepToSave = 0;
    this.leaveJourney();
    if (this.journeyService.isSummaryStepCompleted()) {
      if (!this.isWeb) {
        this.router.navigateByUrl(
          '/journeys/journey/' + this.journey.journeyID + '/overview'
        );
      } else {
        this.refreshJourneyStatusPublisher.publish(undefined);
        this.router.navigate(
          ['/journeys/journey/' + this.journey.journeyID + '/overview'],
          {
            queryParams: {journeyType: 'all'},
          }
        );
      }
    } else {
      this.router.navigateByUrl('/journeys');
    }
  }

  scrollToTop() {
    if (!this.isWeb) {
      this.stepEls.get(this.currentStep).nativeElement.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'end',
      });
    }
  }

  updateSwipeEnabled(swipeEnabledEvent: SwipeEnabledEvent) {
    this.swipeEnabledList[swipeEnabledEvent.index] =
      swipeEnabledEvent.swipeEnabled;
    if (this.slides) {
      this.slides.allowTouchMove = this.swipeEnabledList[this.currentStep];
    }
  }

  leaveJourney() {
    if (this.journey) {
      this.journeyService.updateJourneySteps(
        this.steps,
        this.journey.journeyID
      );
      this.updateStatuses = false;
      if (this.saveLastStep) {
        this.saveLastStep = false;
        const stepToSave =
          this.stepToSave || this.stepToSave === 0
            ? this.stepToSave
            : this.currentStep;
        this.saveProgress([
          this.journeyService.removeContent(this.steps[stepToSave]),
        ]);
        this.journey.lastModifiedStepIndex = stepToSave;
        this.journeyService.setCurrentJourney(this.journey, true);
        this.stepToSave = undefined;
      }
    }
  }

  updateStep(value: Record<string, string | string[]>, i: number) {
    this.steps[i].value = value;
    this.journeyService.updateJourneySteps(
      this.steps,
      this.journey.journeyID,
      false
    );
  }

  ionViewWillLeave() {
    this.leaveJourney();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.isWeb) {
      this.leaveJourney();
    }
  }
}
