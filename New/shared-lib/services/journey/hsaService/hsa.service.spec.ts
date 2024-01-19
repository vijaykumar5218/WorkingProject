import {TestBed} from '@angular/core/testing';
import {BaseService} from '../../base/base-factory-provider';
import {SharedUtilityService} from '../../utility/utility.service';
import {endpoints} from '../constants/hsaEndpoints';
import {JourneyService} from '../journey.service';
import {Journey} from '../models/journey.model';
import {HSAService} from './hsa.service';
import {of} from 'rxjs';
import {NotificationsSettingService} from '../../notification-setting/notification-setting.service';

describe('HSAService', () => {
  let service: HSAService;
  let baseServiceSpy;
  let utilityServiceSpy;
  let journeyServiceSpy;
  let notificationSettingsServiceSpy;
  let goalData;
  let settingsPrefs;

  beforeEach(() => {
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

    baseServiceSpy = jasmine.createSpyObj('BaseService', ['get']);
    utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
      'appendBaseUrlToEndpoints',
    ]);
    utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endpoints);
    journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
      'safeParse',
      'setRefreshMxAccount',
      'getRefreshMxAccount',
      'getAnswerList',
    ]);
    notificationSettingsServiceSpy = jasmine.createSpyObj(
      'NotificationSettingsService',
      ['setPrefsSettings', 'getCheckedAndActive'],
      {notificationPrefsChanged$: of(settingsPrefs)}
    );
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
      ],
    });
    service = TestBed.inject(HSAService);
    goalData = {
      currentBalance: 44.01,
      currentContributionPerPayPeriod: 7.7069230769230765,
      payPeriods: 26,
      singleMaxAmt: 3650.0,
      familyMaxAmt: 7300.0,
      catchUpAmt: 1000.0,
      individual: false,
      onFile: true,
      notOnFile: false,
      overCatchupAge: false,
      ytdContribution: 500.0,
      hsaJourneyAnswers: [
        '{}',
        '{"currentHSABalance":"$523","perPayPeriodContribution":"$23123","payFrequency":"{\\"label\\":\\"Bi-weekly\\",\\"id\\":\\"bi-weekly\\",\\"value\\":24}","whoAreYouUsingHSAFor":"{\\"whoAreYouUsingHSAFor\\":\\"individual\\"}"}',
        undefined,
      ],
      accountLinked: false,
      accountNotLinked: true,
      logoUrl: 'fakeLogoUrl',
      accountName: 'fakeAccountName',
    };
  });

  describe('constructor', () => {
    it('should append the base url to the endpoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
        endpoints
      );
    });
  });

  describe('initialize', () => {
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
          },
        ],
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(goalData));
      spyOn(service, 'calculateRecommendations');
      journeyServiceSpy.safeParse.and.callFake(str =>
        str && str !== 'undefined' ? JSON.parse(str) : undefined
      );
      notificationSettingsServiceSpy.getCheckedAndActive.and.returnValue({
        sectionActive: false,
      });
      spyOn(service, 'onChange');
      spyOn(service, 'setAccountLinkFlag');
      service['goalData'] = goalData;
      journeyServiceSpy.getRefreshMxAccount.and.returnValue('false');
    });

    it('should call setPrefsSettings', async () => {
      await service.initialize(journey);
      expect(
        notificationSettingsServiceSpy.setPrefsSettings
      ).toHaveBeenCalled();
    });

    it('should set displayNotificationSection according to getCheckedAndActive', async () => {
      service.displayNotificationSection = undefined;
      await service.initialize(journey);
      expect(
        notificationSettingsServiceSpy.getCheckedAndActive
      ).toHaveBeenCalledWith(settingsPrefs, 'AAPref');
      expect(service.displayNotificationSection).toBeTrue();
    });

    it('should set the onFile data if notOnFile is false and call calculateRecommendations', async () => {
      service['payPeriods'] = undefined;
      service['isIndividual'] = undefined;
      service.currentContribution = undefined;
      goalData.accountLinked = true;
      await service.initialize(journey);
      expect(service['payPeriods']).toEqual(24);
      expect(service['isIndividual']).toEqual(goalData.individual);
      expect(service.calculateRecommendations).toHaveBeenCalled();
    });

    it('should set the notOnFile data if notOnFile is true and call calculateRecommendations', async () => {
      service['payPeriods'] = undefined;
      service['isIndividual'] = undefined;
      goalData.notOnFile = true;
      goalData.accountLinked = true;
      service.notOnFile = true;
      await service.initialize(journey);
      expect(service['payPeriods']).toEqual(24);
      expect(service['isIndividual']).toEqual(true);
      expect(service.calculateRecommendations).toHaveBeenCalled();
    });

    it('should set the currentBalance if the account is not linked', async () => {
      service.currentBalance = undefined;
      goalData.currentBalance = undefined;
      goalData.accountLinked = false;
      await service.initialize(journey);
      expect(service.currentBalance).toEqual(523);
    });

    it('should set isIndividual to false if notOnFile is true and value is not individual', async () => {
      goalData.hsaJourneyAnswers = [
        '{"currentHSABalance":"$523","perPayPeriodContribution":"$23123","payFrequency":"{\\"label\\":\\"Bi-weekly\\",\\"id\\":\\"bi-weekly\\",\\"value\\":24}","whoAreYouUsingHSAFor":"{\\"whoAreYouUsingHSAFor\\":\\"family\\"}"}',
      ];
      service['isIndividual'] = undefined;
      goalData.notOnFile = true;
      goalData.onFile = false;
      service.notOnFile = true;
      await service.initialize(journey);
      expect(service['isIndividual']).toEqual(false);
    });

    it('should not set isIndividual if notOnFile is true and value is undefined', async () => {
      goalData.hsaJourneyAnswers = [
        '{"currentHSABalance":"$523","perPayPeriodContribution":"$23123","payFrequency":"{\\"label\\":\\"Bi-weekly\\",\\"id\\":\\"bi-weekly\\",\\"value\\":24}","whoAreYouUsingHSAFor":"undefined"}',
      ];
      service['isIndividual'] = undefined;
      goalData.notOnFile = true;
      goalData.onFile = false;
      await service.initialize(journey);
      expect(service['isIndividual']).toBeUndefined();
    });

    it('should not set isIndividual if notOnFile is true and value is not in the answer', async () => {
      goalData.hsaJourneyAnswers = [
        '{"currentHSABalance":"$523","perPayPeriodContribution":"$23123","payFrequency":"{\\"label\\":\\"Bi-weekly\\",\\"id\\":\\"bi-weekly\\",\\"value\\":24}","whoAreYouUsingHSAFor":"{\\"whoAreYouUsingHSAFor2\\":\\"family\\"}"}',
      ];
      service['isIndividual'] = undefined;
      goalData.notOnFile = true;
      goalData.onFile = false;
      await service.initialize(journey);
      expect(service['isIndividual']).toBeUndefined();
    });

    it('should not set adjustedMaxContribution if adjustGoal is not present in response', async () => {
      goalData.hsaJourneyAnswers = [
        '{"currentHSABalance":"$523","perPayPeriodContribution":"$23123","payFrequency":"{\\"label\\":\\"Bi-weekly\\",\\"id\\":\\"bi-weekly\\",\\"value\\":24}","whoAreYouUsingHSAFor":"{\\"whoAreYouUsingHSAFor2\\":\\"family\\"}"}',
      ];
      service.adjustedMaxContribution = undefined;
      await service.initialize(journey);
      expect(service.adjustedMaxContribution).toBeUndefined();
    });

    it('should not set adjustedMaxContribution if adjustGoal answer does not parse', async () => {
      goalData.hsaJourneyAnswers = [
        '{"currentHSABalance":"$523","perPayPeriodContribution":"$23123","payFrequency":"{\\"label\\":\\"Bi-weekly\\",\\"id\\":\\"bi-weekly\\",\\"value\\":24}","adjustGoal":"undefined"}',
      ];
      service.adjustedMaxContribution = undefined;
      await service.initialize(journey);
      expect(service.adjustedMaxContribution).toBeUndefined();
    });

    it('should not set adjustedMaxContribution if adjustGoal answer is not yes', async () => {
      goalData.hsaJourneyAnswers = [
        '{"currentHSABalance":"$523","perPayPeriodContribution":"$23123","payFrequency":"{\\"label\\":\\"Bi-weekly\\",\\"id\\":\\"bi-weekly\\",\\"value\\":24}","adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalNo\\"}"}',
      ];
      service.adjustedMaxContribution = undefined;
      await service.initialize(journey);
      expect(service.adjustedMaxContribution).toBeUndefined();
    });

    it('should not set adjustedMaxContribution if adjustGoal answer is yes but adjustedHSAGoal does not parse', async () => {
      goalData.hsaJourneyAnswers = [
        '{"currentHSABalance":"$523","perPayPeriodContribution":"$23123","payFrequency":"{\\"label\\":\\"Bi-weekly\\",\\"id\\":\\"bi-weekly\\",\\"value\\":24}","adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\"}"}',
      ];
      service.adjustedMaxContribution = undefined;
      await service.initialize(journey);
      expect(service.adjustedMaxContribution).toBeUndefined();
    });

    it('should set adjustedMaxContribution if adjustGoal answer is yes and adjustedHSAGoal parses', async () => {
      goalData.hsaJourneyAnswers = [
        '{"adjustGoal":"{\\"adjustGoal\\":\\"adjustGoalYes\\",\\"adjustedHSAGoal\\":\\"{\\\\\\"7300\\\\\\":\\\\\\"$3264\\\\\\"}\\"}"}',
      ];
      service.adjustedMaxContribution = undefined;
      await service.initialize(journey);
      expect(service.adjustedMaxContribution).toEqual(3264);
    });

    it('should call onChange', async () => {
      await service.initialize(journey);
      expect(service.onChange).toHaveBeenCalledWith(undefined, true);
    });

    it('should not call setAccountLinkFlag if goalDataPromise is set and refreshMxAccount is false', async () => {
      service['goalDataPromise'] = Promise.resolve(goalData);
      await service.initialize(journey);
      expect(service['setAccountLinkFlag']).not.toHaveBeenCalled();
    });

    it('should call setAccountLinkFlag if goalDataPromise is not set', async () => {
      service['goalDataPromise'] = undefined;
      await service.initialize(journey);
      expect(service['setAccountLinkFlag']).toHaveBeenCalled();
    });

    it('should call setAccountLinkFlag if goalDataPromise is set and refreshMxAccount is true', async () => {
      service['goalDataPromise'] = Promise.resolve(goalData);
      journeyServiceSpy.getRefreshMxAccount.and.returnValue('true');
      await service.initialize(journey);
      expect(service['setAccountLinkFlag']).toHaveBeenCalled();
    });
  });

  describe('stepChange', () => {
    let journey: Journey;
    beforeEach(() => {
      service['goalData'] = goalData;
      spyOn(service, 'calculateRecommendations');
      service['setAnswers'] = jasmine.createSpy();
      journey = {
        journeyID: 7,
        journeyName: 'JourneyName',
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
      spyOn(service, 'onChange');
    });

    it('should update the answers and recalculate', () => {
      const answerList = ['answer1', 'answer2', undefined];
      journeyServiceSpy.getAnswerList.and.returnValue(answerList);
      service.stepChange(journey);
      expect(journeyServiceSpy.getAnswerList).toHaveBeenCalledWith(journey);
      expect(service['setAnswers']).toHaveBeenCalledWith(answerList);
      expect(service.calculateRecommendations).toHaveBeenCalled();
    });

    it('should call onChange', () => {
      service.stepChange(journey);
      expect(service.onChange).toHaveBeenCalledWith(undefined, true);
    });
  });

  describe('calculateRecommendations', () => {
    beforeEach(() => {
      service['goalData'] = goalData;
      spyOn(service.valueChange, 'next');
    });

    it('should calculate the recommendations with individual, under catch up limit if hsa type is individual and user is under catch up age', () => {
      service['isIndividual'] = true;
      service['overCatchupAge'] = false;
      service.maxContribution = undefined;
      service.calculateRecommendations();
      expect(service.maxContribution).toEqual(goalData.singleMaxAmt);
      expect(service.valueChange.next).toHaveBeenCalled();
    });

    it('should calculate the recommendations with family, under catch up limit if hsa type is not individual and user is under catch up age', () => {
      service['isIndividual'] = false;
      service['overCatchupAge'] = false;
      service.maxContribution = undefined;
      service.calculateRecommendations();
      expect(service.maxContribution).toEqual(goalData.familyMaxAmt);
    });

    it('should calculate the recommendations with family, over catch up limit if hsa type is not individual and user is over catch up age', () => {
      service['isIndividual'] = false;
      service['overCatchupAge'] = true;
      service.maxContribution = undefined;
      service.calculateRecommendations();
      expect(service.maxContribution).toEqual(
        goalData.familyMaxAmt + goalData.catchUpAmt
      );
    });

    it('should calculate the contributionPerPayPeriod and yearlyTaxSavings from the max amt and the pay periods', () => {
      service['isIndividual'] = false;
      service['overCatchupAge'] = false;
      service['payPeriods'] = 52;
      service.contributionPerPayPeriod = undefined;
      service.yearlyTaxSavings = undefined;
      service.calculateRecommendations();
      expect(service.contributionPerPayPeriod).toEqual(
        goalData.familyMaxAmt / 52
      );
      expect(service.yearlyTaxSavings).toEqual(goalData.familyMaxAmt * 0.22);
    });
  });

  describe('onChange', () => {
    beforeEach(() => {
      spyOn(service.valueChange, 'next');
    });

    it('should update adjustedValues based on new goal if adjustedMaxContribution changed', () => {
      service.adjustedMaxContribution = undefined;
      service.adjustedContributionPerPayPeriod = undefined;
      service.adjustedyearlyTaxSavings = undefined;
      service['payPeriods'] = 10;
      service.onChange(500);
      expect(service.adjustedMaxContribution).toEqual(500);
      expect(service.adjustedContributionPerPayPeriod).toEqual(50);
      expect(service.adjustedyearlyTaxSavings).toEqual(0.22 * 500);
      expect(service.valueChange.next).toHaveBeenCalled();
    });

    it('should not emit valueChange if adjustedMaxContribution did not change and refresh is false', () => {
      service.adjustedMaxContribution = 500;
      service.onChange(500);
      expect(service.valueChange.next).not.toHaveBeenCalled();
    });

    it('should emit valueChange if adjustedMaxContribution did not change but refresh is true', () => {
      service.adjustedMaxContribution = 500;
      service.onChange(undefined, true);
      expect(service.valueChange.next).toHaveBeenCalled();
    });

    it('should use the maxContribution if adjustedMaxContribution is not yet set and no value is passed in', () => {
      service.adjustedMaxContribution = undefined;
      service.maxContribution = 500;
      service.onChange(undefined, true);
      expect(service.adjustedMaxContribution).toEqual(500);
    });
  });

  describe('fetchGoalJSON', () => {
    let content;
    beforeEach(() => {
      content = {HSAGoalJSON: '{"id": "123"}'};
    });

    it('should call baseService and return the parsed HSAGoalJSON', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(content));
      const result = await service.fetchGoalJSON();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(endpoints.getHSAContent);
      expect(result).toEqual(JSON.parse(content.HSAGoalJSON));
    });

    it('should not call baseService if the promise is already set', async () => {
      service['hsaContentPromise'] = Promise.resolve(content);
      const result = await service.fetchGoalJSON();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(JSON.parse(content.HSAGoalJSON));
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      spyOn(service['subscription'], 'unsubscribe');
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('setAccountLinkFlag', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(goalData));
      service['goalData'] = goalData;
      spyOn(service.valueChange, 'next');
    });

    it('should call the baseService to get the hsa goal data', async () => {
      await service.setAccountLinkFlag(7);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(endpoints.getGoal + '/7');
      expect(service.valueChange.next).toHaveBeenCalled();
      expect(journeyServiceSpy.setRefreshMxAccount).toHaveBeenCalledWith(
        'false'
      );
    });

    it('should set the properties from the response', async () => {
      service.onFile = undefined;
      service.notOnFile = undefined;
      service.accountLinked = undefined;
      service.accountNotLinked = undefined;
      service.logoUrl = null;
      service.accountName = null;
      service.currentBalance = undefined;
      service.ytdContribution = undefined;
      goalData.accountLinked = true;
      await service.setAccountLinkFlag(7);
      expect(service.onFile).toEqual(goalData.onFile);
      expect(service.notOnFile).toEqual(goalData.notOnFile);
      expect(service.accountLinked).toEqual(goalData.accountLinked);
      expect(service.accountNotLinked).toEqual(goalData.accountNotLinked);
      expect(service.logoUrl).toEqual(goalData.logoUrl);
      expect(service.accountName).toEqual(goalData.accountName);
      expect(service.currentBalance).toEqual(goalData.currentBalance);
      expect(service.ytdContribution).toEqual(goalData.ytdContribution);
    });

    it('should not set the current balance if the account is not linked', async () => {
      goalData.accountLinked = false;
      service.currentBalance = undefined;
      await service.setAccountLinkFlag(7);
      expect(service.currentBalance).toEqual(undefined);
    });
  });
});
