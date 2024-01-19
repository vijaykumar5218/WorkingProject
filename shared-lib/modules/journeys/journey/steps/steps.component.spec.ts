import {Component, Input} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {Status} from '@shared-lib/constants/status.enum';
import Swiper from 'swiper';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {StepsComponent} from './steps.component';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {eventKeys} from '@shared-lib/constants/event-keys';

@Component({selector: 'journeys-steps-step', template: ''})
class MockJourneyStep {
  @Input() step;
  @Input() index;
}

@Component({selector: 'app-step-progress-bar', template: ''})
class MockStepProgressBar {
  @Input() steps;
  @Input() currentStep;
}

@Component({
  selector: 'swiper',
  template: '',
})
class MockSwiper {
  @Input() config;
}

describe('StepsComponent', () => {
  let component: StepsComponent;
  let fixture: ComponentFixture<StepsComponent>;
  let journeyServiceSpy;
  let steps;
  let updateStepStatusesSpy;
  let routerSpy;
  let footerTypeServiceSpy;
  let eventManagerSpy;
  let leaveJourneyObservableSpy;
  let leaveJourneySubscriptionSpy;
  let eventTrackingServiceSpy;
  let utilityServiceSpy;
  let publisherSpy;
  let fetchJourneysObservableSpy;
  let fetchJourneysSubscriptionSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'saveProgress',
        'updateJourneySteps',
        'publishCurrentStep',
        'isSummaryStepCompleted',
        'publishSelectedTab',
        'removeContent',
        'setCurrentJourney',
        'fetchJourneys',
      ]);
      fetchJourneysObservableSpy = jasmine.createSpyObj(
        'fetchJourneysObservable',
        ['subscribe']
      );
      fetchJourneysSubscriptionSpy = jasmine.createSpyObj(
        'fetchJourneysSubscription',
        ['unsubscribe']
      );
      fetchJourneysObservableSpy.subscribe.and.returnValue(
        fetchJourneysSubscriptionSpy
      );
      journeyServiceSpy.fetchJourneys.and.returnValue(
        fetchJourneysObservableSpy
      );
      steps = [
        {journeyStepName: '0', journeyStepTagId: 'tag0'},
        {journeyStepName: '1', journeyStepTagId: 'tag1'},
        {journeyStepName: '2', journeyStepTagId: 'tag2'},
        {journeyStepName: '3', journeyStepTagId: 'tag3'},
        {journeyStepName: '4', journeyStepTagId: 'tag4'},
        {journeyStepName: '5', journeyStepTagId: 'tag5'},
        {journeyStepName: '6', journeyStepTagId: 'tag6'},
        {journeyStepName: '7', journeyStepTagId: 'tag7'},
      ];
      journeyServiceSpy.getCurrentJourney.and.returnValue({
        steps: steps,
      });
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      eventManagerSpy = jasmine.createSpyObj('EventManager', [
        'createSubscriber',
        'createPublisher',
      ]);
      leaveJourneyObservableSpy = jasmine.createSpyObj(
        'leaveJourneyObservable',
        ['subscribe']
      );
      leaveJourneySubscriptionSpy = jasmine.createSpyObj(
        'leaveJourneySubscription',
        ['unsubscribe']
      );
      leaveJourneyObservableSpy.subscribe.and.returnValue(
        leaveJourneySubscriptionSpy
      );
      publisherSpy = jasmine.createSpyObj('Publisher', ['publish']);
      eventManagerSpy.createPublisher.and.returnValue(publisherSpy);
      eventManagerSpy.createSubscriber.and.returnValue(
        leaveJourneyObservableSpy
      );
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTracking',
      ]);
      TestBed.configureTestingModule({
        declarations: [
          StepsComponent,
          MockJourneyStep,
          MockStepProgressBar,
          MockSwiper,
        ],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: EventManagerService, useValue: eventManagerSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(StepsComponent);
      component = fixture.componentInstance;
      updateStepStatusesSpy = spyOn(component, 'updateStepStatuses');
      spyOn(component['subscription'], 'add');
      fixture.detectChanges();
      component.steps = steps;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let journey;

    beforeEach(() => {
      journey = {journeyID: 1, lastModifiedStepIndex: 0, steps: [{}, {}]};
      journeyServiceSpy.getCurrentJourney.and.returnValue(journey);
    });

    it('When isWeb would be false', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.ngOnInit();
      expect(component.isWeb).toEqual(false);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.slideOpts).toEqual({
        slidesPerView: 1.1,
        centeredSlides: true,
        spaceBetween: 10,
        noSwipingSelector: 'ion-range',
      });
    });
    it('When isWeb would be true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(component.slideOpts).toEqual({
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 50,
        noSwipingSelector: 'ion-range',
        longSwipes: true,
        longSwipesMs: 100,
        longSwipesRatio: 0.1,
        shortSwipes: false,
      });
    });

    it('should subscribe to leaveJourney', () => {
      expect(leaveJourneyObservableSpy.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(
        leaveJourneySubscriptionSpy
      );
    });

    it('should call leaveJourney for leaveJourney event', () => {
      leaveJourneyObservableSpy.subscribe.and.callFake(f => f());
      spyOn(component, 'leaveJourney');
      component.ngOnInit();
      expect(component.leaveJourney).toHaveBeenCalled();
    });

    it('should subscribe to fetchJourneys', () => {
      expect(fetchJourneysObservableSpy.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(
        fetchJourneysSubscriptionSpy
      );
    });

    it('should update the journey if it is set and changes', () => {
      component.journey = {
        journeyID: 2,
        lastModifiedStepIndex: 0,
        journeyName: 'journeyName',
      };
      fetchJourneysObservableSpy.subscribe.and.callFake(f => f());
      component.ngOnInit();
      expect(component.journey).toEqual(journey);
      expect(component.journey.steps).toEqual(journey.steps);
    });

    it('should not update the journey if it is not set', () => {
      component.journey = undefined;
      fetchJourneysObservableSpy.subscribe.and.callFake(f => f());
      component.ngOnInit();
      expect(component.journey).toBeUndefined();
    });

    it('should not update the journey if it is the same', () => {
      component.journey = journey;
      fetchJourneysObservableSpy.subscribe.and.callFake(f => f());
      component.ngOnInit();
      expect(component.journey).toEqual(journey);
    });

    it('should call createPublisher for refresh journey status', () => {
      expect(eventManagerSpy.createPublisher).toHaveBeenCalledWith(
        eventKeys.refreshJourneyStatus
      );
    });

    it('should call createPublisher for scroll to top', () => {
      expect(eventManagerSpy.createPublisher).toHaveBeenCalledWith(
        eventKeys.journeyStepsScrollToTop
      );
    });
  });

  describe('ionViewWillEnter', () => {
    it('should publish the footer type', () => {
      component.ionViewWillEnter();
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.none,
      });
    });

    it('should publish the selectedTab', () => {
      component.ionViewWillEnter();
      expect(journeyServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'steps'
      );
    });

    it('should get the steps', () => {
      component.ionViewWillEnter();
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      expect(component.steps).toEqual(steps);
    });

    it('should call updateStepStatuses if there are steps', () => {
      component.ionViewWillEnter();
      expect(component.updateStepStatuses).toHaveBeenCalledWith(
        0,
        undefined,
        false
      );
    });

    it('should publish refreshJourneyStatusPublisher if isWeb would be true and there are steps', () => {
      component.isWeb = true;
      component.ionViewWillEnter();
      expect(publisherSpy.publish).toHaveBeenCalled();
    });

    it('should not publish refreshJourneyStatusPublisher if isWeb would be false and there are steps', () => {
      component.isWeb = false;
      component.ionViewWillEnter();
      expect(publisherSpy.publish).not.toHaveBeenCalled();
    });

    it('should publish the currentStep', () => {
      component.ionViewWillEnter();
      expect(journeyServiceSpy.publishCurrentStep).toHaveBeenCalledWith(0);
    });

    it('should set saveLastStep to true', () => {
      component['saveLastStep'] = false;
      component.ionViewWillEnter();
      expect(component['saveLastStep']).toBeTrue();
    });
  });

  describe('ionViewDidEnter', () => {
    beforeEach(() => {
      component.slides = {slideTo: jasmine.createSpy()} as any;
    });

    it('should slide to the last modified step and update the progress bar array', fakeAsync(() => {
      component.journey = {
        journeyID: 5,
        lastModifiedStepIndex: 2,
        journeyName: 'journeyName',
      };
      component.progressBarSteps = JSON.parse(
        JSON.stringify(Array(5).fill({status: Status.notStarted}))
      );
      component.ionViewDidEnter();
      tick(100);
      expect(component.slides.slideTo).toHaveBeenCalledWith(2, 0);
      expect(component.progressBarSteps).toEqual([
        {status: Status.completed},
        {status: Status.completed},
        {status: Status.notStarted},
        {status: Status.notStarted},
        {status: Status.notStarted},
      ]);
    }));
  });

  describe('setSwiperInstance', () => {
    it('should set slides to swiper and set allowTouchMove', () => {
      component.slides = undefined;
      const swiper = new Swiper(undefined, undefined);
      swiper.allowTouchMove = undefined;
      component['swipeEnabledList'] = [true];
      component.setSwiperInstance(swiper);
      expect(component.slides).toEqual(swiper);
      expect(component.slides.allowTouchMove).toBeTrue();
    });

    it('should not modify allowTouchMove if swipeEnabledList is not set yet', () => {
      component.slides = undefined;
      const swiper = new Swiper(undefined, undefined);
      swiper.allowTouchMove = true;
      component['swipeEnabledList'] = undefined;
      component.setSwiperInstance(swiper);
      expect(component.slides.allowTouchMove).toBeTrue();
    });
  });

  describe('handleSlideChange', () => {
    let currentIndex;
    let runSpy;
    beforeEach(() => {
      currentIndex = 5;
      component.slides = {activeIndex: currentIndex} as any;
      runSpy = spyOn(component['ngZone'], 'run').and.callFake(f => f());
      component.keyboard = jasmine.createSpyObj('keyboard', ['hide']);
      component['swipeEnabledList'] = Array(6).fill(false);
    });

    it('should call ngZone run to run the function in the zone', () => {
      component.handleSlideChange();
      expect(runSpy).toHaveBeenCalled();
    });

    it('should hide the keyboard if its mobile', () => {
      component.isWeb = false;
      component.handleSlideChange();
      expect(component.keyboard.hide).toHaveBeenCalled();
    });

    it('should not hide the keyboard if its web', () => {
      component.isWeb = true;
      component.handleSlideChange();
      expect(component.keyboard.hide).not.toHaveBeenCalled();
    });

    it('should call leaveJourney and return if currentStepIndex === steps.length', () => {
      component.slides.activeIndex = 8;
      component.currentStep = 7;
      spyOn(component, 'leaveJourney');
      component.handleSlideChange();
      expect(component.leaveJourney).toHaveBeenCalled();
      expect(component.updateStepStatuses).toHaveBeenCalledWith(7);
    });

    it('should update the current step using slides active index if its set', () => {
      component.currentStep = 0;
      component.slides.allowTouchMove = true;
      component.handleSlideChange();
      expect(component.currentStep).toEqual(currentIndex);
      expect(component.slides.allowTouchMove).toBeFalse();
    });

    it('should update the current step using initial slide if slides is not set', () => {
      component.currentStep = 0;
      component.slideOpts = {
        initialSlide: 10,
      };
      component.slides = undefined;
      component.handleSlideChange();
      expect(component.currentStep).toEqual(10);
    });

    it('should call updateStepStatuses with the new index', () => {
      component.handleSlideChange();
      expect(component.updateStepStatuses).toHaveBeenCalledWith(currentIndex);
    });

    it('should publish the current step', () => {
      component.handleSlideChange();
      expect(journeyServiceSpy.publishCurrentStep).toHaveBeenCalledWith(
        currentIndex
      );
    });

    it('should publish scrollToTopPublisher if isWeb would be true', () => {
      component.isWeb = true;
      component.handleSlideChange();
      expect(publisherSpy.publish).toHaveBeenCalled();
    });

    it('should not publish scrollToTopPublisher if isWeb would be false', () => {
      component.isWeb = false;
      component.handleSlideChange();
      expect(publisherSpy.publish).not.toHaveBeenCalled();
    });
  });

  describe('updateStepStatuses', () => {
    beforeEach(() => {
      journeyServiceSpy.removeContent.and.callFake(step => {
        const stepCopy = JSON.parse(JSON.stringify(step));
        delete stepCopy.content;
        return stepCopy;
      });
      updateStepStatusesSpy.and.callThrough();
      spyOn(component, 'saveProgress');
      component.progressBarSteps = JSON.parse(
        JSON.stringify(
          Array(component.steps.length).fill({status: Status.notStarted})
        )
      );
      component.journey = {
        journeyID: 5,
        lastModifiedStepIndex: 0,
        journeyName: 'journeyName',
      };
    });

    it('should save the previous step if updateStatuses is true, isCompleted is true and its not already completed', () => {
      component['updateStatuses'] = true;
      component.currentStep = 0;
      component.steps[0].status = Status.inProgress;
      component.steps[0].value = {retirementAge: '55'};
      component.steps[0].answer = undefined;
      component.steps[0].content = {};
      component.steps[1].status = Status.inProgress;
      component.updateStepStatuses(1);
      expect(component.steps[0].status).toEqual(Status.completed);
      expect(component.steps[0].answer).toEqual(
        JSON.stringify({retirementAge: '55'})
      );
      delete component.steps[0].content;
      expect(journeyServiceSpy.removeContent).toHaveBeenCalledWith(
        component.steps[0]
      );
      expect(component.saveProgress).toHaveBeenCalledWith([component.steps[0]]);
    });

    it('should track the journey completion if the last step is completed for the first time', () => {
      component['updateStatuses'] = true;
      component.currentStep = 7;
      component.steps[7].status = Status.inProgress;
      component.journey = {
        journeyID: 2,
        lastModifiedStepIndex: 0,
        journeyName: 'Journey Name',
      };
      component.updateStepStatuses(7);
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith({
        eventName: 'Journey Not Completed',
        journeyID: 2,
        updateInd: 'Y',
        journeyName: 'Journey Name',
      });
    });

    it('should not track the journey completion if the last step is already completed even if the answer changed', () => {
      component['updateStatuses'] = true;
      component.currentStep = 7;
      component.steps[7].status = Status.completed;
      component.steps[7].answer = undefined;
      component.steps[7].value = {retirementAge: '65'};
      component.updateStepStatuses(7);
      expect(eventTrackingServiceSpy.eventTracking).not.toHaveBeenCalled();
    });

    it('should not track the journey completion if it is not the last step', () => {
      component['updateStatuses'] = true;
      component.currentStep = 6;
      component.steps[6].status = Status.inProgress;
      component.updateStepStatuses(6);
      expect(eventTrackingServiceSpy.eventTracking).not.toHaveBeenCalled();
    });

    it('should not save the previous step if updateStatuses is false', () => {
      component['updateStatuses'] = false;
      component.currentStep = 0;
      component.steps[0].status = Status.inProgress;
      component.steps[0].value = {retirementAge: '55'};
      component.steps[0].answer = undefined;
      component.steps[1].status = Status.inProgress;
      component.updateStepStatuses(1);
      expect(component.steps[0].status).toEqual(Status.inProgress);
      expect(component.steps[0].answer).toBeUndefined();
      expect(component.saveProgress).not.toHaveBeenCalled();
    });

    it('should not save the previous step if isCompleted is false', () => {
      component.currentStep = 0;
      component.steps[0].status = Status.inProgress;
      component.steps[0].value = {retirementAge: '55'};
      component.steps[0].answer = undefined;
      component.steps[1].status = Status.inProgress;
      component.updateStepStatuses(1, undefined, false);
      expect(component.steps[0].status).toEqual(Status.inProgress);
      expect(component.steps[0].answer).toEqual(undefined);
      expect(component.saveProgress).toHaveBeenCalledWith([]);
      expect(component.progressBarSteps[0].status).toEqual(Status.completed);
    });

    it('should not save the previous step if isCompleted is true but it is already completed and the value has not changed', () => {
      component.currentStep = 0;
      component.steps[0].status = Status.completed;
      component.steps[0].value = {retirementAge: '55'};
      component.steps[0].answer = JSON.stringify({retirementAge: '55'});
      component.steps[0].answer = undefined;
      component.steps[1].status = Status.inProgress;
      component.updateStepStatuses(1);
      expect(component.steps[0].status).toEqual(Status.completed);
      expect(component.steps[0].answer).toEqual(
        JSON.stringify({retirementAge: '55'})
      );
      expect(component.saveProgress).toHaveBeenCalledWith([component.steps[0]]);
    });

    it('should save the previous step if isCompleted is true, it is already completed but the value has changed', () => {
      component.currentStep = 0;
      component.steps[0].status = Status.completed;
      component.steps[0].value = {retirementAge: '55'};
      component.steps[0].answer = JSON.stringify({retirementAge: '58'});
      component.steps[0].answer = undefined;
      component.steps[1].status = Status.inProgress;
      component.updateStepStatuses(1);
      expect(component.steps[0].status).toEqual(Status.completed);
      expect(component.steps[0].answer).toEqual(
        JSON.stringify({retirementAge: '55'})
      );
      expect(component.saveProgress).toHaveBeenCalledWith([component.steps[0]]);
    });

    it('should save the new step if the status was undefined before', () => {
      component.currentStep = 1;
      component.steps[1].status = undefined;
      component.updateStepStatuses(1);
      expect(component.steps[1].status).toEqual(Status.completed);
      expect(journeyServiceSpy.removeContent).toHaveBeenCalledWith(
        component.steps[1]
      );
      expect(component.saveProgress).toHaveBeenCalledWith([component.steps[1]]);
    });

    it('should track journey start event if first step is seen for the first time', () => {
      component.currentStep = 0;
      component.steps[0].status = undefined;
      component.journey = {
        journeyID: 2,
        lastModifiedStepIndex: 0,
        journeyName: 'journeyName',
      };
      component.updateStepStatuses(0, 0, false);
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith({
        eventName: 'Journey Not Completed',
        journeyID: 2,
        journeyName: 'journeyName',
      });
    });

    it('should not track journey start event if second step is seen for the first time', () => {
      component.currentStep = 0;
      component.steps[1].status = undefined;
      component.updateStepStatuses(1, 0, false);
      expect(eventTrackingServiceSpy.eventTracking).not.toHaveBeenCalled();
    });

    it('should not save the new step if the status was already set', () => {
      component.currentStep = 1;
      component.steps[1].status = Status.completed;
      component.updateStepStatuses(1);
      expect(component.steps[1].status).toEqual(Status.completed);
      expect(component.saveProgress).toHaveBeenCalledWith([]);
    });

    it('should call updateJourneySteps', () => {
      component.journey = {
        journeyID: 1,
        lastModifiedStepIndex: 0,
        journeyName: 'journeyName',
      };
      component.updateStepStatuses(1);
      expect(journeyServiceSpy.updateJourneySteps).toHaveBeenCalledWith(
        component.steps,
        1
      );
    });
  });

  describe('saveProgress', () => {
    it('should call journeyService to save progress if the steps have length > 0', () => {
      component.saveProgress(steps);
      expect(journeyServiceSpy.saveProgress).toHaveBeenCalledWith(steps);
    });

    it('should not call journeyService to save progress if the steps have length 0', () => {
      component.saveProgress([]);
      expect(journeyServiceSpy.saveProgress).not.toHaveBeenCalled();
    });
  });

  describe('handleContinueClick', () => {
    let event;

    beforeEach(() => {
      component.slides = {slideNext: jasmine.createSpy()} as any;
      spyOn(component, 'finishJourney');
      spyOn(component, 'leaveJourney');
      event = {route: true};
    });

    it('should call slideNext if its not the last step', () => {
      component.currentStep = 4;
      component.handleContinueClick(event);
      expect(component.slides.slideNext).toHaveBeenCalled();
      expect(component.updateStepStatuses).not.toHaveBeenCalled();
      expect(component.finishJourney).not.toHaveBeenCalled();
    });

    it('should call updateStepStatuses and finishJourney if it is the last step and route is true', () => {
      component.currentStep = 7;
      component.handleContinueClick(event);
      expect(component.slides.slideNext).not.toHaveBeenCalled();
      expect(component.updateStepStatuses).toHaveBeenCalledWith(7);
      expect(component.finishJourney).toHaveBeenCalled();
      expect(component.leaveJourney).not.toHaveBeenCalled();
    });

    it('should call leaveJourney if it is the last step and route is false', () => {
      component.currentStep = 7;
      event.route = false;
      component.handleContinueClick(event);
      expect(component.finishJourney).not.toHaveBeenCalled();
      expect(component.leaveJourney).toHaveBeenCalled();
    });
  });

  describe('handleBackClick', () => {
    beforeEach(() => {
      component.slides = {slideTo: jasmine.createSpy()} as any;
    });

    it('when currentStep would be 0', () => {
      component.currentStep = 0;
      component.handleBackClick();
      expect(component.slides.slideTo).not.toHaveBeenCalled();
    });

    it('when currentStep would not be 0', () => {
      component.currentStep = 1;
      component.handleBackClick();
      expect(component.slides.slideTo).toHaveBeenCalledWith(
        component.currentStep - 1
      );
    });
  });

  describe('finishJourney', () => {
    beforeEach(() => {
      spyOn(component, 'leaveJourney');
    });

    it('should set stepToSave to 0', () => {
      component['stepToSave'] = undefined;
      component.finishJourney();
      expect(component['stepToSave']).toEqual(0);
    });

    it('should call leaveJourney', () => {
      component.finishJourney();
      expect(component.leaveJourney).toHaveBeenCalled();
    });

    describe('should route to overview if it is the last step and isSummaryStepCompleted is true', () => {
      beforeEach(() => {
        component.currentStep = 7;
        journeyServiceSpy.isSummaryStepCompleted.and.returnValue(true);
        component.journey = {
          journeyID: 1,
          lastModifiedStepIndex: 0,
          journeyName: 'JourneyName',
        };
      });
      it('When isWeb would be false', () => {
        component.isWeb = false;
        component.finishJourney();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          '/journeys/journey/1/overview'
        );
        expect(publisherSpy.publish).not.toHaveBeenCalled();
      });
      it('When isWeb would be true', () => {
        component.isWeb = true;
        component.finishJourney();
        expect(publisherSpy.publish).toHaveBeenCalledWith(undefined);
        expect(routerSpy.navigate).toHaveBeenCalledWith(
          ['/journeys/journey/' + component.journey.journeyID + '/overview'],
          {
            queryParams: {journeyType: 'all'},
          }
        );
      });
    });

    it('should route to journeys if it is the last step and isSummaryStepCompleted is false', () => {
      component.currentStep = 7;
      journeyServiceSpy.isSummaryStepCompleted.and.returnValue(false);
      component.finishJourney();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/journeys');
    });
  });

  describe('leaveJourney', () => {
    let saveProgressSpy;

    beforeEach(() => {
      component.slides = jasmine.createSpyObj('slides', ['slideTo']);
      component.journey = {
        journeyID: 5,
        lastModifiedStepIndex: 0,
        journeyName: 'journeyName',
      };
      saveProgressSpy = spyOn(component, 'saveProgress');
      journeyServiceSpy.removeContent.and.callFake(step => step);
    });

    it('should not update the steps if the journey is not set', () => {
      component.journey = undefined;
      component.leaveJourney();
      expect(journeyServiceSpy.updateJourneySteps).not.toHaveBeenCalled();
    });

    it('should update the steps if the journey is set', () => {
      component.steps = steps;
      component.leaveJourney();
      expect(journeyServiceSpy.updateJourneySteps).toHaveBeenCalledWith(
        component.steps,
        5
      );
    });

    it('should set updateStatuses to false', () => {
      component['updateStatuses'] = true;
      component.leaveJourney();
      expect(component['updateStatuses']).toBeFalse();
    });

    it('should save the stepToSave if saveLastStep is true and stepToSave is set', () => {
      component['stepToSave'] = 5;
      component['saveLastStep'] = true;
      component.journey.lastModifiedStepIndex = undefined;
      component.leaveJourney();
      expect(component['saveLastStep']).toBeFalse();
      expect(journeyServiceSpy.removeContent).toHaveBeenCalledWith(
        component.steps[5]
      );
      expect(saveProgressSpy).toHaveBeenCalledWith([component.steps[5]]);
      expect(component.journey.lastModifiedStepIndex).toEqual(5);
      expect(journeyServiceSpy.setCurrentJourney).toHaveBeenCalledWith(
        component.journey,
        true
      );
      expect(component['stepToSave']).toBeUndefined();
    });

    it('should save the stepToSave if saveLastStep is true and stepToSave is 0', () => {
      component['stepToSave'] = 0;
      component['saveLastStep'] = true;
      component.journey.lastModifiedStepIndex = undefined;
      component.leaveJourney();
      expect(saveProgressSpy).toHaveBeenCalledWith([component.steps[0]]);
      expect(component.journey.lastModifiedStepIndex).toEqual(0);
    });

    it('should save the currentStep if saveLastStep is true and stepToSave is not set', () => {
      component['stepToSave'] = undefined;
      component.currentStep = 5;
      component['saveLastStep'] = true;
      component.journey.lastModifiedStepIndex = undefined;
      component.leaveJourney();
      expect(saveProgressSpy).toHaveBeenCalledWith([component.steps[5]]);
      expect(component.journey.lastModifiedStepIndex).toEqual(5);
    });
  });

  describe('template', () => {
    it('should display the progress bar', () => {
      expect(
        fixture.debugElement.query(By.css('app-step-progress-bar'))
      ).toBeTruthy();
    });

    it('should display the slides', () => {
      const swiper = fixture.debugElement.queryAll(By.css('swiper'));
      expect(swiper).toBeTruthy();
    });

    it('should call handleSlideChange for slideChange event', () => {
      const slides = fixture.debugElement.query(By.css('swiper'));
      spyOn(component, 'handleSlideChange');
      const event = new CustomEvent('slideChange');
      slides.nativeElement.dispatchEvent(event);
      expect(component.handleSlideChange).toHaveBeenCalled();
    });
  });

  describe('scrollToTop', () => {
    let stepElsSpy;
    let stepElMock;
    beforeEach(() => {
      stepElsSpy = jasmine.createSpyObj('stepEls', ['get']);
      stepElMock = {
        nativeElement: {
          scrollIntoView: jasmine.createSpy(),
        },
      };
      stepElsSpy.get.and.returnValue(stepElMock);
      component.stepEls = stepElsSpy;
    });
    it('should scroll to the top of the current step when isWeb would be false', () => {
      component.isWeb = false;
      component.currentStep = 1;
      component.scrollToTop();
      expect(component.stepEls.get).toHaveBeenCalledWith(1);
      expect(stepElMock.nativeElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'center',
        inline: 'end',
      });
    });
    it('should not scroll to the top of the current step when isWeb would be true', () => {
      component.isWeb = true;
      component.scrollToTop();
      expect(component.stepEls.get).not.toHaveBeenCalledTimes(2);
      expect(stepElMock.nativeElement.scrollIntoView).not.toHaveBeenCalledTimes(
        2
      );
    });
  });

  describe('updateSwipeEnabled', () => {
    it('should set the isSwipeEnabled property in case the slides are not loaded yet', () => {
      component.slides = undefined;
      component['isSwipeEnabled'] = undefined;
      component['swipeEnabledList'] = [false, false, true, false];
      component.updateSwipeEnabled({swipeEnabled: false, index: 2});
      expect(component['swipeEnabledList'][2]).toBeFalse();
    });

    it('should set the swipe enablement based on the event', () => {
      component.slides = jasmine.createSpyObj('slides', ['']);
      component.slides.allowTouchMove = undefined;
      component.currentStep = 2;
      component['swipeEnabledList'] = [false, false, true, false];
      component.updateSwipeEnabled({swipeEnabled: true, index: 2});
      expect(component.slides.allowTouchMove).toBeTrue();
    });
  });

  describe('updateStep', () => {
    it('should set the value and call updateJourneySteps', () => {
      component.steps[1].value = undefined;
      const value = {value: 'test'};
      component.journey = {
        journeyID: 1,
        lastModifiedStepIndex: 0,
        journeyName: 'journey1',
      };
      component.updateStep(value, 1);
      expect(component.steps[1].value).toEqual(value);
      expect(journeyServiceSpy.updateJourneySteps).toHaveBeenCalledWith(
        component.steps,
        1,
        false
      );
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call leaveJourney', () => {
      spyOn(component, 'leaveJourney');
      component.ionViewWillLeave();
      expect(component.leaveJourney).toHaveBeenCalledWith();
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(component, 'leaveJourney');
      spyOn(component['subscription'], 'unsubscribe');
    });

    it('should unsubscribe on subscription', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });

    it('should call leaveJourney if it is web', () => {
      component.isWeb = true;
      component.ngOnDestroy();
      expect(component.leaveJourney).toHaveBeenCalled();
    });

    it('should not call leaveJourney if it is not web', () => {
      component.isWeb = false;
      component.ngOnDestroy();
      expect(component.leaveJourney).not.toHaveBeenCalled();
    });
  });
});
