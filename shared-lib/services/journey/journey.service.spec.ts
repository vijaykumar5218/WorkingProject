import {TestBed} from '@angular/core/testing';
import {SharedUtilityService} from '../utility/utility.service';
import {JourneyService} from './journey.service';
import {endpoints} from './constants/endpoints';
import {
  FilteredRecords,
  JourneyResponse,
  JourneyStep,
  StepContentElement,
} from './models/journey.model';
import {Status} from '../../constants/status.enum';
import {ModalController} from '@ionic/angular';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';
import {of, ReplaySubject, Subscription} from 'rxjs';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {HSA_INJECTION_TOKEN} from './constants/injectionTokens';
import {ValidationType} from './constants/validationType.enum';
import {PreviewAnyFile} from '@ionic-native/preview-any-file/ngx';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {ModalComponent} from '../../modules/journeys/components/modal/modal.component';

describe('JourneyService', () => {
  let service: JourneyService;
  let baseServiceSpy;
  let utilityServiceSpy;
  let journeyData: JourneyResponse;
  let stepContent: Record<string, string>;
  let cmsTagId;
  let msgType;
  let modalControllerSpy;
  let inAppBrowserSpy;
  let journey;
  let link;
  let state;
  let previewAnyFileSpy;
  let eventManagerSpy;
  let leaveJourneyPublisherSpy;
  let platformResumeObservable;

  beforeEach(() => {
    baseServiceSpy = jasmine.createSpyObj('BaseService', ['get', 'post']);
    utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
      'appendBaseUrlToEndpoints',
      'getIsWeb',
      'getPlatformResume',
    ]);
    utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endpoints);
    platformResumeObservable = of();
    utilityServiceSpy.getPlatformResume.and.returnValue(
      platformResumeObservable
    );
    journeyData = {
      flags: {},
      all: [
        {
          journeyID: 1,
          journeyName: 'journey1',
          lastModifiedStepIndex: 0,
          landingAndOverviewContent:
            '{"intro":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg"},"overview":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg","summarySteps":[]}}',
          resourcesContent: '',
          steps: [],
        },
        {
          journeyID: 2,
          journeyName: 'journey2',
          lastModifiedStepIndex: 0,
          landingAndOverviewContent:
            '{"intro":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2"},"overview":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2","summarySteps":[{"journeyStepName":"1","header":"You want to retire at:","elements":[{"id":"imageWithValue","answerId":"retirementAge"}]},{"journeyStepName":"5","header":"Your Retirement Progress","elements":[{"id":"orangeMoney"}]},{"journeyStepName":"2","header":"Here\'s what\'s most important to you:","elements":[{"id":"wordGroupSummary","answerId":"wordGroup"},{"id":"wordGroupOtherSummary","answerId":"otherInput"}]}]}}',
          resourcesContent: '',
          steps: [],
        },
      ],
      recommended: [
        {
          journeyID: 3,
          journeyName: 'journey3',
          lastModifiedStepIndex: 0,
          landingAndOverviewContent:
            '{"intro":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3"},"overview":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3","summarySteps":[]}}',
          resourcesContent:
            '{"resources":[{"type":"webview","header":"Articles","links":[{"text":"Setting retirement goals that will help you in your golden years","link":"https://www.voya.com/article/setting-retirement-goals-will-help-you-your-golden-years"}]},{"type":"video","header":"Videos","links":[{"text":"Learn how asset classes work in investing","playerId":"kaltura_player_1644869692","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869692&entry_id=1_9sd775pl"},{"text":"Retirement income planning","playerId":"kaltura_player_1644869723","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869723&entry_id=1_4pj5swer"}]}]}',
          steps: [],
        },
      ],
    };
    stepContent = {
      stepTag:
        '{"pageElements":[{"elements":[{"id":"intro","header":"When do you want to retire?","description":"At what age would you like to retire? You can always change this later as you update the plan."},{"id":"imageWithValue","imageUrl":"assets/icon/journeys/retirement/Group_396.svg"},{"id":"input","type":"textField","label":"Retirement Age","default":67,"help":{"header":"Why do we need this info?","message":"The age you plan to retire is just a starting point. This will help understand how much money you’ll need in retirement and how much longer you have to save. Also, there are other benefits and considerations that are dependent on your age, such as Social Security and Medicare, so it\'s important to plan ahead."}},{"id":"button","label":"Update","link":"default"}]}]}',
    };
    cmsTagId = 'stepTag';
    msgType = 'sectionTag';
    modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'create',
      'dismiss',
    ]);
    inAppBrowserSpy = jasmine.createSpyObj('InAppBrowser', [
      'openInAppBrowser',
    ]);
    journey = {
      journeyID: 1,
      parsedLandingAndOverviewContent: {
        intro: undefined,
        overview: {
          header: 'Adding to your family',
          message:
            'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
          imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
          action: {
            header: 'actionHeader',
            message: 'Number of steps ${stepCount} in this journey',
            buttonLabel: 'actionButtonLabel',
          },
          summarySteps: [
            {
              journeyStepName: '1',
              header: 'You want to retire at:',
              elements: [
                {
                  id: 'imageWithValue',
                  answerId: 'retirementAge',
                },
              ],
            },
            {
              journeyStepName: '5',
              header: 'Your Retirement Progress',
              elements: [
                {
                  id: 'orangeMoney',
                },
              ],
            },
            {
              journeyStepName: '2',
              header: "Here's what's most important to you:",
              elements: [
                {
                  id: 'wordGroupSummary',
                  answerId: 'wordGroup',
                },
                {
                  id: 'wordGroupOtherSummary',
                  answerId: 'otherInput',
                },
              ],
            },
          ],
        },
      },
      steps: [
        {
          journeyStepName: '1',
          journeyStepCMSTagId: 'tagId1',
          msgType: 'msgType1',
        },
        {
          journeyStepName: '2',
          journeyStepCMSTagId: 'tagId2',
          msgType: 'msgType2',
        },
      ],
    };
    link = 'settings/notification-settings';
    state = 'true';
    previewAnyFileSpy = jasmine.createSpyObj('PreviewAnyFile', ['preview']);
    eventManagerSpy = jasmine.createSpyObj('EventManager', ['createPublisher']);
    leaveJourneyPublisherSpy = jasmine.createSpyObj('publisher', ['publish']);
    eventManagerSpy.createPublisher.and.returnValue(leaveJourneyPublisherSpy);
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {provide: ModalController, useValue: modalControllerSpy},
        {provide: InAppBroserService, useValue: inAppBrowserSpy},
        {provide: PreviewAnyFile, useValue: previewAnyFileSpy},
        {provide: EventManagerService, useValue: eventManagerSpy},
      ],
    });
    service = TestBed.inject(JourneyService);
  });

  describe('constructor', () => {
    it('should append the base url to the endpoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalled();
    });

    it('should create the publisher', () => {
      expect(eventManagerSpy.createPublisher).toHaveBeenCalledWith(
        eventKeys.leaveJourney
      );
      expect(service['leaveJourneyPublisher']).toEqual(
        leaveJourneyPublisherSpy
      );
    });
  });

  describe('fetchJourneys', () => {
    let getRecommendedJourneysSpy;
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(JSON.stringify(journeyData)))
      );
      getRecommendedJourneysSpy = spyOn(
        service,
        'getRecommendedJourneys'
      ).and.callFake(recommended => recommended);
    });

    it('should return the journeysResponse after calling base service on first call', done => {
      journeyData.all.push({
        journeyID: 4,
        journeyName: 'Journey Name',
        lastModifiedStepIndex: 0,
        comingSoonContent:
          '{"intro":{"header":"Financial Hardships","message":"An emergency fund can help give you confidence and control over your finances if you were faced with the unexpected.","imgUrl":"assets/icon/journeys/hsa/doctors.svg"}}',
      });
      baseServiceSpy.get.and.returnValue(Promise.resolve(journeyData));
      service.fetchJourneys().subscribe(journeys => {
        expect(baseServiceSpy.get).toHaveBeenCalledWith(endpoints.getJourneys);
        journeyData.all[0].parsedLandingAndOverviewContent = {
          intro: {
            header: 'Preparing for retirement',
            message:
              "It's a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.",
            imgUrl: 'assets/icon/journeys/In_Company.svg',
          },
          overview: {
            header: 'Preparing for retirement',
            message:
              "It's a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.",
            imgUrl: 'assets/icon/journeys/In_Company.svg',
            summarySteps: [],
          },
        };
        journeyData.all[0].parsedResourcesContent = null;
        journeyData.all[0].parsedComingSoonContent = null;
        journeyData.all[1].parsedLandingAndOverviewContent = {
          intro: {
            header: 'Preparing for retirement2',
            message:
              "It's a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2",
            imgUrl: 'assets/icon/journeys/In_Company.svg2',
          },
          overview: {
            header: 'Preparing for retirement2',
            message:
              "It's a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2",
            imgUrl: 'assets/icon/journeys/In_Company.svg2',
            summarySteps: [
              {
                journeyStepName: '1',
                header: 'You want to retire at:',
                elements: [
                  {
                    id: 'imageWithValue',
                    answerId: 'retirementAge',
                  },
                ],
              },
              {
                journeyStepName: '5',
                header: 'Your Retirement Progress',
                elements: [
                  {
                    id: 'orangeMoney',
                  },
                ],
              },
              {
                journeyStepName: '2',
                header: "Here's what's most important to you:",
                elements: [
                  {
                    id: 'wordGroupSummary',
                    answerId: 'wordGroup',
                  },
                  {
                    id: 'wordGroupOtherSummary',
                    answerId: 'otherInput',
                  },
                ],
              },
            ],
          },
        };
        journeyData.all[1].parsedResourcesContent = null;
        journeyData.all[1].parsedComingSoonContent = null;
        journeyData.all[2].parsedComingSoonContent = {
          intro: {
            header: 'Maximizing Your HSA',
            message:
              'Health Savings Accounts (HSAs) are a great way to cover healthcare needs today and in the future.',
            imgUrl: 'assets/icon/journeys/hsa/doctors.svg',
          },
        };
        journeyData.recommended[0].parsedLandingAndOverviewContent = {
          intro: {
            header: 'Preparing for retirement3',
            message:
              "It's a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3",
            imgUrl: 'assets/icon/journeys/In_Company.svg3',
          },
          overview: {
            header: 'Preparing for retirement3',
            message:
              "It's a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3",
            imgUrl: 'assets/icon/journeys/In_Company.svg3',
            summarySteps: [],
          },
        };
        journeyData.recommended[0].parsedResourcesContent = {
          resources: [
            {
              type: 'webview',
              header: 'Articles',
              links: [
                {
                  text:
                    'Setting retirement goals that will help you in your golden years',
                  link:
                    'https://www.voya.com/article/setting-retirement-goals-will-help-you-your-golden-years',
                },
              ],
            },
            {
              type: 'video',
              header: 'Videos',
              links: [
                {
                  text: 'Learn how asset classes work in investing',
                  playerId: 'kaltura_player_1644869692',
                  videoUrl:
                    'https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869692&entry_id=1_9sd775pl',
                },
                {
                  text: 'Retirement income planning',
                  playerId: 'kaltura_player_1644869723',
                  videoUrl:
                    'https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869723&entry_id=1_4pj5swer',
                },
              ],
            },
          ],
        };
        expect(journeys).toEqual(journeyData);
        done();
      });
    });

    it('should not error parsing for undefined content', done => {
      journeyData.recommended = [];
      journeyData.all[0].landingAndOverviewContent = undefined;
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(JSON.stringify(journeyData)))
      );
      service.fetchJourneys().subscribe(journey => {
        expect(baseServiceSpy.get).toHaveBeenCalledWith(endpoints.getJourneys);
        journeyData.all[0].parsedLandingAndOverviewContent = null;
        const parsedLandingAndOverviewContent = {
          intro: {
            header: 'Preparing for retirement2',
            message:
              "It's a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2",
            imgUrl: 'assets/icon/journeys/In_Company.svg2',
          },
          overview: {
            header: 'Preparing for retirement2',
            message:
              "It's a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2",
            imgUrl: 'assets/icon/journeys/In_Company.svg2',
            summarySteps: [
              {
                journeyStepName: '1',
                header: 'You want to retire at:',
                elements: [
                  {
                    id: 'imageWithValue',
                    answerId: 'retirementAge',
                  },
                ],
              },
              {
                journeyStepName: '5',
                header: 'Your Retirement Progress',
                elements: [
                  {
                    id: 'orangeMoney',
                  },
                ],
              },
              {
                journeyStepName: '2',
                header: "Here's what's most important to you:",
                elements: [
                  {
                    id: 'wordGroupSummary',
                    answerId: 'wordGroup',
                  },
                  {
                    id: 'wordGroupOtherSummary',
                    answerId: 'otherInput',
                  },
                ],
              },
            ],
          },
        };

        expect(journey.all[0].parsedLandingAndOverviewContent).toEqual(null);
        expect(journey.all[1].parsedLandingAndOverviewContent).toEqual(
          parsedLandingAndOverviewContent
        );
        expect(journey.recommended).toEqual([]);
        done();
      });
    });

    it('should return the journeysSubject without calling baseService again if it is not null', () => {
      service.fetchJourneys();
      service.fetchJourneys();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
    });

    it('should call the service again if refresh is true', () => {
      service.fetchJourneys();
      service.fetchJourneys(true);
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
    });

    it('should set the recommended journeys to the result of getRecommendedJourneys', done => {
      getRecommendedJourneysSpy.and.returnValue([]);
      service.fetchJourneys().subscribe(journey => {
        expect(journey.recommended).toEqual([]);
        done();
      });
    });
  });

  describe('refreshJourneys', () => {
    it('should subscribe to resume and call fetchJourneys', () => {
      const subscription = new Subscription();
      spyOn(service, 'fetchJourneys');
      spyOn(service['subscription'], 'add');
      spyOn(platformResumeObservable, 'subscribe').and.callFake(f => {
        f();
        return subscription;
      });
      service['refreshJourneys']();
      expect(utilityServiceSpy.getPlatformResume).toHaveBeenCalled();
      expect(platformResumeObservable.subscribe).toHaveBeenCalled();
      expect(service['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(service.fetchJourneys).toHaveBeenCalledWith(true);
    });
  });

  describe('updateJourneySteps', () => {
    let getRecommendedJourneysSpy;

    beforeEach(() => {
      spyOn(service, 'setCurrentJourney');
      getRecommendedJourneysSpy = spyOn(
        service,
        'getRecommendedJourneys'
      ).and.callFake(recommended => recommended);
    });

    it('should set the steps of the current journey in both all and recommended', done => {
      journeyData.recommended[0].journeyID = 1;
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(JSON.stringify(journeyData)))
      );
      let firstUpdate = true;
      service.fetchJourneys().subscribe(() => {
        if (firstUpdate) {
          firstUpdate = false;
          const steps: JourneyStep[] = [
            {
              journeyStepName: '1',
              journeyStepCMSTagId: 'cmsTagId',
              msgType: 'msgType',
            },
          ];
          service.updateJourneySteps(steps, 1);
          service.fetchJourneys().subscribe(journeys => {
            expect(journeys.all[0].steps).toEqual(steps);
            expect(journeys.recommended[0].steps).toEqual(steps);
            expect(service.setCurrentJourney).toHaveBeenCalledWith(
              journeys.all[0]
            );
            done();
          });
        }
      });
    });

    it('should set the steps of the current journey in all if no recommended journeys', done => {
      journeyData.recommended = [];
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(JSON.stringify(journeyData)))
      );
      let firstUpdate = true;
      service.fetchJourneys().subscribe(() => {
        if (firstUpdate) {
          firstUpdate = false;
          const steps: JourneyStep[] = [
            {
              journeyStepName: '1',
              journeyStepCMSTagId: 'cmsTagId',
              msgType: 'msgType',
            },
          ];
          service.updateJourneySteps(steps, 1);
          service.fetchJourneys().subscribe(journeys => {
            expect(journeys.all[0].steps).toEqual(steps);
            expect(journeys.recommended).toEqual([]);
            done();
          });
        }
      });
    });

    it('should set the steps of the current journey in recommended if no all', done => {
      journeyData.all = [];
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(JSON.stringify(journeyData)))
      );
      let firstUpdate = true;
      service.fetchJourneys().subscribe(() => {
        const steps: JourneyStep[] = [
          {
            journeyStepName: '1',
            journeyStepCMSTagId: 'cmsTagId',
            msgType: 'msgType',
          },
        ];
        if (firstUpdate) {
          firstUpdate = false;
          service.updateJourneySteps(steps, 3);
          service.fetchJourneys().subscribe(journeys => {
            expect(journeys.recommended[0].steps).toEqual(steps);
            expect(journeys.all).toEqual([]);
            done();
          });
        }
      });
    });

    it('should set the steps of the current journey in all if not in recommended', done => {
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(JSON.stringify(journeyData)))
      );
      let firstUpdate = true;
      service.fetchJourneys().subscribe(() => {
        if (firstUpdate) {
          firstUpdate = false;
          const steps: JourneyStep[] = [
            {
              journeyStepName: '1',
              journeyStepCMSTagId: 'cmsTagId',
              msgType: 'msgType',
            },
          ];
          service.updateJourneySteps(steps, 1);
          service.fetchJourneys().subscribe(journeys => {
            expect(journeys.all[0].steps).toEqual(steps);
            expect(journeys.recommended[0].steps).toEqual(
              journeyData.recommended[0].steps
            );
            done();
          });
        }
      });
    });

    it('should call next on the subject if it is defined', () => {
      const steps: JourneyStep[] = [
        {
          journeyStepName: '1',
          journeyStepCMSTagId: 'cmsTagId',
          msgType: 'msgType',
        },
      ];
      service[
        'journeyResponseSubject'
      ] = jasmine.createSpyObj('journeyResponseSubject', ['next']);
      service['journeyResponse'] = journeyData;
      service.updateJourneySteps(steps, 1);
      journeyData.all[0].steps = steps;
      expect(service['journeyResponseSubject'].next).toHaveBeenCalledWith(
        journeyData
      );
    });

    it('should set the recommended journeys to the result of getRecommendedJourneys', done => {
      journeyData.recommended[0].journeyID = 1;
      getRecommendedJourneysSpy.and.returnValue([]);
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(JSON.stringify(journeyData)))
      );
      let firstUpdate = true;
      service.fetchJourneys().subscribe(() => {
        if (firstUpdate) {
          firstUpdate = false;
          const steps: JourneyStep[] = [
            {
              journeyStepName: '1',
              journeyStepCMSTagId: 'cmsTagId',
              msgType: 'msgType',
            },
          ];
          service.updateJourneySteps(steps, 1);
          service.fetchJourneys().subscribe(journeys => {
            expect(journeys.recommended).toEqual([]);
            done();
          });
        }
      });
    });

    it('should call stepChange on the journey service if it exists and callStepChange is true', () => {
      service['updateJourneyListWithSteps'] = jasmine.createSpy();
      const serviceSpy = jasmine.createSpyObj('service', ['stepChange']);
      service.journeyServiceMap = {
        1: serviceSpy,
      };
      spyOn(service, 'getCurrentJourney').and.returnValue(journey);
      service.updateJourneySteps(undefined, 1);
      expect(serviceSpy.stepChange).toHaveBeenCalledWith(journey);
    });

    it('should not call stepChange on the journey service if it exists but callStepChange is false', () => {
      service['updateJourneyListWithSteps'] = jasmine.createSpy();
      const serviceSpy = jasmine.createSpyObj('service', ['stepChange']);
      service.journeyServiceMap = {
        1: serviceSpy,
      };
      spyOn(service, 'getCurrentJourney').and.returnValue(journey);
      service.updateJourneySteps(undefined, 1, false);
      expect(serviceSpy.stepChange).not.toHaveBeenCalled();
    });
  });

  describe('sortJourneys', () => {
    let journeys;
    let isComingSoonSpy;
    let getJourneyStatusSpy;

    beforeEach(() => {
      journeys = [{journeyID: 1}, {journeyID: 2}, {journeyID: 3}];
      isComingSoonSpy = spyOn(service, 'isComingSoon');
      getJourneyStatusSpy = spyOn(service, 'getJourneyStatus');
    });

    it('should preserve the order of coming soon journeys', () => {
      isComingSoonSpy.and.returnValue(true);
      service['sortJourneys'](journeys);
      expect(journeys).toEqual([
        {journeyID: 1},
        {journeyID: 2},
        {journeyID: 3},
      ]);
    });

    it('should move coming soon to the end of other journeys', () => {
      isComingSoonSpy.and.callFake(journey => journey.journeyID === 1);
      service['sortJourneys'](journeys);
      expect(journeys).toEqual([
        {journeyID: 2},
        {journeyID: 3},
        {journeyID: 1},
      ]);
    });

    it('should keep coming soon at the end of other journeys', () => {
      isComingSoonSpy.and.callFake(journey => journey.journeyID === 3);
      service['sortJourneys'](journeys);
      expect(journeys).toEqual([
        {journeyID: 1},
        {journeyID: 2},
        {journeyID: 3},
      ]);
    });

    it('should move completed after in progress', () => {
      const steps0 = [{journeyStepName: 'step1'}];
      journeys[0].steps = steps0;
      isComingSoonSpy.and.returnValue(false);
      getJourneyStatusSpy.and.callFake(steps => {
        if (steps === steps0) {
          return Status.completed;
        } else return Status.inProgress;
      });
      service['sortJourneys'](journeys);
      expect(journeys).toEqual([
        {journeyID: 2},
        {journeyID: 3},
        {journeyID: 1, steps: steps0},
      ]);
    });

    it('should retain in progress before completed', () => {
      const steps0 = [{journeyStepName: 'step1'}];
      journeys[0].steps = steps0;
      isComingSoonSpy.and.returnValue(false);
      getJourneyStatusSpy.and.callFake(steps => {
        if (steps === steps0) {
          return Status.inProgress;
        } else return Status.completed;
      });
      service['sortJourneys'](journeys);
      expect(journeys).toEqual([
        {journeyID: 1, steps: steps0},
        {journeyID: 2},
        {journeyID: 3},
      ]);
    });
  });

  describe('isRecommendedJourney', () => {
    beforeEach(() => {
      service['journeyResponse'] = journeyData;
    });

    it('should return true if journey is in recommended list', () => {
      const journey = {
        journeyID: 3,
        journeyName: 'journey3',
        lastModifiedStepIndex: 0,
        landingAndOverviewContent:
          '{"intro":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3"},"overview":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3","summarySteps":[]}}',
        resourcesContent:
          '{"resources":[{"type":"webview","header":"Articles","links":[{"text":"Setting retirement goals that will help you in your golden years","link":"https://www.voya.com/article/setting-retirement-goals-will-help-you-your-golden-years"}]},{"type":"video","header":"Videos","links":[{"text":"Learn how asset classes work in investing","playerId":"kaltura_player_1644869692","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869692&entry_id=1_9sd775pl"},{"text":"Retirement income planning","playerId":"kaltura_player_1644869723","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869723&entry_id=1_4pj5swer"}]}]}',
        steps: [],
      };

      const res = service.isRecommendedJourney(journey);

      expect(res).toBeTrue();
    });

    it('should return false if journey is not recommended list', () => {
      const journey = {
        journeyID: 2,
        journeyName: 'journey2',
        lastModifiedStepIndex: 0,
        landingAndOverviewContent:
          '{"intro":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2"},"overview":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2","summarySteps":[{"journeyStepName":"1","header":"You want to retire at:","elements":[{"id":"imageWithValue","answerId":"retirementAge"}]},{"journeyStepName":"5","header":"Your Retirement Progress","elements":[{"id":"orangeMoney"}]},{"journeyStepName":"2","header":"Here\'s what\'s most important to you:","elements":[{"id":"wordGroupSummary","answerId":"wordGroup"},{"id":"wordGroupOtherSummary","answerId":"otherInput"}]}]}}',
        resourcesContent: '',
        steps: [],
      };

      const res = service.isRecommendedJourney(journey);

      expect(res).toBeFalse();
    });
  });

  describe('getRecommendedJourneys', () => {
    it('should remove any journeys which are completed', () => {
      const steps1 = [
        {
          status: Status.inProgress,
          journeyStepName: '1',
          journeyStepCMSTagId: '',
          msgType: '',
        },
      ];
      journeyData.all[0].steps = steps1;
      spyOn(service, 'getJourneyStatus').and.callFake(steps => {
        if (steps === steps1) {
          return Status.completed;
        } else {
          return Status.notStarted;
        }
      });
      const result = service.getRecommendedJourneys(journeyData.all);
      expect(service.getJourneyStatus).toHaveBeenCalledWith(steps1);
      expect(service.getJourneyStatus).toHaveBeenCalledWith([]);
      expect(result).toEqual([journeyData.all[1]]);
    });

    it('should return [] if there are no recommended journeys', () => {
      const result = service.getRecommendedJourneys(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('setCurrentJourney', () => {
    let getCurrentJourneySpy;
    beforeEach(() => {
      spyOn(Storage.prototype, 'setItem');
      getCurrentJourneySpy = spyOn(
        service,
        'getCurrentJourney'
      ).and.returnValue(journeyData.all[0]);
      spyOn(service, 'resetStepContent');
    });

    it('should call resetStepContent if the journey changed', () => {
      getCurrentJourneySpy.and.returnValue(undefined);
      service.setCurrentJourney(journeyData.all[0]);
      expect(service.resetStepContent).toHaveBeenCalled();
    });

    it('should set the currentJourney in localStorage and the class prop if it is different than what was previously stored', () => {
      getCurrentJourneySpy.and.returnValue(undefined);
      service['currentJourney'] = undefined;
      service.setCurrentJourney(journeyData.all[0]);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'currentJourney',
        JSON.stringify(journeyData.all[0])
      );
      expect(service['currentJourney']).toEqual(journeyData.all[0]);
    });

    it('should not call resetStepContent if the journey did not change', () => {
      service.setCurrentJourney(journeyData.all[0]);
      expect(service.resetStepContent).not.toHaveBeenCalled();
    });

    it('should not set the currentJourney in localStorage if it is the same as what was previously stored', () => {
      service.setCurrentJourney(journeyData.all[0]);
      expect(Storage.prototype.setItem).not.toHaveBeenCalled();
    });

    it('should update the journey response if updateResponse is true', () => {
      journeyData.recommended = [
        journeyData.recommended[0],
        journeyData.all[0],
      ];
      service['journeyResponse'] = journeyData;
      const updatedJourney = JSON.parse(JSON.stringify(journeyData.all[0]));
      updatedJourney.lastModifiedStepIndex = 5;
      service[
        'journeyResponseSubject'
      ] = jasmine.createSpyObj('journeyResponseSubject', ['next']);
      service.setCurrentJourney(updatedJourney, true);
      expect(service['journeyResponse'].all[0].lastModifiedStepIndex).toEqual(
        5
      );
      expect(
        service['journeyResponse'].recommended[1].lastModifiedStepIndex
      ).toEqual(5);
      expect(service['journeyResponseSubject'].next).toHaveBeenCalledWith(
        journeyData
      );
    });

    it('should update the recommended journey if it is first', () => {
      journeyData.recommended = [
        journeyData.all[0],
        journeyData.recommended[0],
      ];
      service['journeyResponse'] = journeyData;
      const updatedJourney = JSON.parse(JSON.stringify(journeyData.all[0]));
      updatedJourney.lastModifiedStepIndex = 5;
      service[
        'journeyResponseSubject'
      ] = jasmine.createSpyObj('journeyResponseSubject', ['next']);
      service.setCurrentJourney(updatedJourney, true);
      expect(
        service['journeyResponse'].recommended[0].lastModifiedStepIndex
      ).toEqual(5);
    });

    it('should not update recommended if it is not found', () => {
      service['journeyResponse'] = journeyData;
      const updatedJourney = JSON.parse(JSON.stringify(journeyData.all[0]));
      updatedJourney.lastModifiedStepIndex = 5;
      service[
        'journeyResponseSubject'
      ] = jasmine.createSpyObj('journeyResponseSubject', ['next']);
      service.setCurrentJourney(updatedJourney, true);
      expect(service['journeyResponseSubject'].next).toHaveBeenCalledWith(
        journeyData
      );
    });
  });

  describe('getCurrentJourney', () => {
    it('should get the currentJourney from localStorage', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(journeyData.all[0])
      );
      const result = service.getCurrentJourney();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('currentJourney');
      expect(result).toEqual(journeyData.all[0]);
    });

    it('should return the class prop if the currentJourney has not been set in localstorage yet', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('undefined');
      service['currentJourney'] = journeyData.all[0];
      const result = service.getCurrentJourney();
      expect(result).toEqual(journeyData.all[0]);
    });

    it('should return the class prop if the currentJourney from localstorage is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      service['currentJourney'] = journeyData.all[0];
      const result = service.getCurrentJourney();
      expect(result).toEqual(journeyData.all[0]);
    });
  });

  describe('saveProgress', () => {
    let stepStasuses: JourneyStep[];

    beforeEach(() => {
      stepStasuses = [
        {
          journeyStepName: '1',
          journeyStepCMSTagId: 'tagId1',
          status: Status.completed,
          msgType: 'msgType1',
        },
        {
          journeyStepName: '2',
          journeyStepCMSTagId: 'tagId2',
          status: Status.inProgress,
          msgType: 'msgType2',
        },
      ];
      spyOn(service, 'getCurrentJourney').and.returnValue({
        journeyID: 1,
        journeyName: 'Journey Name',
        lastModifiedStepIndex: 0,
      });
    });

    it('should call base service to post the statuses', async () => {
      await service.saveProgress(stepStasuses);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endpoints.saveStepProgress,
        stepStasuses
      );
    });

    it('should call processForSave if the service is set and processForSave exists', async () => {
      service.journeyServiceMap = {
        1: jasmine.createSpyObj('JourneyService', ['processForSave']),
      };
      await service.saveProgress(stepStasuses);
      expect(service.getCurrentJourney).toHaveBeenCalled();
      expect(
        service.journeyServiceMap['1'].processForSave
      ).toHaveBeenCalledWith(stepStasuses);
    });
  });

  describe('fetchStepContent', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(stepContent));
    });

    it('should call the service to get the content if the subject is null', done => {
      const expected = JSON.parse(stepContent.stepTag);
      const result = service.fetchStepContent(cmsTagId, msgType);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endpoints.getStepContent + 'sectionTag'
      );
      result.subscribe(data => {
        expect(data).toEqual(expected);
        done();
      });
    });

    it('should not call the service again to get the content if the subject is not null', () => {
      service.fetchStepContent(cmsTagId, msgType);
      service.fetchStepContent(cmsTagId, msgType);
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
    });

    it('should return null if stepTag not present in content', done => {
      cmsTagId += '1';
      const result = service.fetchStepContent(cmsTagId, msgType);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endpoints.getStepContent + 'sectionTag'
      );
      result.subscribe(data => {
        expect(data).toBeUndefined();
        done();
      });
    });
  });

  describe('resetStepContent', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(stepContent));
    });

    it('should set stepContentSubject back to null so that data is refreshed', () => {
      service.fetchStepContent(cmsTagId, msgType);
      service.resetStepContent();
      service.fetchStepContent(cmsTagId, msgType);
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCurrentStep$', () => {
    it('should return the current step subject', done => {
      const result = service.getCurrentStep$();
      result.subscribe(step => {
        expect(step).toEqual(10);
        done();
      });
      service.publishCurrentStep(10);
    });
  });

  describe('openMxAccModal', () => {
    it('should call openModal with props for MX', () => {
      spyOn(service, 'openModal');

      service.openMxAccModal();

      const prop = {
        id: 'contentModal',
        elements: [
          {
            id: 'manageMXaccount',
            header: 'Add Account',
          },
        ],
      };

      expect(service.openModal).toHaveBeenCalledWith({
        element: prop,
      });
    });
  });

  describe('openModal', () => {
    it('should create and present the modal with fullscreen for fullscreen true', async () => {
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      const componentProps = {component: 'props'};
      await service.openModal(componentProps);
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: ModalComponent,
        componentProps: {component: 'props', fullscreen: true},
        cssClass: 'modal-fullscreen',
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    it('should create and present the modal with not fullscreen for fullscreen false', async () => {
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      const componentProps = {component: 'props'};
      await service.openModal(componentProps, false);
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: ModalComponent,
        componentProps: {component: 'props', fullscreen: false},
        cssClass: 'modal-not-fullscreen',
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    it('should use fullscreen from component props if it is set', async () => {
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      const componentProps = {element: {fullscreen: true}};
      await service.openModal(componentProps, false);
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: ModalComponent,
        componentProps: {element: {fullscreen: true}, fullscreen: true},
        cssClass: 'modal-fullscreen',
      });
    });

    it('should use fullscreen param if it is undefined', async () => {
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      const componentProps = {element: {fullscreen: undefined}};
      await service.openModal(componentProps, false);
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: ModalComponent,
        componentProps: {element: {fullscreen: undefined}, fullscreen: false},
        cssClass: 'modal-not-fullscreen',
      });
    });
  });

  describe('openWebview', () => {
    beforeEach(() => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
    });

    it('should open with pdf viewer if link contains .pdf and not web', () => {
      service.openWebView('https://www.ssa.pdf');

      expect(inAppBrowserSpy.openInAppBrowser).not.toHaveBeenCalled();
      expect(previewAnyFileSpy.preview).toHaveBeenCalledWith(
        'https://www.ssa.pdf'
      );
    });

    it('should call inappbrowser openInAppBrowser with toolbar no if toolbar is falsy and not web or pdf', () => {
      service.openWebView('https://www.ssa.gov', 'ssa.gov');

      const voyaController = new VoyaIABController();
      voyaController.headerText = 'ssa.gov';
      expect(inAppBrowserSpy.openInAppBrowser).toHaveBeenCalledWith(
        'https://www.ssa.gov',
        voyaController
      );
      expect(
        inAppBrowserSpy.openInAppBrowser.calls.all()[0].args[1].browserOptions
          .toolbar
      ).toEqual('no');
    });

    it('should call inappbrowser openInAppBrowser with toolbar yes if toolbar is truthy and not web or pdf', () => {
      service.openWebView('https://www.ssa.gov', 'ssa.gov', true);
      expect(
        inAppBrowserSpy.openInAppBrowser.calls.all()[0].args[1].browserOptions
          .toolbar
      ).toEqual('yes');
    });

    it('should open in a new tab for web', () => {
      spyOn(window, 'open');
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      service.openWebView('https://www.ssa.gov');
      expect(window.open).toHaveBeenCalledWith('https://www.ssa.gov', '_blank');
    });
  });

  describe('safeParse', () => {
    it('should return undefined and print error to console if string is truthy and is not valid json', () => {
      spyOn(console, 'error');
      const result = service.safeParse(']');
      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalled();
    });

    it('should return undefined and not print error to console if string is falsy', () => {
      spyOn(console, 'error');
      const result = service.safeParse(undefined);
      expect(result).toBeUndefined();
      expect(console.error).not.toHaveBeenCalledWith();
    });

    it('should return parsed object if string is valid json', () => {
      const result = service.safeParse(
        '{"answerId1": "answer1", "answerId2": "answer2"}'
      );
      expect(result).toEqual({answerId1: 'answer1', answerId2: 'answer2'});
    });

    it('should return parsed list', () => {
      const result = service.safeParse([
        '{"answerId1": "answer1", "answerId2": "answer2"}',
        '{}',
      ]);
      expect(result).toEqual([
        {answerId1: 'answer1', answerId2: 'answer2'},
        {},
      ]);
    });
  });

  describe('findElementByProp', () => {
    it('should loop through pageElements and elements to find the object containing the prop with the value', () => {
      const result = service.findElementByProp(
        {
          pageElements: [
            {
              elements: [
                {
                  id: 'intro',
                  header: 'When do you want to retire?',
                  description:
                    'At what age would you like to retire? You can always change this later as you update the plan.',
                },
              ],
            },
            {
              elements: [
                {
                  id: 'imageWithValue',
                  imageUrl: 'assets/icon/journeys/retirement/Group_396.svg',
                },
                {
                  id: 'input',
                  answerId: 'retirementAge',
                  type: 'textField',
                  label: 'Retirement Age',
                  default: 67,
                  help: {
                    label: 'Why do we need this info?',
                    description:
                      "The age you plan to retire is just a starting point. This will help understand how much money you'll need in retirement and how much longer you have to save. Also, there are other benefits and considerations that are dependent on your age, such as Social Security and Medicare, so it's important to plan ahead.",
                  },
                },
                {id: 'button', label: 'Continue', link: 'default'},
              ],
            },
          ],
        },
        'id',
        'imageWithValue'
      );
      expect(result).toEqual({
        id: 'imageWithValue',
        imageUrl: 'assets/icon/journeys/retirement/Group_396.svg',
      });
    });
  });

  describe('isSummaryStepCompleted', () => {
    beforeEach(() => {
      spyOn(service, 'getCurrentJourney').and.returnValue(journey);
    });

    it('should set to true if all of the required steps are completed', () => {
      journey.parsedLandingAndOverviewContent.overview.requiredSteps = [
        '1',
        '2',
      ];
      journey.steps[0].status = Status.completed;
      journey.steps[1].status = Status.completed;
      const result = service.isSummaryStepCompleted();
      expect(result).toBeTrue();
    });

    it('should set to false if any of the required steps are not completed', () => {
      journey.parsedLandingAndOverviewContent.overview.requiredSteps = [
        '1',
        '10',
      ];
      journey.steps[0].status = Status.inProgress;
      const result = service.isSummaryStepCompleted();
      expect(result).toBeFalse();
    });

    it('should set to true if at least one summaryStep is completed', () => {
      journey.steps[0].status = Status.completed;
      const result = service.isSummaryStepCompleted();
      expect(result).toBeTrue();
    });

    it('should not set to true if no summaryStep has been completed', () => {
      const result = service.isSummaryStepCompleted();
      expect(result).toBeFalse();
    });
  });

  describe('setStepContent', () => {
    beforeEach(() => {
      spyOn(service, 'initializeServices');
      spyOn(service, 'fetchStepContent').and.callFake(tagId =>
        of({
          pageElements: [
            {
              elements: [
                {
                  id: 'intro' + tagId,
                  header: 'When do you want to retire?',
                  description:
                    'At what age would you like to retire? You can always change this later as you update the plan.',
                },
              ],
            },
          ],
        })
      );
      spyOn(service, 'setIdSufixes');
    });

    it('should call setIdSufixes for each step', async () => {
      await service.setStepContent(journey);
      expect(service.setIdSufixes).toHaveBeenCalledWith(
        journey.steps[0].content,
        0
      );
      expect(service.setIdSufixes).toHaveBeenCalledWith(
        journey.steps[1].content,
        1
      );
    });

    it('should call initializeServices', async () => {
      await service.setStepContent(journey);
      expect(service.initializeServices).toHaveBeenCalled();
    });

    it('should set the content for each of the steps in the journey', async () => {
      await service.setStepContent(journey);
      expect(service.fetchStepContent).toHaveBeenCalledWith(
        'tagId1',
        'msgType1'
      );
      expect(service.fetchStepContent).toHaveBeenCalledWith(
        'tagId2',
        'msgType2'
      );
      expect(journey.steps[0].content).toEqual({
        pageElements: [
          {
            elements: [
              {
                id: 'introtagId1',
                header: 'When do you want to retire?',
                description:
                  'At what age would you like to retire? You can always change this later as you update the plan.',
              },
            ],
          },
        ],
      });
      expect(journey.steps[1].content).toEqual({
        pageElements: [
          {
            elements: [
              {
                id: 'introtagId2',
                header: 'When do you want to retire?',
                description:
                  'At what age would you like to retire? You can always change this later as you update the plan.',
              },
            ],
          },
        ],
      });
    });
  });

  describe('setIdSufixes', () => {
    let index;
    let content;

    beforeEach(() => {
      index = 2;
      content = {
        pageElements: [
          {
            backgroundColor: 'var(--secondary-colors-voya-violet)',
            elements: [
              {
                id: 'intro',
                header: 'Estimate your expenses in retirement',
                description:
                  'webview{Read an article} for some ideas on how to manage your expenses in retirement',
                webviewHeaders: ['voya.com'],
                webviewLinks: [
                  'https://www.voya.com/article/managing-expenses-retirement',
                ],
                linkColor: 'var(--primary-colors-voya-white)',
                textColor: 'var(--primary-colors-voya-white)',
                marginBottom: '20px',
              },
              {
                id: 'image',
                imageUrl: 'assets/icon/journeys/retirement/step4.svg',
              },
              {
                pageElements: [
                  {
                    backgroundColor: 'rgba(95, 33, 65, 0.3)',
                    elements: [
                      {
                        id: 'intro',
                        header: 'Quick Tips',
                        description:
                          'Consider planning to have at least 70% of your current income in order to cover your expenses in retirement. A retirement budget can help you stay on track.\n\nwebview{Try the Voya Budget Tool}',
                        textColor: 'var(--primary-colors-voya-white)',
                        linkColor: 'var(--primary-colors-voya-white)',
                        webviewLinks: [
                          'https://www.voya.com/tool/budget-calculator',
                        ],
                        marginBottom: '0px',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'button',
                label: 'Continue',
                link: 'default',
                type: 'secondary',
              },
            ],
          },
        ],
      };
    });

    it('should return the content unchanged if it is undefined', () => {
      const content = undefined;
      service.setIdSufixes(content, index);
      expect(content).toBeUndefined();
    });

    it('should set the id suffixes on each of the elements', () => {
      service.setIdSufixes(content, index);
      expect(content).toEqual({
        pageElements: [
          {
            backgroundColor: 'var(--secondary-colors-voya-violet)',
            elements: [
              {
                id: 'intro',
                header: 'Estimate your expenses in retirement',
                description:
                  'webview{Read an article} for some ideas on how to manage your expenses in retirement',
                webviewHeaders: ['voya.com'],
                webviewLinks: [
                  'https://www.voya.com/article/managing-expenses-retirement',
                ],
                linkColor: 'var(--primary-colors-voya-white)',
                textColor: 'var(--primary-colors-voya-white)',
                marginBottom: '20px',
                idSuffix: '002',
              },
              {
                id: 'image',
                imageUrl: 'assets/icon/journeys/retirement/step4.svg',
                idSuffix: '012',
              },
              {
                pageElements: [
                  {
                    backgroundColor: 'rgba(95, 33, 65, 0.3)',
                    elements: [
                      {
                        id: 'intro',
                        header: 'Quick Tips',
                        description:
                          'Consider planning to have at least 70% of your current income in order to cover your expenses in retirement. A retirement budget can help you stay on track.\n\nwebview{Try the Voya Budget Tool}',
                        textColor: 'var(--primary-colors-voya-white)',
                        linkColor: 'var(--primary-colors-voya-white)',
                        webviewLinks: [
                          'https://www.voya.com/tool/budget-calculator',
                        ],
                        marginBottom: '0px',
                        idSuffix: '02002',
                      },
                    ],
                  },
                ],
              },
              {
                id: 'button',
                label: 'Continue',
                link: 'default',
                type: 'secondary',
                idSuffix: '032',
              },
            ],
          },
        ],
      });
    });

    it('should set the id suffixes on the helpcards if present', () => {
      content.helpCards = [
        {
          header: "We're here to help.",
          description:
            'Schedule time with a professional for a personalized plan.',
          link: 'https://fpcconsultants.timetap.com/#/',
          webviewHeader: 'fpcconsultants.timetap.com',
          imageUrl: 'assets/icon/journeys/retirement/calendar.svg',
        },
        {
          header: "We're here to help.2",
          description:
            'Schedule time with a professional for a personalized plan.2',
          link: 'https://fpcconsultants.timetap.com/#/2',
          webviewHeader: 'fpcconsultants.timetap.com2',
          imageUrl: 'assets/icon/journeys/retirement/calendar.svg2',
        },
      ];
      service.setIdSufixes(content, index);
      expect(content.helpCards).toEqual([
        {
          header: "We're here to help.",
          description:
            'Schedule time with a professional for a personalized plan.',
          link: 'https://fpcconsultants.timetap.com/#/',
          webviewHeader: 'fpcconsultants.timetap.com',
          imageUrl: 'assets/icon/journeys/retirement/calendar.svg',
          idSuffix: '02',
        },
        {
          header: "We're here to help.2",
          description:
            'Schedule time with a professional for a personalized plan.2',
          link: 'https://fpcconsultants.timetap.com/#/2',
          webviewHeader: 'fpcconsultants.timetap.com2',
          imageUrl: 'assets/icon/journeys/retirement/calendar.svg2',
          idSuffix: '12',
        },
      ]);
    });
  });

  describe('initializeServices', () => {
    it('should initialize the service if it is set on the journey', async () => {
      journey.parsedLandingAndOverviewContent.service = 'HSAService';
      const serviceSpy = jasmine.createSpyObj('service', ['initialize']);
      spyOn(service['injector'], 'get').and.returnValue(serviceSpy);
      service.journeyServiceMap = {};
      await service.initializeServices(journey);
      expect(service['injector'].get).toHaveBeenCalledWith(HSA_INJECTION_TOKEN);
      expect(serviceSpy.initialize).toHaveBeenCalled();
      expect(service.journeyServiceMap).toEqual({1: serviceSpy});
    });
  });

  describe('getJourneyStatus', () => {
    it('should return not started if no steps have a status', () => {
      const result = service.getJourneyStatus(journey.steps);
      expect(result).toEqual(Status.notStarted);
    });

    it('should return in progress if at least one step has status', () => {
      journey.steps[1].status = Status.inProgress;
      const result = service.getJourneyStatus(journey.steps);
      expect(result).toEqual(Status.inProgress);
    });

    it('should return completed if all steps have status completed', () => {
      journey.steps[0].status = Status.completed;
      journey.steps[1].status = Status.completed;
      const result = service.getJourneyStatus(journey.steps);
      expect(result).toEqual(Status.completed);
    });
  });

  describe('getSelectedTab$', () => {
    it('should return the selectedTab$ subscriber', () => {
      service['selectedTab$'] = new ReplaySubject<string>(1);
      const result = service.getSelectedTab$();
      expect(result).toEqual(service['selectedTab$']);
    });
  });

  describe('publishSelectedTab', () => {
    it('should call next on the selectedTab subject', () => {
      service['selectedTab$'] = jasmine.createSpyObj('selectedTab$', ['next']);
      service.publishSelectedTab('selectedTab');
      expect(service['selectedTab$'].next).toHaveBeenCalledWith('selectedTab');
    });
  });

  describe('isValueEmpty', () => {
    it('should return false if value is truthy and not $', () => {
      const result = service.isValueEmpty('value');
      expect(result).toBeFalse();
    });

    it('should return true if value is $', () => {
      const result = service.isValueEmpty('$');
      expect(result).toBeTrue();
    });

    it('should return true if value is falsy and not 0', () => {
      const result = service.isValueEmpty('');
      expect(result).toBeTrue();
    });

    it('should return false if value is 0', () => {
      const result = service.isValueEmpty(0);
      expect(result).toBeFalse();
    });

    it('should return false if value is 10', () => {
      const result = service.isValueEmpty(10);
      expect(result).toBeFalse();
    });

    it('should return true if value is null', () => {
      const result = service.isValueEmpty(null);
      expect(result).toBeTrue();
    });
  });

  describe('fetchTabs', () => {
    it('when queryParam will be ignore', () => {
      const result = service.fetchTabs(['overview', 'steps', 'resources']);
      expect(result).toEqual([
        {label: 'Overview', link: 'overview'},
        {label: 'Steps', link: 'steps'},
        {label: 'Resources', link: 'resources'},
      ]);
    });
    it('when queryParam will not be ignore', () => {
      const result = service.fetchTabs(
        ['overview', 'steps', 'resources'],
        '?journeyType=all'
      );
      expect(result).toEqual([
        {label: 'Overview', link: 'overview?journeyType=all'},
        {label: 'Steps', link: 'steps?journeyType=all'},
        {label: 'Resources', link: 'resources?journeyType=all'},
      ]);
    });
  });

  describe('addDollar', () => {
    let element: StepContentElement;
    let val;

    beforeEach(() => {
      element = {
        validationRules: {type: ValidationType.dollar},
      };
      val = '500';
    });

    it('should return the same value if the type is not dollar', () => {
      element.validationRules.type = ValidationType.number;
      const result = service.addDollar(val, element);
      expect(result).toEqual(val);
    });

    it('should add $ to the value if the type is dollar', () => {
      const result = service.addDollar(val, element);
      expect(result).toEqual('$500');
    });
  });

  describe('removeDollar', () => {
    let element: StepContentElement;
    let val;

    beforeEach(() => {
      element = {
        validationRules: {type: ValidationType.dollar},
      };
      val = '$500';
    });

    it('should return the same value if the type is not dollar', () => {
      element.validationRules.type = ValidationType.number;
      const result = service.removeDollar(val, element);
      expect(result).toEqual(val);
    });

    it('should return the same value if the type is dollar but the value is undefined', () => {
      const result = service.removeDollar(undefined, element);
      expect(result).toBeUndefined();
    });

    it('should return the same value if the type is dollar but the value does not include $', () => {
      const result = service.removeDollar('500', element);
      expect(result).toEqual('500');
    });

    it('should remove $ from the value if the type is dollar and the value includes $', () => {
      const result = service.removeDollar(val, element);
      expect(result).toEqual('500');
    });
  });

  describe('setJourneyBackButton', () => {
    it('should set the journeyBackButton in localStorage and in the class prop', () => {
      spyOn(Storage.prototype, 'setItem');
      service['journeyBackButton'] = undefined;
      service.setJourneyBackButton(link);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'journeyBackButton',
        link
      );
      expect(service['journeyBackButton']).toEqual(link);
    });
  });

  describe('isComingSoon', () => {
    it('should return true if its web and there is both coming soon and regular content', () => {
      journey.comingSoonContent = journey.parsedLandingAndOverviewContent;
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const result = service.isComingSoon(journey);
      expect(result).toBeTrue();
    });

    it('should return false if its mobile and there is both coming soon and regular content', () => {
      journey.comingSoonContent = journey.parsedLandingAndOverviewContent;
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      const result = service.isComingSoon(journey);
      expect(result).toBeFalse();
    });

    it('should return true if there is only comingSoonContent', () => {
      journey.comingSoonContent = journey.parsedLandingAndOverviewContent;
      journey.parsedLandingAndOverviewContent = undefined;
      const result = service.isComingSoon(journey);
      expect(result).toBeTrue();
    });

    it('should return false if there is only landingAndOverviewContent', () => {
      const result = service.isComingSoon(journey);
      expect(result).toBeFalse();
    });
  });

  describe('getJourneyBackButton', () => {
    it('return getJourneyBackButton from local storage if it exists', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(link);
      const result = service.getJourneyBackButton();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        'journeyBackButton'
      );
      expect(result).toEqual(link);
    });

    it('return getJourneyBackButton from class property if localStorage is undefined', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('undefined');
      service['journeyBackButton'] = link;
      const result = service.getJourneyBackButton();
      expect(result).toEqual(link);
    });

    it('return getJourneyBackButton from class property if localStorage is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      service['journeyBackButton'] = link;
      const result = service.getJourneyBackButton();
      expect(result).toEqual(link);
    });
  });

  describe('getJourneyCompletionStatus', () => {
    it('should call baseService.get', async () => {
      await service.getJourneyCompletionStatus();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endpoints.completionStatus
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      spyOn(service['subscription'], 'unsubscribe');
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
  describe('setAddAccount', () => {
    it('should set the add account in localStorage and in the class prop', () => {
      spyOn(Storage.prototype, 'setItem');
      service['journeyAddAccount'] = undefined;
      service.setAddAccount(state);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'addAccount',
        state
      );
      expect(service['journeyAddAccount']).toEqual(state);
    });
  });
  describe('getAddAccount', () => {
    it('return getAddAccount from local storage if it exists', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(state);
      const result = service.getAddAccount();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('addAccount');
      expect(result).toEqual(state);
    });

    it('return getAddAccount from class property if localStorage is undefined', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('undefined');
      service['journeyAddAccount'] = state;
      const result = service.getAddAccount();
      expect(result).toEqual(state);
    });

    it('return getAddAccount from class property if localStorage is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      service['journeyAddAccount'] = state;
      const result = service.getAddAccount();
      expect(result).toEqual(state);
    });
  });
  describe('setRefreshMxAccount', () => {
    it('should set the add account in localStorage and in the class prop', () => {
      spyOn(Storage.prototype, 'setItem');
      service['journeyRefreshMxAccount'] = undefined;
      service.setRefreshMxAccount(state);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'refreshFlag',
        state
      );
      expect(service['journeyRefreshMxAccount']).toEqual(state);
    });
  });
  describe('getRefreshMxAccount', () => {
    it('return getRefreshMxAccount from local storage if it exists', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(state);
      const result = service.getRefreshMxAccount();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('refreshFlag');
      expect(result).toEqual(state);
    });

    it('return getRefreshMxAccount from class property if localStorage is undefined', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('undefined');
      service['journeyRefreshMxAccount'] = state;
      const result = service.getRefreshMxAccount();
      expect(result).toEqual(state);
    });

    it('return getRefreshMxAccount from class property if localStorage is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      service['journeyRefreshMxAccount'] = state;
      const result = service.getRefreshMxAccount();
      expect(result).toEqual(state);
    });
  });

  describe('removeContent', () => {
    it('should return the object without content without affecting the original object', () => {
      const original = {
        journeyStepName: '1',
        journeyStepCMSTagId: 'tagId1',
        msgType: 'msgType1',
        content: {},
      };
      const result = service.removeContent(original);
      expect(original).toEqual({
        journeyStepName: '1',
        journeyStepCMSTagId: 'tagId1',
        msgType: 'msgType1',
        content: {},
      });
      expect(result).toEqual({
        journeyStepName: '1',
        journeyStepCMSTagId: 'tagId1',
        msgType: 'msgType1',
      });
    });
  });

  describe('publishLeaveJourney', () => {
    it('should publish leave journey', () => {
      service.publishLeaveJourney();
      expect(leaveJourneyPublisherSpy.publish).toHaveBeenCalled();
    });
  });

  describe('getAnswerList', () => {
    it('should return the answers for the journey in a list', () => {
      const j = {
        journeyID: 7,
        journeyName: 'Journey name',
        lastModifiedStepIndex: 0,
        steps: [
          {
            answer: 'answer1',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
          },
          {
            answer: 'answer2',
            journeyStepCMSTagId: 'cmsTagId2',
            journeyStepName: '2',
            msgType: 'msgType2',
          },
          {
            journeyStepCMSTagId: 'cmsTagId3',
            journeyStepName: '3',
            msgType: 'msgType3',
          },
        ],
      };
      const result = service.getAnswerList(j);
      expect(result).toEqual(['answer1', 'answer2', undefined]);
    });
  });

  describe('closeModal', () => {
    it('should call modalController dismiss', () => {
      service.closeModal();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('getFilteredList', () => {
    const mockSearchQueryParams = 'page=1';
    let mockFilteredList: FilteredRecords;
    let serviceSpy;
    beforeEach(() => {
      mockFilteredList = {
        page: 1,
        totalPages: 10,
        totalEntries: 200,
        options: [
          {
            id: 1,
            name: 'option1',
          },
          {
            id: 2,
            name: 'option2',
          },
        ],
      };
      service.currentJourney = {
        journeyID: 5,
        journeyName: 'college',
        lastModifiedStepIndex: 1,
      };
      serviceSpy = jasmine.createSpyObj('CollegeService', ['filteredList']);
      serviceSpy.filteredList.and.returnValue(
        Promise.resolve(mockFilteredList)
      );
      service.journeyServiceMap = {
        5: serviceSpy,
      };
    });
    it('should call the filteredList ', async () => {
      const mockFilteredResult = await service.getFilteredList(
        mockSearchQueryParams
      );
      expect(serviceSpy.filteredList).toHaveBeenCalledWith(
        mockSearchQueryParams
      );
      expect(mockFilteredResult).toEqual(mockFilteredList);
    });
  });
});
