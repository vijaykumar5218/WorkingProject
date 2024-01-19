import {TestBed} from '@angular/core/testing';
import {BaseService} from '../../base/base-factory-provider';
import {SharedUtilityService} from '../../utility/utility.service';
import {endpoints} from '../constants/collegeEndpoints';
import {JourneyService} from '../journey.service';
import {
  CollegeJourneyData,
  CollegeRecords,
  DetailedFees,
} from '../models/collegeJourney.model';
import {Journey, StepContentElements} from '../models/journey.model';
import {CollegeService} from './college.service';
import {NotificationsSettingService} from '../../notification-setting/notification-setting.service';
import {of, ReplaySubject} from 'rxjs';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {
  MXAccount,
  MXAccountRootObject,
} from '@shared-lib/services/mx-service/models/mx.model';
import {ValidationType} from '../constants/validationType.enum';
import {CurrencyPipe} from '@angular/common';
import moment from 'moment';

describe('CollegeService', () => {
  let journey: Journey;
  let service: CollegeService;
  let baseServiceSpy;
  let utilityServiceSpy;
  let journeyServiceSpy;
  let stepsList;
  let notificationSettingsServiceSpy;
  let settingsPrefs;
  let collegeJourneyData: CollegeJourneyData;
  let journeyUtiltyServiceSpy;
  let mockMXAccountData;
  let MXServiceSpy;
  let dependent;
  let currencyPipeSpy;
  let element;
  let mockCollegeList: CollegeRecords;
  let mockDOB: string;
  let mockAge: number;

  beforeEach(() => {
    stepsList = [
      {
        journeyStepName: 'step1',
        journeyStepCMSTagId: 'cmsTag1',
        msgType: 'msgType1',
      },
      {
        journeyStepName: 'step2',
        journeyStepCMSTagId: 'cmsTag2',
        msgType: 'msgType2',
      },
    ];
    journey = {
      journeyID: 8,
      journeyName: 'JourneyName',
      lastModifiedStepIndex: 0,
      steps: [
        {
          journeyStepName: 'step1',
          journeyStepCMSTagId: 'tag1',
          msgType: 'type1',
          content: {pageElements: [{elements: []}]},
        },
        {
          journeyStepName: 'step2',
          journeyStepCMSTagId: 'tag2',
          msgType: 'type2',
        },
        {
          journeyStepName: 'step1',
          journeyStepCMSTagId: 'tag1',
          msgType: 'type1',
          content: {
            pageElements: [
              {elements: []},
              {
                elements: [
                  {},
                  {
                    id: 'dependentButtons',
                    answerId: 'whoAreYouSavingFor',
                    imageUrl: 'dependentImage',
                    idSuffix: '1234',
                  },
                  {},
                ],
              },
            ],
          },
        },
        {
          journeyStepName: 'step3',
          journeyStepCMSTagId: 'tag3',
          msgType: 'type3',
          content: {
            pageElements: [
              {
                elements: [
                  {id: 'typeCollege', type: 'select', answerId: 'collegeTypes'},
                  {
                    id: 'filingStatus',
                    type: 'select',
                    answerId: 'filingStatuses',
                  },
                  {id: 'stateResidence', type: 'select', answerId: 'states'},
                ],
              },
            ],
          },
        },
      ],
    };
    mockMXAccountData = {
      accounts: [
        {
          account_number: 'XXXXX9200',
          account_type_name: 'CREDIT_CARD',
          available_balance: '1000.0',
          balance: '1000.0',
          currency_code: 'USD',
          guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
          name: 'Gringotts Credit card',
          routing_number: '731775673',
          updated_at: '2022-05-16T10:42:10+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth)',
        },
      ],
    };
    mockCollegeList = {
      page: 1,
      totalPages: 430,
      totalEntries: 8599,
      schools: [
        {
          id: 5,
          name: 'Michigan Career and Technical Institute',
          schoolType: '1-Year Public',
          schoolDuration: '1',
          stateId: 'MI',
        },
        {
          id: 6,
          name: 'Miami Valley Career Technology Center',
          schoolType: '1-Year Public',
          schoolDuration: '1',
          stateId: 'OH',
        },
      ],
    };
    mockDOB = '2010-10';
    mockAge = Math.floor(
      moment().diff(moment(mockDOB + '-01'), 'month', true) / 12
    );
    baseServiceSpy = jasmine.createSpyObj('BaseService', ['get']);
    utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
      'appendBaseUrlToEndpoints',
    ]);
    utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endpoints);
    journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
      'getAnswerList',
      'safeParse',
      'updateJourneySteps',
      'getCurrentJourney',
      'isValueEmpty',
    ]);
    journeyServiceSpy.getCurrentJourney.and.returnValue(journey);
    notificationSettingsServiceSpy = jasmine.createSpyObj(
      'NotificationSettingsService',
      ['setPrefsSettings', 'getCheckedAndActive'],
      {notificationPrefsChanged$: of(settingsPrefs)}
    );
    journeyUtiltyServiceSpy = jasmine.createSpyObj('JourneyUtilityService', [
      'addAccountIconName',
    ]);
    MXServiceSpy = jasmine.createSpyObj('MXService', ['getMxAccountConnect']);
    MXServiceSpy.getMxAccountConnect.and.returnValue({
      subscribe: () => undefined,
    });
    collegeJourneyData = {
      dependents: [
        {
          id: 'dependent1',
          firstName: 'firstName1',
          age: 10,
        },
        {
          id: 'dependent1',
          firstName: 'firstName1',
          age: 10,
        },
        {
          id: 'dependent2',
          firstName: 'firstName2',
          age: 5,
        },
      ],
      filingStatuses: [
        {
          id: 'MARRIED_SEPARATELY',
          value: 'MARRIED_SEPARATELY',
          label: 'Married Filing Separately',
        },
      ],
      collegeTypes: [
        {
          id: '1',
          value: '1',
          label: 'In-state Public',
        },
      ],
      states: [
        {
          id: 'AL',
          value: 'AL',
          label: 'Alabama',
        },
      ],
      defaultYearsOfAttendance: 4,
      defaultCollegeStartAge: 18,
      collegeStartAge: {
        defaultValue: 18,
      },
      yearsOfAttendance: {
        defaultValue: 4,
      },
      inflationRate: [],
      rateOfReturn: {
        defaultValue: 6,
      },
      simpleAnnualInterestRate: {
        defaultValue: 4.82,
      },
    };
    dependent = {
      firstName: 'Tim',
      age: 3,
      id: 'id',
      dob: '2010-10',
    };
    currencyPipeSpy = jasmine.createSpyObj('CurrencyPipe', ['transform']);
    element = {
      label: 'How much can you contribute?',
      answerId: 'monthlyContribution',
      id: 'input',
      isRequired: true,
      subtype: 'circle',
      type: 'radioButtonInput',
      isToggle: false,
      options: [
        {
          label: '{dollarAmt} (100% Montly Contribution)',
          id: 'montlyContribution0',
          elements: [
            {
              id: 'intro',
              label: 'You may fall short of your college savings goal by {0}.',
              defaultHeader:
                'Nice! you may exceed your college savings goal by {0}!',
              elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
            },
          ],
        },
        {
          label: '{dollarAmt} (75% Montly Contribution)',
          id: 'montlyContribution1',
          elements: [
            {
              id: 'intro',
              label: 'You may fall short of your college savings goal by {0}.',
              defaultHeader:
                'Nice! you may exceed your college savings goal by {0}!',
              elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
            },
          ],
        },
        {
          label: '{dollarAmt} (50% Montly Contribution)',
          id: 'montlyContribution2',
          elements: [
            {
              id: 'intro',
              label: 'You may fall short of your college savings goal by {0}.',
              defaultHeader:
                'Nice! you may exceed your college savings goal by {0}!',
              elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
            },
          ],
        },
        {
          label: '{dollarAmt} (25% Montly Contribution)',
          id: 'montlyContribution3',
          elements: [
            {
              id: 'intro',
              label: 'You may fall short of your college savings goal by {0}.',
              defaultHeader:
                'Nice! you may exceed your college savings goal by {0}!',
              elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
            },
          ],
        },
        {
          label: 'Enter a specific monthly amount',
          id: 'specificMonthlyAmount',
          elements: [
            {
              answerId: 'specificMonthlyAmount',
              default: '$',
              id: 'input',
              isRequired: true,
              marginBottom: '25px',
              type: 'textField',
              validationRules: {
                decimalPlaces: 0,
                max: 999999999999999,
                min: 0,
                type: 'dollar',
              },
              elements: [
                {
                  flag: 'showNote',
                  id: 'intro',
                  label:
                    'You may fall short of your college savings goal by {0}.',
                  defaultHeader:
                    'Nice! you may exceed your college savings goal by {0}!',
                  elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
                  type: 'note',
                  marginTop: '0px',
                  marginBottom: '13px',
                },
              ],
            },
          ],
        },
        {
          label: 'Enter a One-Time Contribution',
          id: 'oneTimeContribution',
          elements: [
            {
              answerId: 'oneTimeContribution',
              default: '$',
              id: 'input',
              isRequired: true,
              marginBottom: '12px',
              type: 'textField',
              validationRules: {
                decimalPlaces: 0,
                max: 999999999999999,
                min: 0,
                type: 'dollar',
              },
              elements: [
                {
                  flag: 'showNote',
                  id: 'intro',
                  label:
                    'You may fall short of your college savings goal by {0}.',
                  defaultHeader:
                    'Nice! you may exceed your college savings goal by {0}!',
                  elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
                  type: 'note',
                  marginTop: '0px',
                  marginBottom: '13px',
                },
              ],
            },
            {
              id: 'intro',
              description:
                'You would need to make a One-Time Contribution of {0} to meet college savings goal.',
              elements: [
                {
                  answerId: 'predictedOneTimeContribution',
                  type: 'dollar',
                },
              ],
              marginTop: '0px',
              marginBottom: '20px',
            },
          ],
        },
      ],
    };
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {provide: JourneyService, useValue: journeyServiceSpy},
        {
          provide: NotificationsSettingService,
          useValue: notificationSettingsServiceSpy,
        },
        {provide: JourneyUtilityService, useValue: journeyUtiltyServiceSpy},
        {provide: MXService, useValue: MXServiceSpy},
        {provide: CurrencyPipe, useValue: currencyPipeSpy},
      ],
    });
    service = TestBed.inject(CollegeService);
    service['subscription'] = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
      'add',
    ]);
  });

  describe('constructor', () => {
    it('should append the base url to the endpoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
        endpoints
      );
    });
  });

  describe('initialize', () => {
    let setAnswersSpy;

    beforeEach(() => {
      setAnswersSpy = jasmine.createSpy();
      service['setAnswers'] = setAnswersSpy;
      baseServiceSpy.get.and.returnValue(Promise.resolve(collegeJourneyData));
      service['trackAddedDependents'] = jasmine.createSpy();
      notificationSettingsServiceSpy.getCheckedAndActive.and.returnValue({
        sectionActive: false,
      });
      service['setLinkAccountValue'] = jasmine.createSpy();
      service['setModalOptions'] = jasmine.createSpy();
      service['setStaticWhoAreYouSavingFor'] = jasmine.createSpy();
    });

    it('should call base service to get the dependents if the promise is not set', async () => {
      service['collegeJourneyDataPromise'] = undefined;
      await service.initialize(journey);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(endpoints.getCollegeData);
      const collegeData = await service['collegeJourneyDataPromise'];
      expect(collegeData).toEqual(collegeJourneyData);
    });

    it('should return the cached dependents if the promise is set', async () => {
      service['collegeJourneyDataPromise'] = Promise.resolve(
        collegeJourneyData
      );
      await service.initialize(journey);
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      const collegeData = await service['collegeJourneyDataPromise'];
      expect(collegeData).toEqual(collegeJourneyData);
    });

    it('should set defaults from service response', async () => {
      service.totalYears = undefined;
      service['collegeStartAge'] = undefined;
      service['inflationRateType'] = undefined;
      service['interestRate'] = undefined;
      service['rateOfReturn'] = undefined;
      await service.initialize(journey);
      expect(service.totalYears).toEqual(4);
      expect(service['collegeStartAge']).toEqual(18);
      expect(service['inflationRateType']).toEqual('Fixed');
      expect(service['interestRate']).toEqual(4.82);
      expect(service['rateOfReturn']).toEqual(6);
    });

    it('should set up the content for the dependent input if there are dependents', async () => {
      service.hasDependents = undefined;
      service.hasNoDependents = undefined;
      await service.initialize(journey);
      expect(service['trackAddedDependents']).toHaveBeenCalledWith(
        collegeJourneyData.dependents[0]
      );
      expect(service['trackAddedDependents']).toHaveBeenCalledWith(
        collegeJourneyData.dependents[2]
      );
      expect(journey.steps).toEqual([
        {
          journeyStepName: 'step1',
          journeyStepCMSTagId: 'tag1',
          msgType: 'type1',
          content: {pageElements: [{elements: []}]},
        },
        {
          journeyStepName: 'step2',
          journeyStepCMSTagId: 'tag2',
          msgType: 'type2',
        },
        {
          journeyStepName: 'step1',
          journeyStepCMSTagId: 'tag1',
          msgType: 'type1',
          content: {
            pageElements: [
              {elements: []},
              {
                elements: [
                  {},
                  {
                    id: 'input',
                    answerId: 'whoAreYouSavingFor',
                    imageUrl: 'dependentImage',
                    type: 'iconTextButtonSelect',
                    idSuffix: '1234',
                    options: [
                      {
                        id: 'dependent1',
                        label: 'firstName1',
                        imageUrl: 'dependentImage',
                        value: 'dependent1',
                        idSuffix: '12340',
                        elements: undefined,
                      },
                      {
                        id: 'dependent2',
                        label: 'firstName2',
                        imageUrl: 'dependentImage',
                        value: 'dependent2',
                        idSuffix: '12341',
                        elements: undefined,
                      },
                    ],
                  },
                  {},
                ],
              },
            ],
          },
        },
        {
          journeyStepName: 'step3',
          journeyStepCMSTagId: 'tag3',
          msgType: 'type3',
          content: {
            pageElements: [
              {
                elements: [
                  {
                    id: 'input',
                    type: 'select',
                    answerId: 'collegeTypes',
                    options: [
                      {
                        id: '1',
                        value: '1',
                        label: 'In-state Public',
                      },
                    ],
                  },
                  {
                    id: 'input',
                    type: 'select',
                    answerId: 'filingStatuses',
                    options: [
                      {
                        id: 'MARRIED_SEPARATELY',
                        value: 'MARRIED_SEPARATELY',
                        label: 'Married Filing Separately',
                      },
                    ],
                  },
                  {
                    id: 'input',
                    type: 'select',
                    answerId: 'states',
                    options: [
                      {
                        id: 'AL',
                        value: 'AL',
                        label: 'Alabama',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ]);
      expect(service.hasDependents).toBeTrue();
      expect(service.hasNoDependents).toBeFalse();
    });

    it('should set hasDependents to false and hasNoDependents to true if there are no dependents', async () => {
      service.hasDependents = undefined;
      service.hasNoDependents = undefined;
      collegeJourneyData.dependents = [];
      await service.initialize(journey);
      expect(service.hasDependents).toBeFalse();
      expect(service.hasNoDependents).toBeTrue();
    });

    it('should call setAnswers with the journey', async () => {
      await service.initialize(journey);
      expect(setAnswersSpy).toHaveBeenCalledWith(journey);
    });

    it('should remove the college type input content if there are no college option', async () => {
      collegeJourneyData.collegeTypes = [];
      await service.initialize(journey);
      expect(journey.steps[3].content.pageElements[0].elements).toEqual([
        {
          id: 'input',
          type: 'select',
          answerId: 'filingStatuses',
          options: [
            {
              id: 'MARRIED_SEPARATELY',
              value: 'MARRIED_SEPARATELY',
              label: 'Married Filing Separately',
            },
          ],
        },
        {
          id: 'input',
          type: 'select',
          answerId: 'states',
          options: [
            {
              id: 'AL',
              value: 'AL',
              label: 'Alabama',
            },
          ],
        },
      ]);
    });
    it('should remove the filing status input content if there are no filing status', async () => {
      collegeJourneyData.filingStatuses = [];
      await service.initialize(journey);
      expect(journey.steps[3].content.pageElements[0].elements).toEqual([
        {
          id: 'input',
          type: 'select',
          answerId: 'collegeTypes',
          options: [
            {
              id: '1',
              value: '1',
              label: 'In-state Public',
            },
          ],
        },
        {
          id: 'input',
          type: 'select',
          answerId: 'states',
          options: [
            {
              id: 'AL',
              value: 'AL',
              label: 'Alabama',
            },
          ],
        },
      ]);
    });

    it('should remove the states input content if there are no states', async () => {
      collegeJourneyData.states = [];
      await service.initialize(journey);
      expect(journey.steps[3].content.pageElements[0].elements).toEqual([
        {
          id: 'input',
          type: 'select',
          answerId: 'collegeTypes',
          options: [
            {
              id: '1',
              value: '1',
              label: 'In-state Public',
            },
          ],
        },
        {
          id: 'input',
          type: 'select',
          answerId: 'filingStatuses',
          options: [
            {
              id: 'MARRIED_SEPARATELY',
              value: 'MARRIED_SEPARATELY',
              label: 'Married Filing Separately',
            },
          ],
        },
      ]);
    });

    it('should call updateJourneySteps if its not the first initialize', async () => {
      service['firstInitialize'] = false;
      await service.initialize(journey);
      expect(journeyServiceSpy.updateJourneySteps).toHaveBeenCalledWith(
        journey.steps,
        journey.journeyID,
        false
      );
    });

    it('should set firstInitialize to false', async () => {
      service['firstInitialize'] = true;
      await service.initialize(journey);
      expect(service['firstInitialize']).toBeFalse();
    });

    it('should set displayNotificationSection according to getCheckedAndActive', async () => {
      service.displayNotificationSection = undefined;
      await service.initialize(journey);
      expect(
        notificationSettingsServiceSpy.getCheckedAndActive
      ).toHaveBeenCalledWith(settingsPrefs, 'AAPref');
      expect(service.displayNotificationSection).toBeTrue();
    });

    it('should call setModalOptions', async () => {
      await service.initialize(journey);
      expect(service['setModalOptions']).toHaveBeenCalledTimes(4);
    });
  });

  describe('setTrackerAnswers', () => {
    let dependent;
    let oldDependentId;
    let collegeJourneyDataPromise;

    beforeEach(() => {
      service['setDefaults'] = jasmine.createSpy();
      oldDependentId = 'oldDependentId';
      collegeJourneyDataPromise = Promise.resolve(collegeJourneyData);
      service['getCollegeData'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(collegeJourneyDataPromise));
      service['setAnswers'] = jasmine.createSpy();
    });

    it('should get the college data and call setDefaults with it', async () => {
      service.collegeJourneyDataPromise = undefined;
      await service.setTrackerAnswers(
        dependent,
        [],
        collegeJourneyDataPromise,
        oldDependentId
      );
      expect(service['collegeJourneyDataPromise']).toEqual(
        collegeJourneyDataPromise
      );
      expect(service['getCollegeData']).toHaveBeenCalled();
      expect(service['setDefaults']).toHaveBeenCalledWith(collegeJourneyData);
    });

    it('should set allDependentSteps', async () => {
      const allDependentSteps = [
        {
          id: 'step1',
          journeyStepName: 'step1',
          journeyStepCMSTagId: 'cmstag1',
          msgType: 'msgType1',
        },
        {
          id: 'step2',
          journeyStepName: 'step2',
          journeyStepCMSTagId: 'cmstag2',
          msgType: 'msgType2',
        },
      ];
      service.allDependentSteps = undefined;
      await service.setTrackerAnswers(
        dependent,
        allDependentSteps,
        collegeJourneyDataPromise,
        oldDependentId
      );
      expect(service.allDependentSteps).toEqual(allDependentSteps);
    });

    it('should call setAnswers', async () => {
      await service.setTrackerAnswers(
        dependent,
        [],
        collegeJourneyDataPromise,
        oldDependentId
      );
      expect(service['setAnswers']).toHaveBeenCalledWith(
        journey,
        dependent,
        oldDependentId
      );
    });
  });

  describe('setModalOptions', () => {
    it('should set the max, min, default and select options from the college data', () => {
      collegeJourneyData.yearsOfAttendance.maxValue = 6;
      collegeJourneyData.yearsOfAttendance.minValue = 0;
      collegeJourneyData.inflationRate = [
        {
          label: 'Fixed',
          defaultValue: 1.5,
        },
        {
          label: 'Historical',
          defaultValue: 3.3,
        },
      ];
      const pageElement: StepContentElements = {
        elements: [
          {answerId: 'answer1'},
          {
            answerId: 'editCollegeInfo',
            elements: [
              {
                elements: [
                  {
                    elements: [
                      {
                        id: 'input',
                        type: 'textField',
                        answerId: 'yearsOfAttendance',
                        validationRules: {},
                      },
                      {
                        id: 'input',
                        type: 'textField',
                        answerId: 'collegeStartAge',
                        default: 12,
                        validationRules: {
                          min: 5,
                          max: 10,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                elements: [
                  {
                    elements: [
                      {
                        id: 'annualInflationRateSelect',
                      },
                      {
                        id: 'input',
                        type: 'textField',
                        answerId: 'rateOfReturn',
                        validationRules: {},
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      service['setModalOptions'](pageElement, collegeJourneyData);
      expect(pageElement).toEqual({
        elements: [
          {
            answerId: 'answer1',
          },
          {
            answerId: 'editCollegeInfo',
            elements: [
              {
                elements: [
                  {
                    elements: [
                      {
                        id: 'input',
                        type: 'textField',
                        answerId: 'yearsOfAttendance',
                        validationRules: {
                          max: 6,
                          min: 0,
                        },
                        default: 4,
                      },
                      {
                        id: 'input',
                        type: 'textField',
                        answerId: 'collegeStartAge',
                        default: 12,
                        validationRules: {
                          min: 5,
                          max: 10,
                        },
                      },
                    ],
                  },
                ],
              },
              {
                elements: [
                  {
                    elements: [
                      {
                        id: 'input',
                        options: [
                          {
                            id: 'Fixed',
                            label: 'Fixed',
                            value: 'Fixed',
                          },
                          {
                            id: 'Historical',
                            label: 'Historical',
                            value: 'Historical',
                          },
                        ],
                      },
                      {
                        id: 'input',
                        type: 'textField',
                        answerId: 'rateOfReturn',
                        validationRules: {},
                        default: 6,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    it('should not change pageElement if it is not for editCollegeInfo', () => {
      const pageElement: StepContentElements = {elements: [{}]};
      service['setModalOptions'](pageElement, collegeJourneyData);
      expect(pageElement).toEqual({elements: [{}]});
    });
  });

  describe('trackAddedDependents', () => {
    it('should add the dependent to the list if its not already there', () => {
      service['addedDependents'] = [{id: 'dep1'}, {id: 'dep2'}];
      service['trackAddedDependents']({
        childFirstName: 'firstName',
        id: 'dep3',
        age: '5',
        dob: mockDOB,
      });
      expect(service['addedDependents']).toEqual([
        {id: 'dep1'},
        {id: 'dep2'},
        {firstName: 'firstName', age: mockAge, id: 'dep3', dob: mockDOB},
      ]);
    });

    it('should add the dependent to the list with firstName and age props', () => {
      service['addedDependents'] = [{id: 'dep1'}, {id: 'dep2'}];
      service['trackAddedDependents']({
        firstName: 'firstName',
        age: '5',
        id: 'dep3',
        dob: '2019-06',
      });
      expect(service['addedDependents'][2]).toEqual({
        firstName: 'firstName',
        age: 4,
        id: 'dep3',
        dob: '2019-06',
      });
    });
    it('should add the dependent to the list with dob and calculate age', () => {
      service['addedDependents'] = [{id: 'dep1'}, {id: 'dep2'}];
      service['trackAddedDependents']({
        firstName: 'firstName',
        id: 'dep3',
        dob: mockDOB,
      });
      expect(service['addedDependents'][2]).toEqual({
        firstName: 'firstName',
        age: mockAge,
        id: 'dep3',
        dob: mockDOB,
      });
    });
    it('should add the dependent to the list with dob', () => {
      service['addedDependents'] = [{id: 'dep1'}, {id: 'dep2'}];
      service['trackAddedDependents']({
        firstName: 'firstName',
        id: 'dep3',
        childAge: '5',
        dob: '2019-06',
      });
      expect(service['addedDependents'][2]).toEqual({
        firstName: 'firstName',
        age: 4,
        id: 'dep3',
        dob: '2019-06',
      });
    });
    it('should add age if dob is undefined', () => {
      service['addedDependents'] = [{id: 'dep1'}, {id: 'dep2'}];
      service['trackAddedDependents']({
        childFirstName: 'firstName',
        id: 'dep4',
        age: '21',
      });
      expect(service['addedDependents']).toEqual([
        {id: 'dep1'},
        {id: 'dep2'},
        {firstName: 'firstName', age: '21', id: 'dep4', dob: undefined},
      ]);
    });
    it('should add age if dob is undefined and child age is present', () => {
      service['addedDependents'] = [{id: 'dep1'}, {id: 'dep2'}];
      service['trackAddedDependents']({
        childFirstName: 'firstName',
        id: 'dep4',
        age: '21',
        childAge: '18',
      });
      expect(service['addedDependents']).toEqual([
        {id: 'dep1'},
        {id: 'dep2'},
        {firstName: 'firstName', age: '18', id: 'dep4', dob: undefined},
      ]);
    });
  });

  describe('initializeDependentFromList', () => {
    it('should add the dependents to the who are you saving for step', () => {
      const dep = {childFirstName: 'John', id: 'id1'};
      journeyServiceSpy.safeParse.and.returnValue(dep);
      journey.steps[2].content.pageElements[1].elements[1].options = [
        {id: 'option1'},
      ];
      const editAChildModal = {id: 'editAChildModal'};
      service['editAChildModal'] = editAChildModal;
      service['initializeDependentFromList']([JSON.stringify(dep)], journey);

      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify(dep)
      );
      expect(journey.steps[2]).toEqual({
        journeyStepName: 'step1',
        journeyStepCMSTagId: 'tag1',
        msgType: 'type1',
        content: {
          pageElements: [
            {elements: []},
            {
              elements: [
                {},
                {
                  id: 'input',
                  answerId: 'whoAreYouSavingFor',
                  imageUrl: 'dependentImage',
                  type: 'iconTextButtonSelect',
                  idSuffix: '1234',
                  options: [
                    {
                      id: 'option1',
                    },
                    {
                      id: 'id1',
                      label: 'John',
                      imageUrl: 'dependentImage',
                      value: 'id1',
                      idSuffix: '12341',
                      elements: [editAChildModal],
                    },
                  ],
                },
                {},
              ],
            },
          ],
        },
      });
    });
  });

  describe('setAnswers', () => {
    let journey;

    beforeEach(() => {
      journey = {
        journeyID: 1,
        lastModifiedStepIndex: 0,
      };
      spyOn(service.valueChange, 'next');
      service['initializeDependentFromList'] = jasmine.createSpy();
      service['updateStepValues'] = jasmine.createSpy();
      service['updateDetailedFees'] = jasmine.createSpy();
      service['setCurrentAge'] = jasmine.createSpy();
      service['setContributionAmts'] = jasmine.createSpy();
      service['setOtherPortfolioAnswers'] = jasmine.createSpy();
      service['setEditCollegeInfoAnswers'] = jasmine.createSpy();
      service['updatePortfolioProjector'] = jasmine.createSpy();
      service['setInflationRate'] = jasmine.createSpy();
      service['setStaticWhoAreYouSavingFor'] = jasmine.createSpy();
      service['getMXAccountData'] = jasmine.createSpy().and.returnValue(of({}));
      service['setCollegeDetails'] = jasmine.createSpy();
      journeyServiceSpy.safeParse.and.callFake(str => {
        let result;
        if (str === undefined) {
          result = str;
        } else {
          result = JSON.parse(str);
        }
        return result;
      });
      service['allDependentSteps'] = stepsList;
      journeyServiceSpy.getAnswerList.and.returnValue([]);
    });

    it('should call valueChange.next', async () => {
      await service['setAnswers'](undefined);
      expect(service.valueChange.next).toHaveBeenCalled();
    });

    it('should set monthlyPayment, existingSavings and oneTimeContribution to 0', async () => {
      service['monthlyPayment'] = undefined;
      service['existingSavings'] = undefined;
      service['oneTimeContribution'] = undefined;
      await service['setAnswers'](undefined);
      expect(service['monthlyPayment']).toEqual(0);
      expect(service['existingSavings']).toEqual(0);
      expect(service['oneTimeContribution']).toEqual(0);
    });

    it('should call initializeDependentFromList if addAChildModal answer exists', async () => {
      const answer = [
        JSON.stringify({childFirstName: 'John1', id: 'id1'}),
        JSON.stringify({childFirstName: 'John2', id: 'id2'}),
      ];
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          addAChildModal: answer,
        }),
      ]);
      await service['setAnswers'](journey);
      expect(service['initializeDependentFromList']).toHaveBeenCalledWith(
        answer,
        journey
      );
    });

    it('should set whoAreYouSavingFor and whoAreYouSavingForId', async () => {
      service.whoAreYouSavingFor = undefined;
      service.whoAreYouSavingForId = undefined;
      journeyServiceSpy.getAnswerList.and.returnValue([
        undefined,
        JSON.stringify({
          whoAreYouSavingFor: JSON.stringify({label: 'John', id: 'johnId'}),
        }),
        '{}',
        JSON.stringify({whoAreYouSavingFor: undefined}),
      ]);
      await service['setAnswers'](journey);
      expect(journeyServiceSpy.getAnswerList).toHaveBeenCalledWith(journey);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(undefined);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({
          whoAreYouSavingFor: JSON.stringify({label: 'John', id: 'johnId'}),
        })
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith('{}');
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({whoAreYouSavingFor: undefined})
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({label: 'John', id: 'johnId'})
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({whoAreYouSavingFor: undefined})
      );
      expect(service.whoAreYouSavingFor).toEqual('John');
      expect(service.whoAreYouSavingForId).toEqual('johnId');
      expect(service['updateStepValues']).toHaveBeenCalledWith(
        journey,
        undefined
      );
    });

    it('should not call updateStepValues if whoAreYouSavingForId did not change', async () => {
      service.whoAreYouSavingForId = 'johnId';
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          whoAreYouSavingFor: JSON.stringify({label: 'John', id: 'johnId'}),
        }),
      ]);
      await service['setAnswers'](journey);
      expect(service['updateStepValues']).not.toHaveBeenCalled();
    });

    it('should set to undefined if there is no answer under whoAreYouSavingFor', async () => {
      service.whoAreYouSavingForId = 'johnId';
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          whoAreYouSavingFor: undefined,
        }),
      ]);
      await service['setAnswers'](journey);
      expect(service['updateStepValues']).not.toHaveBeenCalled();
    });

    it('should call setCollegeDetails if typeCollege is defined in answerlist', async () => {
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          typeCollege: JSON.stringify({label: 'In state', id: '4'}),
        }),
      ]);
      await service['setAnswers'](journey);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({
          typeCollege: JSON.stringify({label: 'In state', id: '4'}),
        })
      );
      expect(service['setCollegeDetails']).toHaveBeenCalledWith({
        typeCollege: JSON.stringify({label: 'In state', id: '4'}),
      });
    });

    it('should call setCollegeDetails if collegeName is defined in answerlist', async () => {
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          collegeName: JSON.stringify({name: 'College', id: '4'}),
        }),
      ]);
      await service['setAnswers'](journey);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({
          collegeName: JSON.stringify({name: 'College', id: '4'}),
        })
      );
      expect(service['setCollegeDetails']).toHaveBeenCalledWith({
        collegeName: JSON.stringify({name: 'College', id: '4'}),
      });
    });

    it('should not set inflation if theres no entry for the current college type', async () => {
      service.inflation = undefined;
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          typeCollege: JSON.stringify({label: 'In state', id: '15'}),
        }),
        JSON.stringify({typeCollege: undefined}),
      ]);
      await service['setAnswers'](journey);
      expect(service.inflation).toBeUndefined();
    });

    it('should set false value of scholarshipsNotIncluded if calculateFinancialAid answer is yes', async () => {
      service.scholarshipsNotIncluded = undefined;
      service.scholarshipsIncluded = undefined;
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          calculateFinancialAid: JSON.stringify({calculateFinancialAid: 'yes'}),
        }),
        JSON.stringify({calculateFinancialAid: undefined}),
      ]);
      await service['setAnswers'](journey);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({
          calculateFinancialAid: JSON.stringify({calculateFinancialAid: 'yes'}),
        })
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({calculateFinancialAid: undefined})
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({calculateFinancialAid: 'yes'})
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({calculateFinancialAid: undefined})
      );
      expect(service.scholarshipsNotIncluded).toEqual(false);
      expect(service.scholarshipsIncluded).toEqual(true);
    });

    it('should set true value of scholarshipsNotIncluded if calculateFinancialAid answer is no', async () => {
      service.scholarshipsNotIncluded = undefined;
      service.scholarshipsIncluded = undefined;
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          calculateFinancialAid: JSON.stringify({calculateFinancialAid: 'no'}),
        }),
        JSON.stringify({calculateFinancialAid: undefined}),
      ]);
      await service['setAnswers'](journey);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({
          calculateFinancialAid: JSON.stringify({calculateFinancialAid: 'no'}),
        })
      );
      expect(service.scholarshipsNotIncluded).toEqual(true);
      expect(service.scholarshipsIncluded).toEqual(false);
    });

    it('should call updateDetailFees, updatePortfolioProjector and setInflationRate', async () => {
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          typeCollege: JSON.stringify({label: 'In state', id: 4}),
          monthlyContribution: JSON.stringify({radioButton: 'answer'}),
        }),
        JSON.stringify({typeCollege: undefined}),
      ]);
      await service['setAnswers'](journey);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({radioButton: 'answer'})
      );
      expect(service['updateDetailedFees']).toHaveBeenCalled();
      expect(service['updatePortfolioProjector']).toHaveBeenCalledWith(
        journey,
        {radioButton: 'answer'},
        true
      );
      expect(service['setInflationRate']).toHaveBeenCalledWith();
    });

    it('should call setContributionAmts, setOtherPortfolioAnswers and setEditCollegInfoInputs', async () => {
      const answer = {
        addAChildModal: 'addAChildModal',
      };
      journeyServiceSpy.getAnswerList.and.returnValue([JSON.stringify(answer)]);
      await service['setAnswers'](journey);
      expect(service['setContributionAmts']).toHaveBeenCalledWith(answer);
      expect(service['setOtherPortfolioAnswers']).toHaveBeenCalledWith(answer);
      expect(service['setEditCollegeInfoAnswers']).toHaveBeenCalledWith(answer);
    });

    it('should call setCurrentAge', async () => {
      await service['setAnswers'](journey);
      expect(service['setCurrentAge']).toHaveBeenCalledWith(journey, false);
    });

    it('should call setStaticWhoAreYouSavingFor and setCurrentAge with true if a dependent is passed in', async () => {
      const oldDependentId = 'oldDependentId';
      await service['setAnswers'](journey, dependent, oldDependentId);
      expect(service['setStaticWhoAreYouSavingFor']).toHaveBeenCalledWith(
        dependent,
        journey,
        oldDependentId
      );
      expect(service['setCurrentAge']).toHaveBeenCalledWith(journey, true);
    });

    it('should not call checkAddAChildAnswer and setWhoAreYouSavingFor if a dependent is passed in', async () => {
      journeyServiceSpy.getAnswerList.and.returnValue([JSON.stringify({})]);
      service['checkAddAChildAnswer'] = jasmine.createSpy();
      service['setWhoAreYouSavingFor'] = jasmine.createSpy();
      await service['setAnswers'](journey, dependent);
      expect(service['checkAddAChildAnswer']).not.toHaveBeenCalled();
      expect(service['checkAddAChildAnswer']).not.toHaveBeenCalled();
    });

    it('should set account linked props when linkExistingAccount is defined', async () => {
      service['setMxAccount'] = jasmine.createSpy();
      service['MXAccountData'] = mockMXAccountData;
      journeyServiceSpy.getAnswerList.and.returnValue([
        JSON.stringify({
          linkExistingAccount: 'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9',
        }),
      ]);
      await service['setAnswers'](journey);
      expect(service.accountLinkedId).toEqual(
        'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9'
      );
    });
  });

  describe('setCollegeDetails', () => {
    let collegeListSpy;
    let parsedAnswers;
    beforeEach(() => {
      parsedAnswers = {
        typeCollege: JSON.stringify({label: 'College', id: '4'}),
        collegeName: JSON.stringify({name: 'College', id: '4'}),
      };
      mockCollegeList = {
        page: 1,
        totalPages: 430,
        totalEntries: 8599,
        schools: [
          {
            id: 4,
            name: 'College',
            schoolType: '1-Year Public',
            schoolDuration: '1',
            stateId: 'MI',
          },
        ],
      };
      collegeListSpy = spyOn(service, 'getCollegeList');
      collegeListSpy.and.returnValue(Promise.resolve(mockCollegeList));
      collegeJourneyData.collegeTypes.push({
        id: 4,
        value: '4',
        inflationRate: 2.5,
        label: 'In-state Public4',
      });
      service['getCollegeData'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(collegeJourneyData));
      journeyServiceSpy.safeParse.and.callFake(str => {
        let result;
        if (str === undefined) {
          result = str;
        } else {
          result = JSON.parse(str);
        }
        return result;
      });
      journeyServiceSpy.safeParse.and.returnValue({label: 'College', id: '4'});
    });

    it('should set typeCollege and typeCollegeId if typeCollegeAns is defined with the name and id of the typeCollege answer', async () => {
      service.typeCollege = undefined;
      service['typeCollegeId'] = undefined;
      parsedAnswers = {
        typeCollege: JSON.stringify({label: 'College', id: '4'}),
      };
      await service['setCollegeDetails'](parsedAnswers);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        parsedAnswers['typeCollege']
      );
      expect(service.typeCollege).toEqual('College');
      expect(service['typeCollegeId']).toEqual('4');
    });

    it('should set historicalInflationRate if typeCollegeAns is defined', async () => {
      service['historicalInflationRate'] = 5.1;
      parsedAnswers = {
        typeCollege: JSON.stringify({label: 'College', id: '4'}),
      };
      journeyServiceSpy.safeParse.and.returnValue({label: 'College', id: '4'});
      await service['setCollegeDetails'](parsedAnswers);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        parsedAnswers['typeCollege']
      );
      expect(service['getCollegeData']).toHaveBeenCalled();
    });

    it('should not set historicalInflationRate if typeCollegeAns is undefined', async () => {
      service['historicalInflationRate'] = undefined;
      parsedAnswers = {
        collegeName: JSON.stringify({name: 'College', id: '4'}),
      };
      await service['setCollegeDetails'](parsedAnswers);
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalledWith(
        parsedAnswers['typeCollege']
      );
      expect(service['getCollegeData']).not.toHaveBeenCalled();
      expect(service['historicalInflationRate']).toBeUndefined();
    });

    it('should set collegeName and collegeNameId,call getCollegeList if collegeNameAns is defined with the name and id of the collegeName answer', async () => {
      service.collegeName = undefined;
      service['collegeNameId'] = undefined;
      service['totalYears'] = 1;
      parsedAnswers = {
        collegeName: JSON.stringify({name: 'College with a space', id: '4'}),
      };
      journeyServiceSpy.safeParse.and.returnValue({
        name: 'College with a space',
        id: '4',
      });
      await service['setCollegeDetails'](parsedAnswers);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        parsedAnswers['collegeName']
      );
      expect(service.collegeName).toEqual('College with a space');
      expect(service['collegeNameId']).toEqual('4');
      expect(collegeListSpy).toHaveBeenCalledWith(
        'page=1&name=College%20with%20a%20space'
      );
      expect(service['totalYears']).toEqual(
        Number(mockCollegeList.schools[0].schoolDuration)
      );
    });

    it('should set isCollegeName to true if collegeNameAns is defined with the name and id of the collegeName answer', async () => {
      service.isCollegeName = false;
      parsedAnswers = {
        collegeName: JSON.stringify({name: 'College', id: '4'}),
      };
      journeyServiceSpy.safeParse.and.returnValue({name: 'College', id: '4'});
      await service['setCollegeDetails'](parsedAnswers);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        parsedAnswers['collegeName']
      );
      expect(service.isCollegeName).toBeTrue();
      expect(service.isTypeCollege).toBeFalse();
    });

    it('should set isTypeCollege to true if collegeNameAns is undefined', async () => {
      service.isTypeCollege = false;
      parsedAnswers = {
        typeCollege: JSON.stringify({label: 'College', id: '4'}),
      };
      await service['setCollegeDetails'](parsedAnswers);
      journeyServiceSpy.safeParse.and.returnValue({label: 'College', id: '4'});
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        parsedAnswers['typeCollege']
      );
      expect(service.isCollegeName).toBeFalse();
      expect(service.isTypeCollege).toBeTrue();
    });

    it('should not call getCollegeList if parsedAnswers does not contain collegeName & typeCollege', async () => {
      parsedAnswers = {};
      await service['setCollegeDetails'](parsedAnswers);
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
      expect(collegeListSpy).not.toHaveBeenCalledWith('page=1&name=College');
    });
  });

  describe('setInflationRate', () => {
    it('should set to the historical inflation rate if inflationRateType is Historical and isTypeCollege is true', async () => {
      service['inflationRateType'] = 'Historical';
      service['inflation'] = undefined;
      service['isTypeCollege'] = true;
      service['historicalInflationRate'] = 5.1;
      await service['setInflationRate']();
      expect(service['inflation']).toEqual(5.1);
    });

    it('should set to the default inflation rate of the inflation rate type if inflationRateType is not historical and isTypeCollege is true', async () => {
      service['inflationRateType'] = 'Fixed';
      service['isTypeCollege'] = true;
      service['getCollegeData'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(collegeJourneyData));
      collegeJourneyData.inflationRate = [
        {label: 'Historical', defaultValue: 3.3},
        {label: 'Fixed', defaultValue: 1.6},
      ];
      service['inflation'] = undefined;
      service['historicalInflationRate'] = 5.1;
      await service['setInflationRate']();
      expect(service['getCollegeData']).toHaveBeenCalled();
      expect(service['inflation']).toEqual(1.6);
    });

    it('should set to the default inflation rate of the inflation rate type if inflationRateType is not historical and isTypeCollege is false', async () => {
      service['inflationRateType'] = 'Fixed';
      service['isTypeCollege'] = false;
      service['getCollegeData'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(collegeJourneyData));
      collegeJourneyData.inflationRate = [
        {label: 'Historical', defaultValue: 3.3},
        {label: 'Fixed', defaultValue: 1.6},
      ];
      service['inflation'] = undefined;
      service['historicalInflationRate'] = 5.1;
      await service['setInflationRate']();
      expect(service['getCollegeData']).toHaveBeenCalled();
      expect(service['inflation']).toEqual(1.6);
    });

    it('should set to the default inflation rate of the inflation rate type if inflationRateType is historical and isTypeCollege is false', async () => {
      service['inflationRateType'] = 'Historical';
      service['isTypeCollege'] = false;
      service['getCollegeData'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(collegeJourneyData));
      collegeJourneyData.inflationRate = [
        {label: 'Historical', defaultValue: 3.3},
        {label: 'Fixed', defaultValue: 1.6},
      ];
      service['inflation'] = undefined;
      await service['setInflationRate']();
      expect(service['getCollegeData']).toHaveBeenCalled();
      expect(service['inflation']).toEqual(3.3);
    });
  });

  describe('setCurrentAge', () => {
    beforeEach(() => {
      service.whoAreYouSavingForId = 'id';
      service.currentAge = undefined;
      service['updateStartAgeMin'] = jasmine.createSpy();
      service['setCollegeStartAge'] = jasmine.createSpy();
    });

    it('should set the age from whoAreYouSavingForAge if it is defined', () => {
      service['whoAreYouSavingForAge'] = 12;
      service['setCurrentAge'](journey, dependent);
      expect(service.currentAge).toEqual(12);
    });

    it('should find the current dependent and set the age based on it', () => {
      service['addedDependents'] = [{}, {}, {id: 'id', age: 15}, {}];
      service['whoAreYouSavingForAge'] = undefined;
      dependent = undefined;
      service['setCurrentAge'](journey, dependent);
      expect(service.currentAge).toEqual(15);
      expect(service['updateStartAgeMin']).toHaveBeenCalled();
    });

    it('should not set the age if there is no addedDependent', () => {
      service['addedDependents'] = [{}, {}, {}];
      service['setCurrentAge'](journey, dependent);
      expect(service.currentAge).toBeUndefined();
    });

    it('should not set the age if there is no whoAreYouSavingForId', () => {
      service.whoAreYouSavingForId = undefined;
      service['setCurrentAge'](journey, dependent);
      expect(service.currentAge).toBeUndefined();
    });

    it('should not call updateStartAgeMin if skipUpdate is true', () => {
      service['setCurrentAge'](journey, dependent);
      expect(service['updateStartAgeMin']).not.toHaveBeenCalled();
    });

    it('should set yearsTilStart', () => {
      service['whoAreYouSavingForAge'] = 12;
      service['collegeStartAge'] = 18;
      service['yearsTilStart'] = undefined;
      service['setCurrentAge'](journey, dependent);
      expect(service['yearsTilStart']).toEqual(6);
    });

    it('should call setCollegeStartAge if skipUpdate is true', () => {
      service['setCurrentAge'](journey, dependent);
      expect(service['setCollegeStartAge']).toHaveBeenCalled();
    });
  });

  describe('setCollegeStartAge', () => {
    beforeEach(() => {
      service['collegeStartAge'] = 18;
    });
    it('should set college start age to current age if current age is greater than 18', () => {
      service.currentAge = 55;
      service['setCollegeStartAge']();
      expect(service['collegeStartAge']).toEqual(55);
    });
    it('should not set college start age to current age if current age is less than 18', () => {
      service.currentAge = 14;
      service['setCollegeStartAge']();
      expect(service['collegeStartAge']).not.toEqual(14);
    });
  });
  describe('updateStartAgeMin', () => {
    beforeEach(() => {
      collegeJourneyData.collegeStartAge = {defaultValue: 18};
      service['getCollegeData'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(collegeJourneyData));
      spyOn(service['validationRulesSubject'], 'next');
    });

    it('should update the collegeStartAge minimum and default in editCollegeInfo', async () => {
      service.currentAge = 12;
      service['collegeStartAge'] = 18;
      const journey: Journey = {
        steps: [
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
          },
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
            content: {
              pageElements: [
                {elements: []},
                {
                  elements: [
                    {
                      answerId: 'editCollegeInfo',
                      elements: [
                        {
                          elements: [
                            {
                              elements: [
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'yearsOfAttendance',
                                  validationRules: {
                                    max: 6,
                                    min: 0,
                                  },
                                  default: 4,
                                },
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'collegeStartAge',
                                  default: 12,
                                  validationRules: {
                                    min: 5,
                                    max: 10,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
        journeyID: 1,
        journeyName: 'College',
        lastModifiedStepIndex: 0,
      };

      await service['updateStartAgeMin'](journey);
      expect(journey).toEqual({
        steps: [
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
          },
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
            content: {
              pageElements: [
                {elements: []},
                {
                  elements: [
                    {
                      answerId: 'editCollegeInfo',
                      elements: [
                        {
                          elements: [
                            {
                              elements: [
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'yearsOfAttendance',
                                  validationRules: {
                                    max: 6,
                                    min: 0,
                                  },
                                  default: 4,
                                },
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'collegeStartAge',
                                  default: 18,
                                  validationRules: {
                                    min: 18,
                                    max: 10,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
        journeyID: 1,
        journeyName: 'College',
        lastModifiedStepIndex: 0,
      });
    });

    it('should use the currentAge as the default if the currentAge is greater than the default', async () => {
      service.currentAge = 20;
      const journey: Journey = {
        steps: [
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
          },
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
            content: {
              pageElements: [
                {elements: []},
                {
                  elements: [
                    {
                      answerId: 'editCollegeInfo',
                      elements: [
                        {
                          elements: [
                            {
                              elements: [
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'yearsOfAttendance',
                                  validationRules: {
                                    max: 6,
                                    min: 0,
                                  },
                                  default: 4,
                                },
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'collegeStartAge',
                                  default: 12,
                                  validationRules: {
                                    min: 5,
                                    max: 10,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
        journeyID: 1,
        journeyName: 'College',
        lastModifiedStepIndex: 0,
      };
      service['collegeStartAge'] = 18;
      await service['updateStartAgeMin'](journey);
      expect(journey).toEqual({
        steps: [
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
          },
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
            content: {
              pageElements: [
                {elements: []},
                {
                  elements: [
                    {
                      answerId: 'editCollegeInfo',
                      elements: [
                        {
                          elements: [
                            {
                              elements: [
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'yearsOfAttendance',
                                  validationRules: {
                                    max: 6,
                                    min: 0,
                                  },
                                  default: 4,
                                },
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'collegeStartAge',
                                  default: 20,
                                  validationRules: {
                                    min: 20,
                                    max: 10,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
        journeyID: 1,
        journeyName: 'College',
        lastModifiedStepIndex: 0,
      });
      expect(service['collegeStartAge']).toEqual(20);
      expect(service['validationRulesSubject'].next).toHaveBeenCalledWith({
        answerId: 'collegeStartAge',
        validationRules: {
          min: 20,
          max: 10,
        },
        collegeStartAge: '20',
      });
    });

    it('should set the collegeStartAge if it is currentAge is greater than 18', async () => {
      service.currentAge = 28;
      service['collegeStartAge'] = 18;
      const journey: Journey = {
        steps: [
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
          },
          {
            journeyStepCMSTagId: '',
            journeyStepName: '',
            msgType: '',
            content: {
              pageElements: [
                {elements: []},
                {
                  elements: [
                    {
                      answerId: 'editCollegeInfo',
                      elements: [
                        {
                          elements: [
                            {
                              elements: [
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'yearsOfAttendance',
                                  validationRules: {
                                    max: 6,
                                    min: 0,
                                  },
                                  default: 4,
                                },
                                {
                                  id: 'input',
                                  type: 'textField',
                                  answerId: 'collegeStartAge',
                                  default: 12,
                                  validationRules: {
                                    min: 5,
                                    max: 10,
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
        journeyID: 1,
        journeyName: 'College',
        lastModifiedStepIndex: 0,
      };
      await service['updateStartAgeMin'](journey);
      expect(service['collegeStartAge']).toEqual(28);
    });
  });

  describe('setStaticWhoAreYouSavingFor', () => {
    it('should set whoAreYouSavingFor props and call updateStepValues', () => {
      service['updateStepValues'] = jasmine.createSpy();
      service.whoAreYouSavingFor = undefined;
      service.whoAreYouSavingForId = undefined;
      service['whoAreYouSavingForAge'] = undefined;
      service['setStaticWhoAreYouSavingFor'](
        {firstName: 'Ralph', age: 10, id: 'abcdef'},
        journey,
        '123456'
      );
      expect(service.whoAreYouSavingFor).toEqual('Ralph');
      expect(service.whoAreYouSavingForId).toEqual('abcdef');
      expect(service['whoAreYouSavingForAge']).toEqual(10);
      expect(service['updateStepValues']).toHaveBeenCalledWith(
        journey,
        '123456',
        false
      );
    });
  });

  describe('setContributionAmts', () => {
    beforeEach(() => {
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
      service['oneTimeContribution'] = undefined;
      service['monthlyPayment'] = undefined;
      service['existingSavings'] = undefined;
    });

    it('should not set oneTimeContribution, monthlyPayment or existingSavings if no answer to haveYouStartedSavingForChild is there', () => {
      service['setContributionAmts']({});
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
      expect(service['oneTimeContribution']).toBeUndefined();
      expect(service['monthlyPayment']).toBeUndefined();
      expect(service['existingSavings']).toBeUndefined();
    });

    it('should not set oneTimeContribution, monthlyPayment or existingSavings if no parsed answer to haveYouStartedSavingForChild is there', () => {
      service['setContributionAmts']({
        haveYouStartedSavingForChild: 'haveYouStartedSavingForChild',
      });
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        'haveYouStartedSavingForChild'
      );
      expect(service['oneTimeContribution']).toBeUndefined();
      expect(service['monthlyPayment']).toBeUndefined();
      expect(service['existingSavings']).toBeUndefined();
    });

    it('should not set oneTimeContribution, monthlyPayment or existingSavings if parsed answer to haveYouStartedSavingForChild is there and it is no', () => {
      journeyServiceSpy.safeParse.and.returnValue({
        haveYouStartedSavingForChild: 'no',
        additionalContribution: '$500.27',
        howMuchAreYouSavingMonthly: '$126.61',
        howMuchHaveYouSavedSoFar: '$1652.19',
      });
      service['setContributionAmts']({
        haveYouStartedSavingForChild: 'haveYouStartedSavingForChild',
      });
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        'haveYouStartedSavingForChild'
      );
      expect(service['oneTimeContribution']).toBeUndefined();
      expect(service['monthlyPayment']).toBeUndefined();
      expect(service['existingSavings']).toBeUndefined();
    });

    it('should set oneTimeContribution, monthlyPayment and existingSavings if parsed answer to haveYouStartedSavingForChild is there and values are not empty', () => {
      journeyServiceSpy.safeParse.and.returnValue({
        haveYouStartedSavingForChild: 'yes',
        additionalContribution: '$500.27',
        howMuchAreYouSavingMonthly: '$126.61',
        howMuchHaveYouSavedSoFar: '$1652.19',
      });
      service['setContributionAmts']({
        haveYouStartedSavingForChild: 'haveYouStartedSavingForChild',
      });
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('$500.27');
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('$126.61');
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('$1652.19');
      expect(service['oneTimeContribution']).toEqual(500.27);
      expect(service['monthlyPayment']).toEqual(126.61);
      expect(service['existingSavings']).toEqual(1652.19);
    });

    it('should not set oneTimeContribution, monthlyPayment and existingSavings if parsed answer to haveYouStartedSavingForChild is there but values are empty', () => {
      journeyServiceSpy.safeParse.and.returnValue({
        haveYouStartedSavingForChild: 'yes',
        additionalContribution: 500.27,
        howMuchAreYouSavingMonthly: 126.61,
        howMuchHaveYouSavedSoFar: 1652.19,
      });
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      service['setContributionAmts']({
        haveYouStartedSavingForChild: 'haveYouStartedSavingForChild',
      });
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(500.27);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(126.61);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(1652.19);
      expect(service['oneTimeContribution']).toBeUndefined();
      expect(service['monthlyPayment']).toBeUndefined();
      expect(service['existingSavings']).toBeUndefined();
    });
  });

  describe('setOtherPortfolioAnswers', () => {
    beforeEach(() => {
      service['householdIncome'] = undefined;
      service['stateId'] = undefined;
      service['taxFilingStatus'] = undefined;
      journeyServiceSpy.safeParse.and.callFake(str => JSON.parse(str));
    });

    it('should set the other portfolio answer props', () => {
      const parsedAnswer = {
        householdIncome: '$150000',
        stateResidence: JSON.stringify({id: 'MA'}),
        filingStatus: JSON.stringify({id: 'HEAD_HOUSEHOLD'}),
      };
      service['setOtherPortfolioAnswers'](parsedAnswer);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({id: 'MA'})
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({id: 'HEAD_HOUSEHOLD'})
      );
      expect(service['householdIncome']).toEqual(150000);
      expect(service['stateId']).toEqual('MA');
      expect(service['taxFilingStatus']).toEqual('HEAD_HOUSEHOLD');
    });

    it('should not set the other portfolio answer props if there is no answer', () => {
      service['setOtherPortfolioAnswers']({});
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
      expect(service['householdIncome']).toBeUndefined();
      expect(service['stateId']).toBeUndefined();
      expect(service['taxFilingStatus']).toBeUndefined();
    });
  });

  describe('setEditCollegeInfoAnswers', () => {
    beforeEach(() => {
      service['collegeStartAge'] = undefined;
      service.totalYears = undefined;
      service['inflationRateType'] = undefined;
      service['rateOfReturn'] = undefined;
      service['interestRate'] = undefined;
      journeyServiceSpy.safeParse.and.callFake(str => JSON.parse(str));
    });

    it('should not set the props if there is no editCollegeInfo answer', () => {
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      service['setEditCollegeInfoAnswers']({});
      expect(service['collegeStartAge']).toBeUndefined();
      expect(service.totalYears).toBeUndefined();
      expect(service['inflationRateType']).toBeUndefined();
      expect(service['rateOfReturn']).toBeUndefined();
      expect(service['interestRate']).toBeUndefined();
    });

    it('should not set the props if there is is an answer to the modal but the values are all undefined', () => {
      service['setEditCollegeInfoAnswers']({
        editCollegeInfo: JSON.stringify({editAssumptions: JSON.stringify({})}),
      });
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({editAssumptions: JSON.stringify({})})
      );
      expect(service['collegeStartAge']).toBeUndefined();
      expect(service.totalYears).toBeUndefined();
      expect(service['inflationRateType']).toBeUndefined();
      expect(service['rateOfReturn']).toBeUndefined();
      expect(service['interestRate']).toBeUndefined();
    });

    it('should set the props if there is is an answer to the modal and the values are all defined', () => {
      service['setEditCollegeInfoAnswers']({
        editCollegeInfo: JSON.stringify({
          editAssumptions: JSON.stringify({
            collegeStartAge: 17,
            yearsOfAttendance: 3,
            annualInflationRate: JSON.stringify({id: 'HISTORICAL'}),
            rateOfReturn: 6,
            simpleAnnualInterestRate: 4.82,
          }),
        }),
      });
      expect(service['collegeStartAge']).toEqual(17);
      expect(service.totalYears).toEqual(3);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({id: 'HISTORICAL'})
      );
      expect(service['inflationRateType']).toEqual('HISTORICAL');
      expect(service['rateOfReturn']).toEqual(6);
      expect(service['interestRate']).toEqual(4.82);
    });
  });

  describe('stepChange', () => {
    it('should call setAnswers with the journey', () => {
      service['setAnswers'] = jasmine.createSpy();
      service.stepChange(journey);
      expect(service['setAnswers']).toHaveBeenCalledWith(journey);
    });
  });

  describe('processForSave', () => {
    let addDependentIdSpy;
    beforeEach(() => {
      addDependentIdSpy = jasmine.createSpy();
      service['addDependentId'] = addDependentIdSpy;
    });

    it('should add the dependent id to all steps except for who_are_you_saving_for if the dependent id is set', () => {
      service.whoAreYouSavingForId = 'id';
      addDependentIdSpy.and.callFake(step => {
        step.answer = step.journeyStepName + 'dependentIdAdded';
      });
      stepsList[0].journeyStepName = 'who_are_you_saving_for';
      service['allDependentSteps'] = stepsList;
      service.processForSave(stepsList);
      expect(addDependentIdSpy).not.toHaveBeenCalledWith(stepsList[0], 0);
      expect(addDependentIdSpy).toHaveBeenCalledWith(stepsList[1], 1);
      expect(stepsList).toEqual([
        {
          journeyStepName: 'who_are_you_saving_for',
          journeyStepCMSTagId: 'cmsTag1',
          msgType: 'msgType1',
        },
        {
          journeyStepName: 'step2',
          journeyStepCMSTagId: 'cmsTag2',
          msgType: 'msgType2',
          answer: 'step2dependentIdAdded',
        },
      ]);
    });

    it('should not add the dependent id if the dependent id is not set', () => {
      service.whoAreYouSavingForId = undefined;
      service.processForSave(stepsList);
      expect(addDependentIdSpy).not.toHaveBeenCalled();
    });
  });

  describe('addDependentId', () => {
    let step;
    let index;
    let id;

    beforeEach(() => {
      stepsList[0].value = {step: 'value'};
      step = stepsList[0];
      index = 1;
      id = 'id';
      service['allDependentSteps'] = [
        undefined,
        {...stepsList[0], answer: 'newAnswer'},
      ];
      journeyServiceSpy.safeParse.and.returnValue({id2: '123'});
    });

    it('should add the dependent id to the answer in allDependentSteps', () => {
      service['addDependentId'](step, index, id);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith('newAnswer');
      expect(service['allDependentSteps'][index]).toEqual({
        journeyStepName: 'step1',
        journeyStepCMSTagId: 'cmsTag1',
        msgType: 'msgType1',
        value: {step: 'value'},
        answer: JSON.stringify({id2: '123', id: {step: 'value'}}),
      });
    });

    it('should add the dependent id to the answer in allDependentSteps with undefined existing answer', () => {
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      service['addDependentId'](step, index, id);
      expect(service['allDependentSteps'][index].answer).toEqual(
        JSON.stringify({id: {step: 'value'}})
      );
    });

    it('should set the answer to undefined if theres no step value', () => {
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      step.value = undefined;
      service['addDependentId'](step, index, id);
      expect(service['allDependentSteps'][index].answer).toEqual(undefined);
    });

    it('should set the answer to the existing answer if theres an empty step value', () => {
      step.value = {};
      service['addDependentId'](step, index, id);
      expect(service['allDependentSteps'][index].answer).toEqual(
        JSON.stringify({id2: '123'})
      );
    });
  });

  describe('updateStepValues', () => {
    let oldDependentId;
    beforeEach(() => {
      service.whoAreYouSavingForId = 'pcieiUP3pjHm';
      oldDependentId = 'oldDependentId';
      journey.steps = stepsList;
      stepsList[0].journeyStepName = 'who_are_you_saving_for';
      service['addDependentId'] = jasmine.createSpy();
      service['allDependentSteps'] = JSON.parse(JSON.stringify(stepsList));
      service['allDependentSteps'][1].answer = 'step2Answer';
      journeyServiceSpy.safeParse.and.returnValue({pcieiUP3pjHm: 'answer1'});
    });

    it('should not call updateJourneySteps if updateSteps is false', () => {
      service['updateStepValues'](journey, oldDependentId, false);
      expect(journeyServiceSpy.updateJourneySteps).not.toHaveBeenCalled();
    });

    it('should not updateJourneySteps update the steps with the dependent id', () => {
      service['updateStepValues'](journey, oldDependentId);
      expect(service['addDependentId']).not.toHaveBeenCalledWith(
        stepsList[0],
        0,
        oldDependentId
      );
      expect(service['addDependentId']).toHaveBeenCalledWith(
        stepsList[1],
        1,
        oldDependentId
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith('step2Answer');
      expect(journeyServiceSpy.updateJourneySteps).toHaveBeenCalledWith(
        [
          {
            journeyStepName: 'who_are_you_saving_for',
            journeyStepCMSTagId: 'cmsTag1',
            msgType: 'msgType1',
          },
          {
            journeyStepName: 'step2',
            journeyStepCMSTagId: 'cmsTag2',
            msgType: 'msgType2',
            answer: 'answer1',
            value: undefined,
          },
        ],
        8,
        false
      );
    });

    it('should stringify the value if its not a string', () => {
      journeyServiceSpy.safeParse.and.returnValue({
        pcieiUP3pjHm: {step: 'answer'},
      });
      service['updateStepValues'](journey, oldDependentId);
      expect(journey.steps[1].answer).toEqual(JSON.stringify({step: 'answer'}));
    });

    it('should not add the dependent id if there is no old id', () => {
      service['updateStepValues'](journey, undefined);
      expect(service['addDependentId']).not.toHaveBeenCalled();
    });

    it('should set the answer to undefined if there is no answer for the step', () => {
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      service['updateStepValues'](journey, undefined);
      expect(journey.steps[1].answer).toBeUndefined();
    });

    it('should set the answer to undefined if there is an empty answer for the step', () => {
      journeyServiceSpy.safeParse.and.returnValue({});
      service['updateStepValues'](journey, undefined);
      expect(journey.steps[1].answer).toBeUndefined();
    });
  });

  describe('addDependent', () => {
    it('should get the journey, call initializeDependentFromList and call updateJourneySteps', () => {
      service['initializeDependentFromList'] = jasmine.createSpy();
      const dep = {childFirstName: 'John', id: 'id1'};
      service.addDependent(dep);
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      expect(service['initializeDependentFromList']).toHaveBeenCalledWith(
        [dep],
        journey
      );
      expect(journeyServiceSpy.updateJourneySteps).toHaveBeenCalledWith(
        journey.steps,
        journey.journeyID,
        false
      );
    });
  });

  describe('updateApiValues', () => {
    it('should use the override key and value', () => {
      const result = service['updateApiValues'](
        JSON.stringify({input1: 'value1'}),
        {input1: 'value1'},
        endpoints.portfolioProjector,
        {
          one_time_contribution: 'oneTimeContribution',
          existing_savings: 'existingSavings',
          recurrent_payment: 'monthlyPayment',
          annual_interest_rate: 'interestRate',
          years: 'yearsTilStart',
          rate_of_return: 'rateOfReturn',
          household_income: 'householdIncome',
          tax_filing_status_id: 'taxFilingStatus',
          state_id: 'stateId',
          college_projected_cost: 'total',
          goal_percentage: 'goalPercentage',
        },
        'college_projected_cost',
        250000
      );
      expect(result).toEqual(
        'myvoyage/ws/ers/journeys/college/portfolioProjector?one_time_contribution=0&existing_savings=0&recurrent_payment=0&annual_interest_rate=undefined&years=undefined&rate_of_return=undefined&household_income=undefined&tax_filing_status_id=undefined&state_id=undefined&college_projected_cost=250000&goal_percentage=100'
      );
    });
  });

  describe('updateDetailedFees', () => {
    let detailedFees: DetailedFees;
    beforeEach(() => {
      service.typeCollegeId = '1';
      service.totalYears = 4;
      service['collegeNameId'] = '1';
      service['collegeStartAge'] = 18;
      service.currentAge = 5;
      service.inflation = 3.6;
      detailedFees = {
        startYear: 2001,
        endYear: 2003,
        tuition: 24.52,
        roomAndBoard: 243.341,
        fees: 3435,
        books: 3243.25,
        grantsAndScholarships: 2500,
        total: 34354,
      };
      service['detailedFeesInputs'] = {};
      baseServiceSpy.get.and.returnValue(Promise.resolve(detailedFees));
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
    });

    it('should call detailedFees and update the data if all inputs are defined and at least one input updated and isCollegeName is true', async () => {
      service.tuition = undefined;
      service.roomAndBoard = undefined;
      service.fees = undefined;
      service.books = undefined;
      service.grantsAndScholarships = undefined;
      service.grantsAndScholarshipsNegative = undefined;
      service.total = undefined;
      service.averageAmount = undefined;
      service.startYear = undefined;
      service.scholarshipsIncluded = false;
      service.isTypeCollege = false;
      service.isCollegeName = true;
      service.scholarshipsNotIncluded = true;
      await service['updateDetailedFees']();
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('1');
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(4);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(18);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(5);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(3.6);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/journeys/college/detailedFees?years_of_attendance=4&college_start_age=18&current_age=5&inflation=3.6&school_id=1'
      );
      expect(service.tuition).toEqual(24.52);
      expect(service.roomAndBoard).toEqual(243.341);
      expect(service.fees).toEqual(3435);
      expect(service.books).toEqual(3243.25);
      expect(service.grantsAndScholarships).toEqual(2500);
      expect(service.grantsAndScholarshipsNegative).toEqual(-2500);
      expect(service.total).toEqual(34354);
      expect(service.averageAmount).toEqual(8588.5);
      expect(service.startYear).toEqual(2001);
      expect(service.scholarshipsNotIncludedCollegeName).toBeTrue();
      expect(service.scholarshipsNotIncludedTypeCollege).toBeFalse();
    });

    it('should call detailedFees and update the data if all inputs are defined and at least one input updated and isCollegeName is false', async () => {
      service.tuition = undefined;
      service.roomAndBoard = undefined;
      service.fees = undefined;
      service.books = undefined;
      service.grantsAndScholarships = undefined;
      service.grantsAndScholarshipsNegative = undefined;
      service.total = undefined;
      service.averageAmount = undefined;
      service.startYear = undefined;
      service.scholarshipsIncluded = false;
      service.isTypeCollege = true;
      service.isCollegeName = false;
      service.scholarshipsNotIncluded = true;
      await service['updateDetailedFees']();
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('1');
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(4);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(18);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(5);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(3.6);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/journeys/college/detailedFees?years_of_attendance=4&college_start_age=18&current_age=5&inflation=3.6&college_type=1'
      );
      expect(service.tuition).toEqual(24.52);
      expect(service.roomAndBoard).toEqual(243.341);
      expect(service.fees).toEqual(3435);
      expect(service.books).toEqual(3243.25);
      expect(service.grantsAndScholarships).toEqual(2500);
      expect(service.grantsAndScholarshipsNegative).toEqual(-2500);
      expect(service.total).toEqual(34354);
      expect(service.averageAmount).toEqual(8588.5);
      expect(service.startYear).toEqual(2001);
      expect(service.scholarshipsNotIncludedCollegeName).toBeFalse();
      expect(service.scholarshipsNotIncludedTypeCollege).toBeTrue();
    });

    it('should scholarshipsNotIncludedCollegeName and scholarshipsNotIncludedCollegeName be undefined if scholarshipsNotIncluded is false', async () => {
      service.isTypeCollege = true;
      service.isCollegeName = false;
      service.scholarshipsNotIncluded = false;
      await service['updateDetailedFees']();
      expect(service.scholarshipsNotIncludedCollegeName).toBeFalse();
      expect(service.scholarshipsNotIncludedTypeCollege).toBeFalse();
    });

    it('should not call detailedFees if no inputs updated', async () => {
      service['detailedFeesInputs'] = {
        college_type: '1',
        school_id: '1',
        years_of_attendance: 4,
        college_start_age: 18,
        current_age: 5,
        inflation: 3.6,
      };
      await service['updateDetailedFees']();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
    });

    it('should not call detailedFees if there is an empty input', async () => {
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      await service['updateDetailedFees']();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
    });

    it('should subtract the grants and scholarships from the total if scholarshipsIncluded is true', async () => {
      service.total = undefined;
      service.scholarshipsIncluded = true;
      await service['updateDetailedFees']();
      expect(service.total).toEqual(31854);
    });
  });

  describe('updatePortfolioProjector', () => {
    let updateApiValuesSpy;
    let portfolioProjectorResponse;
    let updateRadioOptionsSpy;
    let updateNoteValueFromAnswerSpy;

    beforeEach(() => {
      updateApiValuesSpy = jasmine.createSpy().and.returnValue('nonNullString');
      service['updateApiValues'] = updateApiValuesSpy;
      portfolioProjectorResponse = {
        projectedShortfall: 1500,
        projectedSurplus: 0,
        predictedOngoingContributions: 521,
        predictedOneTimeContribution: 1401,
      };
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(portfolioProjectorResponse)
      );
      updateRadioOptionsSpy = jasmine.createSpy();
      updateNoteValueFromAnswerSpy = jasmine.createSpy();
      service['updateRadioOptions'] = updateRadioOptionsSpy;
      service['updateNoteValueFromAnswer'] = updateNoteValueFromAnswerSpy;
    });

    it('should not call the service if the values have not updated', async () => {
      service['portfolioProjectorInputs'] = {input1: 'value1'};
      updateApiValuesSpy.and.returnValue(null);
      await service['updatePortfolioProjector'](journey, undefined, true);
      expect(service['updateApiValues']).toHaveBeenCalledWith(
        JSON.stringify({input1: 'value1'}),
        {input1: 'value1'},
        endpoints.portfolioProjector,
        {
          one_time_contribution: 'oneTimeContribution',
          existing_savings: 'existingSavings',
          recurrent_payment: 'monthlyPayment',
          annual_interest_rate: 'interestRate',
          years: 'yearsTilStart',
          rate_of_return: 'rateOfReturn',
          household_income: 'householdIncome',
          tax_filing_status_id: 'taxFilingStatus',
          state_id: 'stateId',
          college_projected_cost: 'total',
          goal_percentage: 'goalPercentage',
        }
      );
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(service['updateRadioOptions']).not.toHaveBeenCalled();
      expect(service['updateNoteValueFromAnswer']).not.toHaveBeenCalled();
      expect(journeyServiceSpy.updateJourneySteps).not.toHaveBeenCalled();
    });

    it('should call the service if the values have updated', async () => {
      service.projectedShortfall = undefined;
      service.projectedSurplus = undefined;
      service.predictedOngoingContributions = undefined;
      service.predictedOneTimeContribution = undefined;
      service.isShortfall = undefined;
      service.isSurplus = undefined;
      service.isEqual = undefined;
      await service['updatePortfolioProjector'](
        journey,
        {
          radioButton: 'answer',
        },
        true
      );
      expect(baseServiceSpy.get).toHaveBeenCalledWith('nonNullString');
      expect(service.projectedShortfall).toEqual(1500);
      expect(service.projectedSurplus).toEqual(0);
      expect(service.predictedOngoingContributions).toEqual(521);
      expect(service.predictedOneTimeContribution).toEqual(1401);
      expect(service.isShortfall).toBeTrue();
      expect(service.isSurplus).toBeFalse();
      expect(service.isEqual).toBeFalse();
      expect(service['updateRadioOptions']).toHaveBeenCalledWith(journey);
      expect(service['updateNoteValueFromAnswer']).toHaveBeenCalledWith({
        radioButton: 'answer',
      });
      expect(journeyServiceSpy.updateJourneySteps).toHaveBeenCalledWith(
        journey.steps,
        journey.journeyID,
        false
      );
    });

    it('should not call updateJourneySteps if updateSteps is false', async () => {
      service.projectedShortfall = undefined;
      service.projectedSurplus = undefined;
      service.predictedOngoingContributions = undefined;
      service.predictedOneTimeContribution = undefined;
      service.isShortfall = undefined;
      service.isSurplus = undefined;
      service.isEqual = undefined;
      await service['updatePortfolioProjector'](
        journey,
        {
          radioButton: 'answer',
        },
        false
      );
      expect(journeyServiceSpy.updateJourneySteps).not.toHaveBeenCalled();
    });

    it('should set isShortfall to false if there is a surplus', async () => {
      portfolioProjectorResponse.projectedShortfall = 0;
      portfolioProjectorResponse.projectedSurplus = 1500;
      service.isShortfall = undefined;
      service.isSurplus = undefined;
      await service['updatePortfolioProjector'](journey, undefined, true);
      expect(service.isShortfall).toBeFalse();
      expect(service.isSurplus).toBeTrue();
    });

    it('should set isEqual to true if equals', async () => {
      portfolioProjectorResponse.projectedShortfall = -1;
      portfolioProjectorResponse.projectedSurplus = -1;
      service.isShortfall = undefined;
      service.isSurplus = undefined;
      await service['updatePortfolioProjector'](journey, undefined, true);
      expect(service.isShortfall).toBeFalse();
      expect(service.isSurplus).toBeFalse();
      expect(service.isEqual).toBeTrue();
    });

    it('should consider a shortfall less than 1 as equal', async () => {
      portfolioProjectorResponse.projectedShortfall = 0.25;
      portfolioProjectorResponse.projectedSurplus = 0;
      service.isShortfall = undefined;
      service.isSurplus = undefined;
      await service['updatePortfolioProjector'](journey, undefined, true);
      expect(service.isShortfall).toBeFalse();
      expect(service.isSurplus).toBeFalse();
      expect(service.isEqual).toBeTrue();
    });

    it('should consider a surplus less than 1 as equal', async () => {
      portfolioProjectorResponse.projectedShortfall = 0;
      portfolioProjectorResponse.projectedSurplus = 0.25;
      service.isShortfall = undefined;
      service.isSurplus = undefined;
      await service['updatePortfolioProjector'](journey, undefined, true);
      expect(service.isShortfall).toBeFalse();
      expect(service.isSurplus).toBeFalse();
      expect(service.isEqual).toBeTrue();
    });
  });

  describe('getMXAccountData', () => {
    let mxsubjectData: MXAccount[];

    beforeEach(() => {
      mxsubjectData = [
        {
          account_number: 'XXXXX9200',
          account_type_name: 'Savings',
          available_balance: '100',
          currency_code: 'USD',
          balance: '100',
          guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth)',
          radioButtonIconName: 'radio-button-on',
          name: 'Savings Account',
          routing_number: '731775673',
          updated_at: '2022-05-16T10:42:10+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
        },
        {
          account_number: 'XXXXX9201',
          account_type_name: 'Checking',
          available_balance: '1005',
          balance: '1005',
          currency_code: 'USD',
          guid: 'ACT-8fa39e08-8981-4c4f-8910-177e78346bd0',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          radioButtonIconName: 'radio-button-off',
          name: 'Checking Account',
          routing_number: '731775673',
          updated_at: '2022-05-16T10:42:10+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          institution_name: 'MX Bank (Oauth)',
        },
        {
          account_number: 'XXXXX9200',
          account_type_name: 'Investment',
          account_subtype_name: 'plan_529',
          available_balance: '10057',
          balance: '10057',
          currency_code: 'USD',
          guid: 'ACT-8fa39e08-8981-4c4f-8910-177e234566bd1',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth)',
          radioButtonIconName: 'radio-button-off',
          name: 'Investment Account',
          routing_number: '731775673',
          updated_at: '2022-05-16T10:42:10+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
        },
        {
          account_number: 'XXXXX9200',
          account_type_name: 'Investment',
          account_subtype_name: undefined,
          available_balance: '10057',
          balance: '10057',
          currency_code: 'USD',
          guid: 'ACT-8fa39e08-8981-4c4f-8910-177e234566bd1',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth)',
          radioButtonIconName: 'radio-button-off',
          name: 'Investment Account',
          routing_number: '731775673',
          updated_at: '2022-05-16T10:42:10+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
        },
      ];
      journeyUtiltyServiceSpy.addAccountIconName.and.returnValue(
        mxsubjectData[2]
      );
      service.accountLinkedId = 'ACT-8fa39e08-8981-4c4f-8910-177e234566bd1';
      const accountsSubject = new ReplaySubject<MXAccountRootObject>(1);
      accountsSubject.next({accounts: mxsubjectData});
      MXServiceSpy.getMxAccountConnect.and.returnValue(accountsSubject);
    });

    it('when typeName will be matched with conditions', () => {
      service.getMXAccountData().subscribe(res => {
        expect(MXServiceSpy.getMxAccountConnect).toHaveBeenCalled();
        expect(res.accounts).toEqual(mxsubjectData.slice(0, 3));
        expect(journeyUtiltyServiceSpy.addAccountIconName).toHaveBeenCalledWith(
          mxsubjectData.slice(0, 3),
          'ACT-8fa39e08-8981-4c4f-8910-177e234566bd1'
        );
      });
    });

    it('should set logo url balance and accountLinked when there is a linked account', () => {
      service.logoUrl = undefined;
      service.accountLinked = undefined;
      service.accountNotLinked = undefined;
      service.accountBalance = undefined;
      service.accountName = undefined;
      service.getMXAccountData().subscribe(() => {
        expect(service.logoUrl).toEqual(
          'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png'
        );
        expect(service.accountLinked).toBeTrue();
        expect(service.accountNotLinked).toBeFalse();
        expect(service.accountBalance).toEqual('10057');
        expect(service.accountName).toEqual('Investment Account');
      });
    });

    it('should not set logo url balance and should set accountLinked to false if there is no linked account', () => {
      service.logoUrl = undefined;
      service.accountLinked = undefined;
      service.accountNotLinked = undefined;
      service.accountBalance = undefined;
      journeyUtiltyServiceSpy.addAccountIconName.and.returnValue(undefined);
      service.getMXAccountData().subscribe(() => {
        expect(service.logoUrl).toBeUndefined();
        expect(service.accountLinked).toBeFalse();
        expect(service.accountNotLinked).toBeTrue();
        expect(service.accountBalance).toBeUndefined();
      });
    });
  });

  describe('getValidationRules$', () => {
    it('should return the validation rules observable', () => {
      const subject = jasmine.createSpyObj('ValidationRulesSubject', ['']);
      service['validationRulesSubject'] = subject;
      const result = service.getValidationRules$();
      expect(result).toEqual(subject);
    });
  });

  describe('setEditAChildModal', () => {
    let pageElement: StepContentElements;

    beforeEach(() => {
      pageElement = {
        elements: [
          {
            id: 'intro',
            header: 'Who are you saving for?',
            description: "Tell us who's college education you are saving for.",
            marginBottom: '15px',
          },
          {
            id: 'image',
            imageUrl: 'assets/icon/journeys/college/step1.svg',
            maxWidth: '68%',
          },
          {
            id: 'modalButton',
            answerId: 'addAChildModal',
            accumulateAnswers: true,
            imageUrl: 'assets/icon/journeys/college/add-child.svg',
            label: 'Add a Child',
            fullscreen: false,
            elements: [
              {
                id: 'intro',
                header: 'Add a Child',
                headerFontSize: '24px',
                centered: true,
                marginBottom: '20px',
              },
              {
                id: 'input',
                answerId: 'childFirstName',
                type: 'textField',
                label: 'First Name',
                validationRules: {type: ValidationType.alphabeticWithSpace},
                marginBottom: '25px',
                isRequired: true,
              },
              {
                id: 'input',
                answerId: 'childAge',
                type: 'textField',
                label: "Child's Age",
                validationRules: {
                  type: ValidationType.number,
                  min: 0,
                  max: 99,
                  decimalPlaces: 0,
                },
                marginBottom: '20px',
                isRequired: true,
              },
              {
                id: 'intro',
                description:
                  "Providing the child's age will help us estimate tuition cost for this child.",
                marginBottom: '20px',
                descFontSize: '14px',
              },
              {
                id: 'button',
                label: 'Save',
                link: 'save',
                isContinueButton: true,
              },
              {
                id: 'link',
                label: 'Cancel',
                link: 'closeModal',
                centered: true,
              },
            ],
          },
          {
            id: 'button',
            label: 'Continue',
            link: 'default',
            isContinueButton: true,
          },
        ],
      };
    });

    it('should set the modal if addAChildModal is present', () => {
      service['editAChildModal'] = undefined;
      service['setEditAChildModal'](pageElement);
      console.log(service['editAChildModal']);
      expect(service['editAChildModal']).toEqual({
        id: 'modalButton',
        answerId: 'addAChildModal',
        accumulateAnswers: false,
        imageUrl: 'assets/icon/journeys/college/add-child.svg',
        label: 'Add a Child',
        fullscreen: false,
        elements: [
          {
            id: 'intro',
            header: 'Edit a Child',
            headerFontSize: '24px',
            centered: true,
            marginBottom: '20px',
          },
          {
            id: 'input',
            answerId: 'childFirstName',
            type: 'textField',
            label: 'First Name',
            validationRules: {
              type: ValidationType.alphabeticWithSpace,
            },
            marginBottom: '25px',
            isRequired: true,
            header: undefined,
          },
          {
            id: 'input',
            answerId: 'childAge',
            type: 'textField',
            label: "Child's Age",
            validationRules: {
              type: ValidationType.number,
              min: 0,
              max: 99,
              decimalPlaces: 0,
            },
            marginBottom: '20px',
            isRequired: true,
            header: undefined,
          },
          {
            id: 'intro',
            description:
              "Providing the child's age will help us estimate tuition cost for this child.",
            marginBottom: '20px',
            descFontSize: '14px',
            header: undefined,
          },
          {
            id: 'button',
            label: 'Save',
            link: 'save',
            isContinueButton: true,
            header: undefined,
          },
          {
            id: 'link',
            label: 'Cancel',
            link: 'closeModal',
            centered: true,
            header: undefined,
          },
        ],
      });
    });

    it('should not set the modal if addAChildModal is not present', () => {
      service['editAChildModal'] = undefined;
      pageElement.elements = pageElement.elements
        .slice(0, 2)
        .concat(pageElement.elements.slice(3));
      service['setEditAChildModal'](pageElement);
      expect(service['editAChildModal']).toBeUndefined();
    });
  });

  describe('getModalValue', () => {
    it('should get the dependent value from the added dependents', () => {
      service.addedDependents = [
        {},
        {id: 'id', firstName: 'firstName', age: 5, dob: '2029-05'},
        {},
      ];
      const result = service.getModalValue('id', 'answerId');
      expect(result).toEqual({
        answerId: JSON.stringify({
          childFirstName: 'firstName',
          dob: '2029-05',
          id: 'id',
        }),
      });
    });
  });

  describe('updateDependentValue', () => {
    it('should update the addedDependents with the new info', () => {
      service.addedDependents = [
        {},
        {id: 'id', firstName: 'firstName', age: 5},
        {},
      ];
      service['updateDependentValue']({
        id: 'id',
        childFirstName: 'childFirstName',
        childAge: '12',
        dob: mockDOB,
      });
      expect(service.addedDependents).toEqual([
        {},
        {id: 'id', firstName: 'childFirstName', age: mockAge, dob: mockDOB},
        {},
      ]);
    });
  });

  describe('handleEditModalValueChange', () => {
    it('should call updateDependentValue, updateStepAnswerWithDependent and addDependent', () => {
      const updateDependentValueSpy = jasmine.createSpy();
      service['updateDependentValue'] = updateDependentValueSpy;
      const updateStepAnswerWithDependentSpy = jasmine.createSpy();
      service[
        'updateStepAnswerWithDependent'
      ] = updateStepAnswerWithDependentSpy;
      const addDependentSpy = jasmine.createSpy();
      service['addDependent'] = addDependentSpy;
      const dependent = {dep: 'endent'};
      journeyServiceSpy.safeParse.and.returnValue(dependent);
      service.handleEditModalValueChange(JSON.stringify(dependent), 1);
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify(dependent)
      );
      expect(updateDependentValueSpy).toHaveBeenCalledWith(dependent);
      expect(updateStepAnswerWithDependentSpy).toHaveBeenCalledWith(
        journey.steps[1],
        dependent
      );
      expect(addDependentSpy).toHaveBeenCalledWith(dependent, journey);
    });
  });

  describe('updateStepAnswerWithDependent', () => {
    let dep;
    beforeEach(() => {
      dep = {
        id: 'id',
        childFirstName: 'childFirstName',
        childAge: '12',
      };
      journeyServiceSpy.safeParse.and.callFake(str => {
        if (typeof str === 'string') {
          return JSON.parse(str);
        } else {
          const parsedResult = [];
          str.forEach(s => parsedResult.push(JSON.parse(s)));
          return parsedResult;
        }
      });
    });

    it('should set to the step answer if whoAreYouSavingFor and addAChildModal are not present and the value was not set', () => {
      journey.steps[0].answer = JSON.stringify({});
      journey.steps[0].value = undefined;
      service['updateStepAnswerWithDependent'](journey.steps[0], dep);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({})
      );
      expect(journey.steps[0].value).toEqual({});
    });

    it('should update to the new dependent value if whoAreYouSavingFor and addAChildModal are present', () => {
      journey.steps[0].value = {
        whoAreYouSavingFor: JSON.stringify({id: 'id', label: 'Tim'}),
        addAChildModal: ['{}', JSON.stringify({id: 'id'}), '{}'],
      };
      service['updateStepAnswerWithDependent'](journey.steps[0], dep);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({id: 'id', label: 'Tim'})
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith([
        '{}',
        '{"id":"id","childFirstName":"childFirstName","childAge":"12"}',
        '{}',
      ]);
      expect(journey.steps[0].value).toEqual({
        whoAreYouSavingFor: '{"id":"id","label":"childFirstName"}',
        addAChildModal: [
          '{}',
          '{"id":"id","childFirstName":"childFirstName","childAge":"12"}',
          '{}',
        ],
      });
    });

    it('should not update whoAreYouSavingFor if it is for a different id', () => {
      journey.steps[0].value = {
        whoAreYouSavingFor: JSON.stringify({id: 'id2', label: 'Tim'}),
        addAChildModal: ['{}', JSON.stringify({id: 'id'}), '{}'],
      };
      service['updateStepAnswerWithDependent'](journey.steps[0], dep);
      expect(journey.steps[0].value.whoAreYouSavingFor).toEqual(
        JSON.stringify({id: 'id2', label: 'Tim'})
      );
    });

    it('should not update if the parsedValue is undefined', () => {
      journey.steps[0].value = {
        whoAreYouSavingFor: JSON.stringify({id: 'id', label: 'Tim'}),
        addAChildModal: ['{}', JSON.stringify({id: 'id'}), '{}'],
      };
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      service['updateStepAnswerWithDependent'](journey.steps[0], dep);
      expect(journey.steps[0].value).toEqual({
        whoAreYouSavingFor: JSON.stringify({id: 'id', label: 'Tim'}),
        addAChildModal: ['{}', JSON.stringify({id: 'id'}), '{}'],
      });
    });

    it('should not update if the dependent is not present', () => {
      journey.steps[0].value = {
        whoAreYouSavingFor: JSON.stringify({id: 'id', label: 'Tim'}),
        addAChildModal: ['{}', JSON.stringify({id: 'id2'}), '{}'],
      };
      service['updateStepAnswerWithDependent'](journey.steps[0], dep);
      expect(journey.steps[0].value.addAChildModal).toEqual([
        '{}',
        '{"id":"id2"}',
        '{}',
      ]);
    });
  });

  describe('updateRadioOptions', () => {
    it('should call updateMonthlyContribution, stripOldAnswers for value and stripOldAnswers for answer', () => {
      const value = {step: 'value'};
      journey.steps[1].value = value;
      journey.steps[1].answer = JSON.stringify({...value, answer2: 'value2'});
      journeyServiceSpy.safeParse.and.returnValue({
        ...value,
        answer2: 'value2',
      });
      let count = 0;
      service['updateMonthlyContribution'] = jasmine
        .createSpy()
        .and.callFake((_, i) => {
          console.log(i);
          count += 1;
          return count === 1 ? 1 : undefined;
        });
      service['stripOldAnswers'] = jasmine.createSpy().and.returnValue({});
      journey.steps = journey.steps.slice(0, 3);
      service['updateRadioOptions'](journey);
      expect(service['updateMonthlyContribution']).toHaveBeenCalledWith({}, 2);
      expect(service['updateMonthlyContribution']).toHaveBeenCalledWith(
        {
          id: 'dependentButtons',
          answerId: 'whoAreYouSavingFor',
          imageUrl: 'dependentImage',
          idSuffix: '1234',
        },
        2
      );
      expect(service['stripOldAnswers']).toHaveBeenCalledWith(value);
      expect(service['stripOldAnswers']).toHaveBeenCalledWith({
        ...value,
        answer2: 'value2',
      });
      expect(journey.steps[1].answer).toEqual(JSON.stringify({}));
    });
  });

  describe('updateMonthlyContribution', () => {
    beforeEach(() => {
      service['getElementOptions'] = jasmine.createSpy();
      service['setElementOptions'] = jasmine.createSpy();
    });

    it('should return undefined if the element is not monthlyContribution', () => {
      element.answerId = 'notMonthlyContribution';
      const result = service['updateMonthlyContribution'](element, 10);
      expect(result).toBeUndefined();
    });

    it('should set the element options if they are not set yet', () => {
      const originalOptions = JSON.parse(JSON.stringify(element.options));
      service['updateMonthlyContribution'](element, 10);
      expect(service['getElementOptions']).toHaveBeenCalled();
      expect(service['setElementOptions']).toHaveBeenCalledWith(
        originalOptions
      );
    });

    it('should not set the element options if they are already set', () => {
      const originalOptions = JSON.parse(JSON.stringify(element.options));
      (service['getElementOptions'] as any).and.returnValue(originalOptions);
      service['updateMonthlyContribution'](element, 10);
      expect(service['getElementOptions']).toHaveBeenCalled();
      expect(service['setElementOptions']).not.toHaveBeenCalledWith(
        originalOptions
      );
    });

    it('should set the element options with the predictedOngoingContributions', () => {
      service.predictedOngoingContributions = 5123;
      currencyPipeSpy.transform.and.returnValue('$5,123');
      service['updateMonthlyContribution'](element, 10);
      console.log(element.options);
      expect(element.options).toEqual([
        {
          label: '$5,123 (100% Montly Contribution)',
          id: 'montlyContribution05123',
          elements: [
            {
              id: 'intro',
              label: 'You may fall short of your college savings goal by {0}.',
              defaultHeader:
                'Nice! you may exceed your college savings goal by {0}!',
              elements: [
                {
                  answerId: 'updatedEstimate',
                  type: 'dollar',
                },
              ],
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
            },
          ],
          value: 5123,
        },
        {
          label: '$5,123 (75% Montly Contribution)',
          id: 'montlyContribution15123',
          elements: [
            {
              id: 'intro',
              label: 'You may fall short of your college savings goal by {0}.',
              defaultHeader:
                'Nice! you may exceed your college savings goal by {0}!',
              elements: [
                {
                  answerId: 'updatedEstimate',
                  type: 'dollar',
                },
              ],
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
            },
          ],
          value: 3842.25,
        },
        {
          label: '$5,123 (50% Montly Contribution)',
          id: 'montlyContribution25123',
          elements: [
            {
              id: 'intro',
              label: 'You may fall short of your college savings goal by {0}.',
              defaultHeader:
                'Nice! you may exceed your college savings goal by {0}!',
              elements: [
                {
                  answerId: 'updatedEstimate',
                  type: 'dollar',
                },
              ],
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
            },
          ],
          value: 2561.5,
        },
        {
          label: '$5,123 (25% Montly Contribution)',
          id: 'montlyContribution35123',
          elements: [
            {
              id: 'intro',
              label: 'You may fall short of your college savings goal by {0}.',
              defaultHeader:
                'Nice! you may exceed your college savings goal by {0}!',
              elements: [
                {
                  answerId: 'updatedEstimate',
                  type: 'dollar',
                },
              ],
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
            },
          ],
          value: 1280.75,
        },
        {
          label: 'Enter a specific monthly amount',
          id: 'specificMonthlyAmount5123',
          elements: [
            {
              answerId: 'specificMonthlyAmount5123',
              default: '$',
              id: 'input',
              isRequired: true,
              marginBottom: '25px',
              type: 'textField',
              validationRules: {
                decimalPlaces: 0,
                max: 999999999999999,
                min: 0,
                type: 'dollar',
              },
              elements: [
                {
                  flag: 'showNote',
                  id: 'intro',
                  label:
                    'You may fall short of your college savings goal by {0}.',
                  defaultHeader:
                    'Nice! you may exceed your college savings goal by {0}!',
                  elements: [
                    {
                      answerId: 'updatedEstimate',
                      type: 'dollar',
                    },
                  ],
                  type: 'note',
                  marginTop: '0px',
                  marginBottom: '13px',
                },
              ],
            },
          ],
        },
        {
          label: 'Enter a One-Time Contribution',
          id: 'oneTimeContribution5123',
          elements: [
            {
              answerId: 'oneTimeContribution5123',
              default: '$',
              id: 'input',
              isRequired: true,
              marginBottom: '12px',
              type: 'textField',
              validationRules: {
                decimalPlaces: 0,
                max: 999999999999999,
                min: 0,
                type: 'dollar',
              },
              elements: [
                {
                  flag: 'showNote',
                  id: 'intro',
                  label:
                    'You may fall short of your college savings goal by {0}.',
                  defaultHeader:
                    'Nice! you may exceed your college savings goal by {0}!',
                  elements: [
                    {
                      answerId: 'updatedEstimate',
                      type: 'dollar',
                    },
                  ],
                  type: 'note',
                  marginTop: '0px',
                  marginBottom: '13px',
                },
              ],
            },
            {
              id: 'intro',
              description:
                'You would need to make a One-Time Contribution of {0} to meet college savings goal.',
              elements: [
                {
                  answerId: 'predictedOneTimeContribution',
                  type: 'dollar',
                },
              ],
              marginTop: '0px',
              marginBottom: '20px',
            },
          ],
        },
      ]);
    });
  });

  describe('stripOldAnswers', () => {
    it('should not change the answer if its undefined', () => {
      const result = service['stripOldAnswers'](undefined);
      expect(result).toBeUndefined();
    });

    it('should not change the answer if it does not include monthlyContribution', () => {
      const answer = {answerId1: 'answer1'};
      const result = service['stripOldAnswers'](answer);
      expect(result).toEqual(answer);
    });

    it('should not change the answer if it does not include monthlyContribution', () => {
      const answer = {answerId1: 'answer1'};
      const result = service['stripOldAnswers'](answer);
      expect(result).toEqual(answer);
    });

    it('should not change the answer if monthlyContribution answer does not parse', () => {
      const answer = {monthlyContribution: 'answer1'};
      const result = service['stripOldAnswers'](answer);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith('answer1');
      expect(result).toEqual(answer);
    });

    it('should remove answers with old answerId', () => {
      service.predictedOngoingContributions = 5230;
      const answer = {
        monthlyContribution: JSON.stringify({
          nonSpecificOrOneTime: 123,
          specificMonthlyAmount5230: 578,
          specificMonthlyAmount123: 782,
          oneTimeContribution5230: 98919,
          oneTimeContribution123: 12878,
        }),
      };
      journeyServiceSpy.safeParse.and.callFake(str => JSON.parse(str));
      const result = service['stripOldAnswers'](answer);
      expect(result).toEqual({
        monthlyContribution: JSON.stringify({
          nonSpecificOrOneTime: 123,
          specificMonthlyAmount5230: 578,
          oneTimeContribution5230: 98919,
        }),
      });
    });
  });

  describe('setElementOptions', () => {
    it('should set the options in localStorage and in the class prop', () => {
      spyOn(Storage.prototype, 'setItem');
      service['originalMonthlyContributionOptions'] = undefined;
      service['setElementOptions'](element.options);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'collegeOriginalMonthlyContributionOptions',
        JSON.stringify(element.options)
      );
      expect(service['originalMonthlyContributionOptions']).toEqual(
        element.options
      );
    });
  });

  describe('getElementOptions', () => {
    it('should return options from local storage if it exists', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(element.options)
      );
      const result = service['getElementOptions']();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        'collegeOriginalMonthlyContributionOptions'
      );
      expect(result).toEqual(element.options);
    });

    it('should return options from class property if localStorage is undefined', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('undefined');
      service['originalMonthlyContributionOptions'] = element.options;
      const result = service['getElementOptions']();
      expect(result).toEqual(element.options);
    });

    it('should return options from class property if localStorage is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      service['originalMonthlyContributionOptions'] = element.options;
      const result = service['getElementOptions']();
      expect(result).toEqual(element.options);
    });

    it('should return options from localStorage if localStorage is not null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(element.options)
      );
      service['originalMonthlyContributionOptions'] = undefined;
      const result = service['getElementOptions']();
      expect(result).toEqual(element.options);
    });
  });

  describe('getOverrideKeyAndValue', () => {
    it('should return one_time_contribution for one time input', () => {
      const keyAndValue = service[
        'getOverrideKeyAndValue'
      ]('oneTimeContribution', {abc: '123', oneTimeContribution1523: '$679'});
      expect(keyAndValue).toEqual({key: 'one_time_contribution', value: 679});
    });

    it('should return recurrent_payment for monthly input', () => {
      const keyAndValue = service['getOverrideKeyAndValue'](
        'specificMonthlyAmount',
        {
          abc: '123',
          specificMonthlyAmount12376: '$679',
        }
      );
      expect(keyAndValue).toEqual({key: 'recurrent_payment', value: 679});
    });

    it('should return undefined if not one time or monthly', () => {
      const keyAndValue = service['getOverrideKeyAndValue']('abc', undefined);
      expect(keyAndValue).toEqual({key: undefined, value: undefined});
    });
  });

  describe('updateNoteValueFromAnswer', () => {
    beforeEach(() => {
      service['fetchNoteValue'] = jasmine.createSpy();
      service['monthlyContribution'] = element;
      service.predictedOngoingContributions = 0;
    });

    it('should not call fetchNoteValue if predictedOngoingContributions are undefined', async () => {
      service.predictedOngoingContributions = undefined;
      await service['updateNoteValueFromAnswer'](undefined);
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });

    it('should not call fetchNoteValue if answer id undefined', async () => {
      await service['updateNoteValueFromAnswer'](undefined);
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });

    it('should not call fetchNoteValue if there is no monthlyContribution answer', async () => {
      await service['updateNoteValueFromAnswer']({});
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });

    it('should not call fetchNoteValue if the monthlyContribution answer is not one time, specific or monthly', async () => {
      await service['updateNoteValueFromAnswer']({monthlyContribution: 'abc'});
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });

    it('should not call fetchNoteValue if the monthlyContribution answer is montlyContribution but there is no matching option', async () => {
      await service['updateNoteValueFromAnswer']({
        monthlyContribution: 'montlyContribution6',
      });
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });

    it('should call fetchNoteValue if the monthlyContribution answer is monthlyContribution and there is a matching option', async () => {
      service['monthlyContribution'].options[3].value = 523;
      await service['updateNoteValueFromAnswer']({
        monthlyContribution: 'montlyContribution3',
      });
      expect(service['fetchNoteValue']).toHaveBeenCalledWith(
        'recurrent_payment',
        523,
        {
          id: 'intro',
          label: 'You may fall short of your college savings goal by {0}.',
          defaultHeader:
            'Nice! you may exceed your college savings goal by {0}!',
          elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
          type: 'note',
          marginTop: '0px',
          marginBottom: '13px',
        }
      );
    });

    it('should call fetchNoteValue if the monthlyContribution answer is oneTimeContribution and there is a matching option', async () => {
      service['getOverrideKeyAndValue'] = jasmine
        .createSpy()
        .and.returnValue({key: 'key', value: 100});
      service['monthlyContribution'].options[3].value = 523;
      await service['updateNoteValueFromAnswer']({
        monthlyContribution: 'oneTimeContribution',
      });
      expect(service['getOverrideKeyAndValue']).toHaveBeenCalledWith(
        'oneTimeContribution',
        {
          monthlyContribution: 'oneTimeContribution',
        }
      );
      expect(service['fetchNoteValue']).toHaveBeenCalledWith('key', 100, {
        flag: 'showNote',
        id: 'intro',
        label: 'You may fall short of your college savings goal by {0}.',
        defaultHeader: 'Nice! you may exceed your college savings goal by {0}!',
        elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
        type: 'note',
        marginTop: '0px',
        marginBottom: '13px',
      });
    });

    it('should call fetchNoteValue if the monthlyContribution answer is specificMonthlyAmount and there is a matching option', async () => {
      service['getOverrideKeyAndValue'] = jasmine
        .createSpy()
        .and.returnValue({key: 'key', value: 100});
      service['monthlyContribution'].options[3].value = 523;
      await service['updateNoteValueFromAnswer']({
        monthlyContribution: 'specificMonthlyAmount',
      });
      expect(service['fetchNoteValue']).toHaveBeenCalledWith('key', 100, {
        flag: 'showNote',
        id: 'intro',
        label: 'You may fall short of your college savings goal by {0}.',
        defaultHeader: 'Nice! you may exceed your college savings goal by {0}!',
        elements: [{answerId: 'updatedEstimate', type: 'dollar'}],
        type: 'note',
        marginTop: '0px',
        marginBottom: '13px',
      });
    });
  });

  describe('updateNoteValue', () => {
    beforeEach(() => {
      service['fetchNoteValue'] = jasmine.createSpy();
    });

    it('should not call fetchNoteValue if answer id is undefined', async () => {
      const ele = element.options[4];
      ele.answerId = undefined;
      await service['updateNoteValue']('$52', ele);
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });

    it('should not call fetchNoteValue if answer id is not specific or one time', async () => {
      const ele = element.options[4];
      ele.answerId = 'answerId';
      await service['updateNoteValue']('$52', ele);
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });

    it('should call fetchNoteValue with recurrent_payment for specificMonthlyAmount', async () => {
      const ele = element.options[4];
      ele.answerId = 'specificMonthlyAmount1236';
      await service['updateNoteValue']('$52', ele);
      expect(service['fetchNoteValue']).toHaveBeenCalledWith(
        'recurrent_payment',
        52,
        ele.elements[0]
      );
    });

    it('should call fetchNoteValue with one_time_contribution for oneTimeContribution', async () => {
      const ele = element.options[5];
      ele.answerId = 'oneTimeContribution1236';
      await service['updateNoteValue']('$52', ele);
      expect(service['fetchNoteValue']).toHaveBeenCalledWith(
        'one_time_contribution',
        52,
        ele.elements[0]
      );
    });
  });

  describe('updateNoteValueForRadioOption', () => {
    beforeEach(() => {
      service['fetchNoteValue'] = jasmine.createSpy();
    });

    it('should not call fetchNoteValue if id does not include montlyContribution, specificMonthlyAmount or oneTimeContribution', async () => {
      element.options[3].id = 'id';
      await service['updateNoteValueForRadioOption'](
        element.options[3],
        undefined
      );
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });

    it('should use recurrent_payment if value is defined', async () => {
      element.options[3].value = 523;
      element.options[3].id = 'montlyContribution3';
      await service['updateNoteValueForRadioOption'](
        element.options[3],
        undefined
      );
      expect(service['fetchNoteValue']).toHaveBeenCalledWith(
        'recurrent_payment',
        523,
        element.options[3].elements[0]
      );
    });

    it('should getOverrideKeyAndValue if value is not defined', async () => {
      service['getOverrideKeyAndValue'] = jasmine
        .createSpy()
        .and.returnValue({key: 'key', value: 523});
      element.options[3].id = 'specificMonthlyAmount1234';
      await service['updateNoteValueForRadioOption'](element.options[3], {
        answer: '1',
      });
      expect(service['getOverrideKeyAndValue']).toHaveBeenCalledWith(
        'specificMonthlyAmount1234',
        {
          answer: '1',
        }
      );
      expect(service['fetchNoteValue']).toHaveBeenCalledWith(
        'key',
        523,
        element.options[3].elements[0].elements[0]
      );
    });

    it('should not call fetchNoteValue if no value is returned', async () => {
      service['getOverrideKeyAndValue'] = jasmine
        .createSpy()
        .and.returnValue({key: 'key', value: undefined});
      element.options[3].id = 'oneTimeContribution1234';
      await service['updateNoteValueForRadioOption'](element.options[3], {
        answer: '1',
      });
      expect(service['fetchNoteValue']).not.toHaveBeenCalled();
    });
  });

  describe('fetchNoteValue', () => {
    let url;
    beforeEach(() => {
      url = 'url';
      service['updateApiValues'] = jasmine.createSpy().and.returnValue(url);
      baseServiceSpy.get.and.returnValue(
        Promise.resolve({projectedShortfall: 5000, projectedSurplus: 0})
      );
      service['updatedShortfall'] = undefined;
      service['updatedEstimate'] = undefined;
    });

    it('should update the estimate if there are no old details', async () => {
      spyOn(service.valueChange, 'next');
      await service['fetchNoteValue'](
        'key',
        150,
        element.options[0].elements[0]
      );

      expect(service['updateApiValues']).toHaveBeenCalledWith(
        JSON.stringify(service['portfolioProjectorInputs']),
        service['portfolioProjectorInputs'],
        endpoints.portfolioProjector,
        {
          one_time_contribution: 'oneTimeContribution',
          existing_savings: 'existingSavings',
          recurrent_payment: 'monthlyPayment',
          annual_interest_rate: 'interestRate',
          years: 'yearsTilStart',
          rate_of_return: 'rateOfReturn',
          household_income: 'householdIncome',
          tax_filing_status_id: 'taxFilingStatus',
          state_id: 'stateId',
          college_projected_cost: 'total',
          goal_percentage: 'goalPercentage',
        },
        'key',
        150
      );
      expect(baseServiceSpy.get).toHaveBeenCalledWith(url);
      expect(service['updatedShortfall']).toBeTrue();
      expect(service['updatedEstimate']).toEqual(5000);
      expect(element.options[0].elements[0].description).toEqual(
        'You may fall short of your college savings goal by {0}.'
      );
      expect(service.valueChange.next).toHaveBeenCalled();
    });

    it('should consider a shortfall less than 1 to be a surplus', async () => {
      baseServiceSpy.get.and.returnValue(
        Promise.resolve({projectedShortfall: 0.5, projectedSurplus: 0})
      );
      spyOn(service.valueChange, 'next');
      await service['fetchNoteValue'](
        'key',
        150,
        element.options[0].elements[0]
      );

      expect(service['updatedShortfall']).toBeFalse();
      expect(service['updatedEstimate']).toEqual(0);
    });
  });

  describe('getCollegeList', () => {
    const mockSearchQueryParams = 'page=1';
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(mockCollegeList));
    });
    it('should call getCollegeList and fetch collegeList', async () => {
      const mockCollegeResult = await service.getCollegeList(
        mockSearchQueryParams
      );
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endpoints.getCollegeList + mockSearchQueryParams
      );
      expect(mockCollegeResult).toEqual(mockCollegeList);
    });
  });

  describe('filteredList', () => {
    let getCollegeListSpy;
    const mockSearchQueryParams = 'page=1';
    beforeEach(() => {
      getCollegeListSpy = spyOn(service, 'getCollegeList');
      getCollegeListSpy.and.returnValue(Promise.resolve(mockCollegeList));
    });
    it('should call getCollegeList and return as FilteredRecords', async () => {
      await service.filteredList(mockSearchQueryParams);
      expect(getCollegeListSpy).toHaveBeenCalledWith(mockSearchQueryParams);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
