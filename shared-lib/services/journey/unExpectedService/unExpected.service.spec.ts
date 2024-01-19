import {TestBed} from '@angular/core/testing';
import {JourneyService} from '../journey.service';
import {Journey} from '../models/journey.model';
import {UnExpectedService} from './unExpected.service';
import {CurrencyPipe} from '@angular/common';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {of, Subscription} from 'rxjs';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endpoints} from '../constants/unExpectedEndpoints';
import {Status} from '@shared-lib/constants/status.enum';
import {MXAccountRootObject} from '@shared-lib/services/mx-service/models/mx.model';
import {Router} from '@angular/router';

describe('UnExpectedService', () => {
  let service: UnExpectedService;
  let journeyServiceSpy;
  let currencyPipeSpy;
  let MXServiceSpy;
  let mockMXAccountData;
  let notificationSettingsServiceSpy;
  let settingsPrefs;
  let baseServiceSpy;
  let utilityServiceSpy;
  let journeyUtilityServiceSpy;
  let routerSpy;

  beforeEach(() => {
    baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
    utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
      'appendBaseUrlToEndpoints',
    ]);
    utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endpoints);
    journeyServiceSpy = jasmine.createSpyObj('journeyServiceSpy', [
      'safeParse',
      'getJourneyStatus',
      'getAnswerList',
    ]);
    journeyUtilityServiceSpy = jasmine.createSpyObj('JourneyUtilityService', [
      'addAccountIconName',
    ]);
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
    const testPartyId = '394fab41-6658-4164-9872-606ab1660bfb';
    const sampleDate = new Date('2021-11-15T12:57:58');
    settingsPrefs = {
      required: false,
      primaryEmail: {
        lastUpdatedDate: sampleDate,
        partyContactId: testPartyId,
        email: 'test@voya.com',
        lastFailedInd: 'N',
      },
      secondaryEmailAllowed: false,
      docDeliveryEmailContactId: testPartyId,
      mobilePhone: {
        lastUpdatedDate: sampleDate,
        partyContactId: testPartyId,
        phoneNumber: testPartyId,
      },
      insightsNotificationPrefs: {
        prefPushNotificationContactId: testPartyId,
        prefMobileContactId: testPartyId,
        prefEmailContactId: testPartyId,
      },
      highPrioitytNotificationPrefs: {
        prefPushNotificationContactId: testPartyId,
        prefMobileContactId: testPartyId,
        prefEmailContactId: testPartyId,
      },
      accountAlertPrefs: {
        prefPushNotificationContactId: testPartyId,
        prefMobileContactId: testPartyId,
        prefEmailContactId: testPartyId,
      },
    };

    MXServiceSpy = jasmine.createSpyObj('MXService', ['getMxAccountConnect']);
    MXServiceSpy.getMxAccountConnect.and.returnValue({
      subscribe: () => undefined,
    });
    notificationSettingsServiceSpy = jasmine.createSpyObj(
      'NotificationSettingsService',
      ['setPrefsSettings', 'getCheckedAndActive'],
      {notificationPrefsChanged$: of(settingsPrefs)}
    );
    currencyPipeSpy = jasmine.createSpyObj('currencyPipeSpy', ['transform']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: CurrencyPipe, useValue: currencyPipeSpy},
        {provide: MXService, useValue: MXServiceSpy},
        {provide: JourneyService, useValue: journeyServiceSpy},
        {
          provide: NotificationsSettingService,
          useValue: notificationSettingsServiceSpy,
        },
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: journeyUtilityServiceSpy, useValue: journeyUtilityServiceSpy},
        {provide: Router, useValue: routerSpy},
      ],
    });

    service = TestBed.inject(UnExpectedService);
    service['subscription'] = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
      'add',
    ]);
  });

  describe('initialize', () => {
    let journey: Journey;
    beforeEach(() => {
      journey = {
        journeyID: 4,
        journeyName: 'Journey Name 4',
        lastModifiedStepIndex: 0,
        steps: [
          {
            answer:
              '{"jobLossWeeks":"4","adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"SavedMoney\\":\\"$0\\"}","grossYearIncome":"$1,000.11"}',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
          },
        ],
      };
      notificationSettingsServiceSpy.getCheckedAndActive.and.returnValue({
        sectionActive: false,
      });
      spyOn(service.valueChange, 'next');
      service['setAnswers'] = jasmine.createSpy();
      service['setMaxJobLossWeeks'] = jasmine.createSpy();
      service['setOverviewSummary'] = jasmine.createSpy();
      journeyServiceSpy.getAnswerList.and.returnValue([
        journey.steps[0].answer,
      ]);
    });

    it('should call journeyService to get answerList', () => {
      service.initialize(journey);
      expect(journeyServiceSpy.getAnswerList).toHaveBeenCalledWith(journey);
    });

    it('should set answers', () => {
      service.initialize(journey);
      expect(service['setAnswers']).toHaveBeenCalledWith([
        journey.steps[0].answer,
      ]);
    });

    it('should call setMaxJobLossWeeks', () => {
      service.initialize(journey);
      expect(service['setMaxJobLossWeeks']).toHaveBeenCalledWith(journey);
    });

    it('should call setOverviewSummary', () => {
      service.initialize(journey);
      expect(service['setOverviewSummary']).toHaveBeenCalledWith(journey);
    });

    it('should call valueChange.next', () => {
      service.initialize(journey);
      expect(service.valueChange.next).toHaveBeenCalled();
    });
  });

  describe('setAnswers', () => {
    beforeEach(() => {
      service['emergencyGoalCalculation'] = jasmine.createSpy();
      service['setSavedMoney'] = jasmine.createSpy();
      service['setGrossYearIncome'] = jasmine.createSpy();
      service['targetAchieved'] = jasmine.createSpy();
      service['adjustedTargetAchieved'] = jasmine.createSpy();
    });
    it("when parsedAnswer['grossYearIncome'] && parsedAnswer['jobLossWeeks'] will be defined", () => {
      service['grossYearIncome'] = '1000.11';
      service['weeksInYear'] = 52;
      const answerList = [
        '{"jobLossWeeks":"4","adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"SavedMoney\\":\\"$0\\"}","grossYearIncome":"$1,000.11"}',
      ];
      journeyServiceSpy.safeParse.and.returnValue({
        jobLossWeeks: '4',
        adjustGoal: '{"adjustGoal":"adjustGoalYes","SavedMoney":"$0"}',
        grossYearIncome: '$1,000.11',
      });
      service['setAnswers'](answerList);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(answerList[0]);
      expect(service['setGrossYearIncome']).toHaveBeenCalledWith('$1,000.11');
      expect(service['grossWeeklyIncome']).toEqual(19.23076923076923);
      expect(service['jobLossWeeks']).toEqual('4');
      expect(service['setSavedMoney']).toHaveBeenCalledWith({
        jobLossWeeks: '4',
        adjustGoal: '{"adjustGoal":"adjustGoalYes","SavedMoney":"$0"}',
        grossYearIncome: '$1,000.11',
      });
      expect(service['emergencyGoalCalculation']).toHaveBeenCalledWith(
        '4',
        'defaultEmergencySavingGoal',
        'defaultTargetMonthlyContribution'
      );
    });
    it("when parsedAnswer['grossYearIncome'] will be defined but adjustedJobLossWeeks will not be defined", () => {
      const answerList = [
        '{"adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"SavedMoney\\":\\"$0\\"}","grossYearIncome":"$1,000.11"}',
      ];
      journeyServiceSpy.safeParse.and.returnValue({
        adjustGoal: '{"adjustGoal":"adjustGoalYes","SavedMoney":"$0"}',
        grossYearIncome: '$1,000.11',
      });
      service['setAnswers'](answerList);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(answerList[0]);
      expect(service['jobLossWeeks']).toEqual('4');
    });
    it("when parsedAnswer['grossYearIncome'] will be defined but adjustedJobLossWeeks will be defined", () => {
      const answerList = [
        '{"adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"SavedMoney\\":\\"$0\\"}","grossYearIncome":"$1,000.11"}',
      ];
      journeyServiceSpy.safeParse.and.returnValue({
        adjustGoal: '{"adjustGoal":"adjustGoalYes","SavedMoney":"$0"}',
        grossYearIncome: '$1,000.11',
      });
      service['adjustedJobLossWeeks'] = 5;
      service['setAnswers'](answerList);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(answerList[0]);
      expect(service['jobLossWeeks']).toEqual(
        service['adjustedJobLossWeeks'].toString()
      );
    });
    it("when  parsedAnswer['linkExistingAccount'] will be defined", () => {
      service['checkMXAccountsExists'] = jasmine.createSpy();
      service['MXAccountData'] = mockMXAccountData;
      const answerList = [
        '{"linkExistingAccount":"ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9"}',
      ];
      journeyServiceSpy.safeParse.and.returnValue({
        linkExistingAccount: 'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9',
      });
      service.currentSavings = undefined;
      service['setAnswers'](answerList);
      expect(service.accountLinkedId).toEqual(
        'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9'
      );
      expect(service['checkMXAccountsExists']).toHaveBeenCalled();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(answerList[0]);
    });
    it('when parsedAnswer will be undefined', () => {
      journeyServiceSpy.safeParse.and.returnValue(null);
      service['setAnswers']([null]);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(null);
      expect(service['emergencyGoalCalculation']).not.toHaveBeenCalled();
    });

    it('should not set currentSavings if account is linked', () => {
      journeyServiceSpy.safeParse.and.returnValue({linkExistingAccount: {}});
      service['accountBalance'] = 5000;
      service['savedMoney'] = 1000;
      service.currentSavings = 0;
      service['checkMXAccountsExists'] = jasmine
        .createSpy()
        .and.callFake(() => (service.accountLinked = true));
      service['setAnswers']([null]);
      expect(service.currentSavings).toEqual(0);
    });

    it('should set currentSavings to savedMoney if account is not linked', () => {
      journeyServiceSpy.safeParse.and.returnValue(null);
      service.accountLinked = false;
      service['accountBalance'] = 5000;
      service['savedMoney'] = 1000;
      service.currentSavings = 0;
      service['setAnswers']([null]);
      expect(service.currentSavings).toEqual(1000);
    });
  });

  describe('targetAchieved', () => {
    beforeEach(() => {
      service['isTargetAchieved'] = undefined;
      service['isTargetNotAchieved'] = undefined;
    });

    it('should set the value to false if defaultEmergencySavingGoal is not set', () => {
      service.currentSavings = 1000;
      service.defaultEmergencySavingGoal = undefined;
      service.targetAchieved();
      expect(service['isTargetAchieved']).toEqual(false);
      expect(service['isTargetNotAchieved']).toEqual(true);
    });

    it('should set the value of isTargetAchieved to true', () => {
      service.currentSavings = 1000;
      service.defaultEmergencySavingGoal = '$999';
      service.targetAchieved();
      expect(service['isTargetAchieved']).toEqual(true);
      expect(service['isTargetNotAchieved']).toEqual(false);
    });

    it('should set the value of isTargetAchieved to false', () => {
      service.currentSavings = 999;
      service.defaultEmergencySavingGoal = '$10,000';
      service.targetAchieved();
      expect(service['isTargetAchieved']).toEqual(false);
      expect(service['isTargetNotAchieved']).toEqual(true);
    });
  });

  describe('adjustedTargetAchieved', () => {
    beforeEach(() => {
      service['isAdjustedTargetAchieved'] = undefined;
      service['isAdjustedTargetNotAchieved'] = undefined;
    });

    it('should set the value to false if adjustedEmergencySavingGoal is not set', () => {
      service.currentSavings = 1000;
      service.adjustedEmergencySavingGoal = undefined;
      service.adjustedTargetAchieved();
      expect(service['isAdjustedTargetAchieved']).toEqual(false);
      expect(service['isAdjustedTargetNotAchieved']).toEqual(true);
    });

    it('should set the value of isAdjustedTargetAchieved to true', () => {
      service.currentSavings = 1000;
      service.adjustedEmergencySavingGoal = '$999';
      service.adjustedTargetAchieved();
      expect(service['isAdjustedTargetAchieved']).toEqual(true);
      expect(service['isAdjustedTargetNotAchieved']).toEqual(false);
    });

    it('should set the value of isAdjustedTargetAchieved to false', () => {
      service.currentSavings = 999;
      service.adjustedEmergencySavingGoal = '$10,000';
      service.adjustedTargetAchieved();
      expect(service['isAdjustedTargetAchieved']).toEqual(false);
      expect(service['isAdjustedTargetNotAchieved']).toEqual(true);
    });
  });

  describe('setAccountStatus', () => {
    it('if there is accounts and linked account is present', () => {
      service.accountLinkedId = 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1';
      service['setAccountStatus'](mockMXAccountData);
      expect(service.accountNotLinked).toEqual(false);
      expect(service.accountLinked).toEqual(true);
    });
    it('if there is no accounts', () => {
      const mockData: MXAccountRootObject = {
        accounts: [],
      };
      service['setAccountStatus'](mockData);
      expect(service.accountLinked).toEqual(undefined);
      expect(service.accountNotLinked).toEqual(undefined);
    });

    it('should set the accountBalance if an account is linked and there is a matching account', () => {
      service['accountBalance'] = undefined;
      service.currentSavings = undefined;
      service.accountLinkedId = 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1';
      service['setAccountStatus'](mockMXAccountData);
      expect(service['accountBalance']).toEqual(1000);
      expect(service.currentSavings).toEqual(1000);
    });

    it('should set the accountBalance to 0 if an account is linked and there is a matching account but there is no accountbalance', () => {
      service['accountBalance'] = undefined;
      service.accountLinkedId = 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1';
      mockMXAccountData.accounts[0].balance = undefined;
      service['setAccountStatus'](mockMXAccountData);
      expect(service['accountBalance']).toEqual(0);
    });

    it('should not set the accountBalance if no account is linked', () => {
      service['accountBalance'] = undefined;
      service.accountLinkedId = undefined;
      service['setAccountStatus'](mockMXAccountData);
      expect(service['accountBalance']).toBeUndefined();
    });

    it('should not set the accountBalance if no matching account is linked', () => {
      service['accountBalance'] = undefined;
      service.accountLinkedId = 'abc';
      service['setAccountStatus'](mockMXAccountData);
      expect(service['accountBalance']).toBeUndefined();
    });

    it('should set the currentSavings to savedMoney if no account is linked', () => {
      service.currentSavings = undefined;
      service['savedMoney'] = 2000;
      service.accountLinkedId = 'abc';
      service['setAccountStatus'](mockMXAccountData);
      expect(service['currentSavings']).toEqual(2000);
    });
  });

  describe('checkMXAccountsExists', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      observable = of(mockMXAccountData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockMXAccountData);
        return subscription;
      });
      service['setAccountStatus'] = jasmine.createSpy();
      spyOn(service, 'getMXAccountData').and.returnValue(observable);
      service['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
      spyOn(service.valueChange, 'next');
    });

    it('if mxAccount is defined', () => {
      service['MXAccountData'] = mockMXAccountData;
      service['checkMXAccountsExists']();
      expect(service['setAccountStatus']).toHaveBeenCalledWith(
        mockMXAccountData
      );
      expect(service.getMXAccountData).not.toHaveBeenCalled();
    });

    it('if mxAccount is not defined', () => {
      service['MXAccountData'] = undefined;
      service['checkMXAccountsExists']();
      expect(service['setAccountStatus']).toHaveBeenCalledWith(
        mockMXAccountData
      );
      expect(service.getMXAccountData).toHaveBeenCalled();
      expect(service['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(service.valueChange.next).toHaveBeenCalled();
    });
  });

  describe('stepChange', () => {
    let journey: Journey;
    beforeEach(() => {
      journey = {
        journeyID: 4,
        journeyName: 'Journey Name 4',
        lastModifiedStepIndex: 0,
        steps: [
          {
            answer:
              '{"jobLossWeeks":"4","adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"SavedMoney\\":\\"$0\\"}","grossYearIncome":"$1,000.11"}',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
          },
        ],
      };
      spyOn(service.valueChange, 'next');
      service['setAnswers'] = jasmine.createSpy();
      service['setMaxJobLossWeeks'] = jasmine.createSpy();
      service['setOverviewSummary'] = jasmine.createSpy();
      journeyServiceSpy.getAnswerList.and.returnValue([
        journey.steps[0].answer,
      ]);
    });
    it('should set answers', () => {
      service.stepChange(journey);
      expect(service['setAnswers']).toHaveBeenCalledWith([
        journey.steps[0].answer,
      ]);
    });
    it('should call setMaxJobLossWeeks', () => {
      service.stepChange(journey);
      expect(service['setMaxJobLossWeeks']).toHaveBeenCalledWith(journey);
    });
    it('should call setOverviewSummary', () => {
      service.stepChange(journey);
      expect(service['setOverviewSummary']).toHaveBeenCalledWith(journey);
    });
    it('should call valueChange.next', () => {
      service.stepChange(journey);
      expect(service.valueChange.next).toHaveBeenCalled();
    });
  });

  describe('setGrossYearIncome', () => {
    it('should set grossYearIncome', () => {
      service['setGrossYearIncome']('$1,000.11');
      expect(service['grossYearIncome']).toEqual('1000.11');
    });
  });

  describe('setSavedMoney', () => {
    it('when savedMoney not equal to 0', () => {
      journeyServiceSpy.safeParse.and.returnValue({
        adjustGoal: 'adjustGoalYes',
        SavedMoney: '$3',
      });
      service['setSavedMoney']({
        jobLossWeeks: '4',
        adjustGoal: '{"adjustGoal":"adjustGoalYes","SavedMoney":"$3"}',
        grossYearIncome: '$1,000.11',
      });
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        '{"adjustGoal":"adjustGoalYes","SavedMoney":"$3"}'
      );
      expect(service['savedMoney']).not.toEqual(0);
    });
    describe('when savedMoney equal to 0', () => {
      it('if adjustGoal is undefined', () => {
        service['setSavedMoney']({
          jobLossWeeks: '4',
          grossYearIncome: '$1,000.11',
        });
        expect(service['savedMoney']).toEqual(0);
      });
      it('if adjustGoal is adjustGoalNo', () => {
        journeyServiceSpy.safeParse.and.returnValue({
          adjustGoal: 'adjustGoalNo',
          SavedMoney: '$3',
        });
        service['setSavedMoney']({
          jobLossWeeks: '4',
          adjustGoal: '{"adjustGoal":"adjustGoalNo","SavedMoney":"$3"}',
          grossYearIncome: '$1,000.11',
        });
        expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
          '{"adjustGoal":"adjustGoalNo","SavedMoney":"$3"}'
        );
        expect(service['savedMoney']).toEqual(0);
      });
      it('when adjustGoal will be adjustGoalYes but SavedMoney will be empty', () => {
        journeyServiceSpy.safeParse.and.returnValue({
          adjustGoal: 'adjustGoalYes',
          SavedMoney: '$',
        });
        service['setSavedMoney']({
          jobLossWeeks: '4',
          adjustGoal: '{"adjustGoal":"adjustGoalYes","SavedMoney":"$"}',
          grossYearIncome: '$1,000.11',
        });
        expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
          '{"adjustGoal":"adjustGoalYes","SavedMoney":"$"}'
        );
        expect(service['savedMoney']).toEqual(0);
      });
    });
  });

  describe('onChange', () => {
    beforeEach(() => {
      service['emergencyGoalCalculation'] = jasmine.createSpy();
      service['adjustedTargetAchieved'] = jasmine.createSpy();
      spyOn(service.valueChange, 'next');
    });
    it('when newValue will not be equal to adjustedJobLossWeeks', () => {
      service.adjustedJobLossWeeks = 12;
      service.onChange(10);
      expect(service.adjustedJobLossWeeks).toEqual(10);
      expect(service['emergencyGoalCalculation']).toHaveBeenCalledWith(
        '10',
        'adjustedEmergencySavingGoal',
        'adjustedTargetMonthlyContribution'
      );
      expect(service.valueChange.next).toHaveBeenCalled();
    });
    it('when newValue will not be equal to adjustedJobLossWeeks', () => {
      service.adjustedJobLossWeeks = 10;
      service.onChange(10);
      expect(service.adjustedJobLossWeeks).toEqual(10);
      expect(service['emergencyGoalCalculation']).not.toHaveBeenCalled();
      expect(service.valueChange.next).not.toHaveBeenCalled();
    });
    it('should call adjustedTargetAchieved', () => {
      service.onChange(10);
      expect(service['adjustedTargetAchieved']).toHaveBeenCalled();
    });
  });

  it('reset', () => {
    service['resetJobLossWeeks'] = 10;
    const result = service.reset();
    expect(result).toEqual(10);
  });

  describe('setMaxJobLossWeeks', () => {
    beforeEach(() => {
      journeyServiceSpy.safeParse.and.callFake(str =>
        str && str !== 'undefined' ? JSON.parse(str) : undefined
      );
      service['jobLossWeeks'] = '10';
      service['emergencyGoalCalculation'] = jasmine.createSpy();
    });
    it('should set adjustedJobLossWeeks', () => {
      const journey = {
        journeyID: 4,
        journeyName: 'Journey Name',
        lastModifiedStepIndex: 0,
        steps: [
          {
            answer:
              '{"adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"adjustedUnexpectedGoal\\":\\"{\\\\\\"52\\\\\\":\\\\\\"4\\\\\\"}\\"}"}',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
          },
        ],
      };
      service['setMaxJobLossWeeks'](journey);
      expect(service['isAdjustGoalYes']).toEqual(true);
      expect(service.adjustedJobLossWeeks).toEqual(4);
      expect(service['resetJobLossWeeks']).toEqual(4);
      expect(service['emergencyGoalCalculation']).toHaveBeenCalledWith(
        '4',
        'adjustedEmergencySavingGoal',
        'adjustedTargetMonthlyContribution'
      );
    });
    it('should set adjustedJobLossWeeks when adjustedUnexpectedGoal not there', () => {
      const journey = {
        journeyID: 4,
        journeyName: 'Journey Name 4',
        lastModifiedStepIndex: 0,
        steps: [
          {
            answer:
              '{"adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"adjustedUnexpected\\":\\"{\\\\\\"52\\\\\\":\\\\\\"4\\\\\\"}\\"}"}',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
          },
        ],
      };
      service['setMaxJobLossWeeks'](journey);
      expect(service.adjustedJobLossWeeks).toEqual(10);
      expect(service['resetJobLossWeeks']).toEqual(10);
      expect(service['emergencyGoalCalculation']).toHaveBeenCalledWith(
        '10',
        'adjustedEmergencySavingGoal',
        'adjustedTargetMonthlyContribution'
      );
    });
    it('should set adjustedJobLossWeeks when adjustGoal not there', () => {
      const journey = {
        journeyID: 4,
        journeyName: 'Journey Name 4',
        lastModifiedStepIndex: 0,
        steps: [
          {
            answer:
              '{"adjust":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"adjustedUnexpected\\":\\"{\\\\\\"52\\\\\\":\\\\\\"4\\\\\\"}\\"}"}',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
          },
        ],
      };
      service['setMaxJobLossWeeks'](journey);
      expect(service.adjustedJobLossWeeks).toEqual(10);
      expect(service['resetJobLossWeeks']).toEqual(10);
      expect(service['emergencyGoalCalculation']).toHaveBeenCalledWith(
        '10',
        'adjustedEmergencySavingGoal',
        'adjustedTargetMonthlyContribution'
      );
    });
    it('when isAdjustGoalYes would be false', () => {
      const journey = {
        journeyID: 4,
        journeyName: 'Journey Name 4',
        lastModifiedStepIndex: 0,
        steps: [
          {
            answer:
              '{"adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalNo\\",\\"adjustedUnexpectedGoal\\":\\"{\\\\\\"52\\\\\\":\\\\\\"4\\\\\\"}\\"}"}',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
          },
        ],
      };
      service['setMaxJobLossWeeks'](journey);
      expect(service['isAdjustGoalYes']).toEqual(false);
      expect(service.adjustedJobLossWeeks).toEqual(4);
      expect(service['resetJobLossWeeks']).toEqual(4);
      expect(service['emergencyGoalCalculation']).toHaveBeenCalledWith(
        '4',
        'adjustedEmergencySavingGoal',
        'adjustedTargetMonthlyContribution'
      );
    });
  });

  describe('emergencyGoalCalculation', () => {
    beforeEach(() => {
      service['grossWeeklyIncome'] = 1.9230769230769231;
      service['savedMoney'] = 10;
      service['setValuesOfGoalCalculation'] = jasmine.createSpy();
      service['monthsOfThreeYears'] = 36;
    });
    it('should call setValuesOfGoalCalculation', () => {
      service['emergencyGoalCalculation'](
        '4',
        'defaultEmergencySavingGoal',
        'defaultTargetMonthlyContribution'
      );
      expect(service['setValuesOfGoalCalculation']).toHaveBeenCalledWith(
        'defaultEmergencySavingGoal',
        7.6923076923076925
      );
      expect(service['setValuesOfGoalCalculation']).toHaveBeenCalledWith(
        'defaultTargetMonthlyContribution',
        0.2136752136752137
      );
    });
  });

  describe('setValuesOfGoalCalculation', () => {
    it('when key will be setValuesOfGoalCalculation', () => {
      service['setValuesOfGoalCalculation'](
        'defaultEmergencySavingGoal',
        7.6923076923076925
      );
      expect(currencyPipeSpy.transform).toHaveBeenCalledWith(
        7.6923076923076925,
        'USD',
        true,
        '1.2-2'
      );
    });
  });

  describe('setOverviewSummary', () => {
    let journey;
    beforeEach(() => {
      service['getTargetCompletionDate'] = jasmine
        .createSpy()
        .and.returnValue('Oct 2022');
      service.adjustedEmergencySavingGoal = '20';
      service.adjustedTargetMonthlyContribution = '2';
      service.defaultEmergencySavingGoal = '10';
      service.defaultTargetMonthlyContribution = '1';
      service['savedMoney'] = 0;
      journey = {
        journeyID: 4,
        steps: [
          {
            answer:
              '{"jobLossWeeks":"4","adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"SavedMoney\\":\\"$0\\"}","grossYearIncome":"$1,000.11"}',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
          },
        ],
      };
    });
    it('when isAdjustGoalYes will be true', () => {
      service['isAdjustGoalYes'] = true;
      service['setOverviewSummary'](journey);
      expect(service.emergencySavingGoal).toEqual('20');
      expect(service.targetMonthlyContribution).toEqual('2');
      expect(journeyServiceSpy.getJourneyStatus).toHaveBeenCalledWith(
        journey.steps
      );
    });
    it('when isAdjustGoalYes will be false', () => {
      service['isAdjustGoalYes'] = false;
      service['setOverviewSummary'](journey);
      expect(service.emergencySavingGoal).toEqual('10');
      expect(service.targetMonthlyContribution).toEqual('1');
    });
    it('when status will be Status.completed', () => {
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.completed);
      service['isAdjustGoalYes'] = true;
      service['setOverviewSummary'](journey);
      expect(service['getTargetCompletionDate']).toHaveBeenCalledWith(journey);
      expect(service.targetCompletionDate).toEqual('Oct 2022');
    });
    it('when status will be Status.inProgress', () => {
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.inProgress);
      service['isAdjustGoalYes'] = true;
      service['setOverviewSummary'](journey);
      expect(service['getTargetCompletionDate']).not.toHaveBeenCalled();
      expect(service.targetCompletionDate).not.toEqual('Oct 2022');
    });
  });

  describe('fetchUnexpectedGoalContent', () => {
    let content;
    beforeEach(() => {
      content = {UnexpectedGoalJSON: '{"id": "123"}'};
    });

    it('should call baseService and return the parsed UnexpectedGoalJSON', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(content));
      const result = await service.fetchUnexpectedGoalContent();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endpoints.getUnexpectedContent
      );
      expect(result).toEqual(JSON.parse(content.UnexpectedGoalJSON));
    });

    it('should not call baseService if the promise is already set', async () => {
      service['unexpectedGoalContentPromise'] = Promise.resolve(content);
      const result = await service.fetchUnexpectedGoalContent();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(JSON.parse(content.UnexpectedGoalJSON));
    });
  });

  describe('getTargetCompletionDate', () => {
    let journey;
    beforeEach(() => {
      journey = {
        journeyID: 4,
        steps: [
          {
            answer:
              '{"jobLossWeeks":"4","adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"SavedMoney\\":\\"$0\\"}","grossYearIncome":"$1,000.11"}',
            journeyStepCMSTagId: 'cmsTagId1',
            journeyStepName: '1',
            msgType: 'msgType1',
            createdDt: '2022-10-17T16:23:04',
          },
        ],
      };
      service['monthsOfThreeYears'] = 36;
      jasmine.clock().install();
      const today = new Date('2022-09-25');
      jasmine.clock().mockDate(today);
    });

    it('should set the completion based on the createdDt of the first step', () => {
      const result = service['getTargetCompletionDate'](journey);
      expect(result).toEqual('Oct 2025');
    });

    it('should set the completion based on todays date if there is no createdDt', () => {
      journey.steps[0].createdDt = undefined;
      const result = service['getTargetCompletionDate'](journey);
      expect(result).toEqual('Sep 2025');
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });
  });

  describe('getMXAccountData', () => {
    it('when typeName will not be matched with conditions', () => {
      MXServiceSpy.getMxAccountConnect.and.returnValue(of(mockMXAccountData));
      service.getMXAccountData().subscribe(res => {
        expect(res.accounts.length).toEqual(0);
      });
    });
    it('when typeName will be matched with conditions', () => {
      service.accountLinkedId = 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1';
      const mockMXAccount = {
        accounts: [
          {
            account_number: 'XXXXX9200',
            account_type_name: 'Savings',
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
          {
            account_number: 'XXXXX9201',
            account_type_name: 'Checking',
            available_balance: '1000.0',
            balance: '1000.0',
            currency_code: 'USD',
            guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd0',
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
      MXServiceSpy.getMxAccountConnect.and.returnValue(of(mockMXAccount));
      service.getMXAccountData().subscribe(res => {
        expect(res.accounts.length).toEqual(2);
        expect(MXServiceSpy.getMxAccountConnect).toHaveBeenCalledWith();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscription', () => {
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
