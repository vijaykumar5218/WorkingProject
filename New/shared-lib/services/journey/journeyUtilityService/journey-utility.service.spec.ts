import {CurrencyPipe} from '@angular/common';
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {Status} from '../../../constants/status.enum';
import {JourneyService} from '../journey.service';
import {JourneyUtilityService} from './journey-utility.service';

describe('JourneyUtilityService', () => {
  let service: JourneyUtilityService;
  let journeyServiceSpy;
  let currencyPipeSpy;
  let elements;
  let accounts;
  let routerSpy;

  beforeEach(() => {
    accounts = [
      {
        account_subtype_name: '529',
        account_number: 'XXXXX9200',
        account_type_name: 'Investment',
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
        account_number: 'XXXXX9200',
        account_type_name: 'Any',
        available_balance: '1000.0',
        balance: '1000.0',
        currency_code: 'USD',
        guid: 'ACT-8fa39e08-8981-4c4f-8910-177e5357932',
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
    ];
    journeyServiceSpy = jasmine.createSpyObj(
      'JourneyService',
      ['getJourneyStatus'],
      {
        journeyServiceMap: {
          1: {
            valueChange: of(),
          },
        },
      }
    );
    currencyPipeSpy = jasmine.createSpyObj('CurrencyPipe', ['transform']);
    elements = [
      {
        id: 'intro',
        description: 'Nice! you may exceed your college saving goal by $2!',
        type: 'note',
        marginTop: '0px',
        marginBottom: '13px',
        isRequired: false,
      },
    ];
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: JourneyService, useValue: journeyServiceSpy},
        {provide: CurrencyPipe, useValue: currencyPipeSpy},
        {provide: Router, useValue: routerSpy},
      ],
    });
    service = TestBed.inject(JourneyUtilityService);
  });

  describe('processInnerHTMLData', () => {
    it('should replace the placeholders with the answers from the service', () => {
      journeyServiceSpy.journeyServiceMap[1] = {
        answerId1: 'answer1',
        answerId2: 'answer2',
        answerId3: 'answer3',
        answerId4: 'answer4',
      };
      const label = 'label {2} with dynamic {0} values {1} {3}';
      const elements = [
        {answerId: 'answerId1', bold: true},
        {answerId: 'answerId2', type: 'dollar', bold: true},
        {answerId: 'answerId3', type: 'dollar'},
        {answerId: 'answerId4', textColor: 'red'},
      ];

      currencyPipeSpy.transform.and.callFake(str => '$' + str);
      const result = service.processInnerHTMLData(label, elements, 1);
      expect(result).toEqual(
        'label $answer3 with dynamic <strong>answer1</strong> values <strong>$answer2</strong> <span style="color:red">answer4</span>'
      );
    });
    it('should not replace the placeholders with the answers from the service', () => {
      journeyServiceSpy.journeyServiceMap[1] = {
        answerId3: 'answer3',
        answerId4: 'answer4',
      };
      const label = 'label {2} with dynamic {0} values {1} {3}';
      const elements = [
        {answerId: 'answerId1', bold: true},
        {answerId: 'answerId2', type: 'dollar', bold: true},
      ];
      const result = service.processInnerHTMLData(label, elements, 1);
      expect(result).toEqual('label {2} with dynamic {0} values {1} {3}');
    });
  });
  describe('updateRadioStateValue', () => {
    it('should return string when answer have some value', () => {
      const element = {
        id: 'intro',
        description: 'Nice! you may exceed your college saving goal by $2!',
        type: 'note',
        marginTop: '0px',
        marginBottom: '13px',
        isRequired: false,
      };
      expect(
        service.updateRadioStateValue({abc: '123'}, true, element, true, [
          element,
        ])
      ).toBe(JSON.stringify({abc: '123'}));
    });
    it('should return empty string when answer is empty', () => {
      const element = {
        id: 'intro',
        description: 'Nice! you may exceed your college saving goal by $2!',
        type: 'note',
        marginTop: '0px',
        marginBottom: '13px',
        isRequired: false,
      };
      expect(
        service.updateRadioStateValue({}, true, element, true, [element])
      ).toBe('');
    });
    it('should return undefined when answer is empty', () => {
      const element = {
        id: 'intro',
        description: 'Nice! you may exceed your college saving goal by $2!',
        type: 'note',
        marginTop: '0px',
        marginBottom: '13px',
        isRequired: false,
      };
      expect(
        service.updateRadioStateValue({}, false, element, false, [element])
      ).toBe(undefined);
    });
  });
  describe('radioButtonClicked', () => {
    it('should set service elements with element argument elements', () => {
      const options = [
        {
          label: '$539 (100% Montly Contribution)',
          id: '0',
          elements: elements,
          idSuffix: '1234',
        },
        {
          id: '1',
          idSuffix: '1235',
        },
      ];
      const element = {
        answerId: 'answerId',
        options: options,
        idSuffix: '1234',
      };
      const newObject = service.radioButtonClick(
        element,
        false,
        options[0],
        element.idSuffix
      );
      expect(newObject.elements).toEqual(elements);
      expect(newObject.isRequiredValid).toBeFalse();
      expect(newObject.value).toEqual('0');
    });
    it('should set service elements empty array when toggle functionality is on and checked is true', () => {
      const options = [
        {
          label: '$539 (100% Montly Contribution)',
          id: '0',
          elements: elements,
          idSuffix: '1234',
        },
        {
          id: '1',
          idSuffix: '1235',
          checked: true,
        },
      ];
      const element = {
        answerId: 'answerId',
        options: options,
        idSuffix: '1234',
      };
      const newObject = service.radioButtonClick(
        element,
        true,
        options[1],
        element.idSuffix
      );
      expect(newObject.elements).toEqual([]);
    });
    it('should set service elements empty array when toggle functionality is on and checked is true', () => {
      const options = [
        {
          label: '$539 (100% Montly Contribution)',
          id: '0',
          elements: [
            {
              id: 'intro',
              description:
                'Nice! you may exceed your college saving goal by $2!',
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
              isRequired: false,
            },
            {
              id: 'intro',
              description:
                'Nice! you may exceed your college saving goal by $2!',
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
              isRequired: true,
            },
          ],
          idSuffix: '1234',
        },
        {
          id: '1',
          idSuffix: '1235',
          checked: true,
        },
      ];
      const element = {
        answerId: 'answerId',
        options: options,
        idSuffix: '1234',
      };
      const newObject = service.radioButtonClick(
        element,
        false,
        options[0],
        element.idSuffix
      );
      expect(newObject.isRequiredValid).toBeTrue();
    });
  });

  describe('addAccountIconName', () => {
    it('should set isRadioON', () => {
      const result = service.addAccountIconName(
        accounts,
        'ACT-8fa39e08-8981-4c4f-8910-177e5357932'
      );
      expect(accounts[0].radioButtonIconName).toEqual('radio-button-off');
      expect(accounts[1].radioButtonIconName).toEqual('radio-button-on');
      expect(result).toEqual(accounts[1]);
    });

    it('should return undefined if there are no accounts', () => {
      const result = service.addAccountIconName(
        undefined,
        'ACT-8fa39e08-8981-4c4f-8910-177e5357932'
      );
      expect(result).toBeUndefined();
    });
  });

  describe('routeToFirstJourney', () => {
    let journeyData;
    beforeEach(() => {
      journeyData = {
        all: [
          {
            journeyID: 1,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg"},"overview":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg","summarySteps":[]}}',
            resourcesContent: '',
            steps: [],
          },
          {
            journeyID: 2,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2"},"overview":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2","summarySteps":[{"journeyStepName":\'1\',"header":"You want to retire at:","elements":[{"id":"imageWithValue","answerId":"retirementAge"}]},{"journeyStepName":\'5\',"header":"Your Retirement Progress","elements":[{"id":"orangeMoney"}]},{"journeyStepName":\'2\',"header":"Here\'s what\'s most important to you:","elements":[{"id":"wordGroupSummary","answerId":"wordGroup"},{"id":"wordGroupOtherSummary","answerId":"otherInput"}]}]}}',
            resourcesContent: '',
            steps: [],
          },
        ],
        recommended: [
          {
            journeyID: 3,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3"},"overview":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3","summarySteps":[]}}',
            resourcesContent:
              '{"resources":[{"type":"webview","header":"Articles","links":[{"text":"Setting retirement goals that will help you in your golden years","link":"https://www.voya.com/article/setting-retirement-goals-will-help-you-your-golden-years"}]},{"type":"video","header":"Videos","links":[{"text":"Learn how asset classes work in investing","playerId":"kaltura_player_1644869692","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869692&entry_id=1_9sd775pl"},{"text":"Retirement income planning","playerId":"kaltura_player_1644869723","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869723&entry_id=1_4pj5swer"}]}]}',
            steps: [],
          },
        ],
      };
      service['journeyTypeRouterNavigation'] = jasmine.createSpy();
    });

    it('should not call journeyTypeRouterNavigation if response is undefined', () => {
      service.routeToFirstJourney(undefined);
      expect(service['journeyTypeRouterNavigation']).not.toHaveBeenCalled();
    });

    it('should not call journeyTypeRouterNavigation if there are no recommended or all journeys', () => {
      journeyData.recommended = [];
      journeyData.all = [];
      service.routeToFirstJourney(journeyData);
      expect(service['journeyTypeRouterNavigation']).not.toHaveBeenCalled();
    });

    it('should call journeyTypeRouterNavigation for recommended if there are recommended journeys', () => {
      service.routeToFirstJourney(journeyData);
      expect(service['journeyTypeRouterNavigation']).toHaveBeenCalledWith(
        journeyData,
        'recommended'
      );
    });

    it('should call journeyTypeRouterNavigation for all if there are no recommended journeys', () => {
      journeyData.recommended = [];
      service.routeToFirstJourney(journeyData);
      expect(service['journeyTypeRouterNavigation']).toHaveBeenCalledWith(
        journeyData,
        'all'
      );
    });
  });

  describe('journeyTypeRouterNavigation', () => {
    let journeyData;
    beforeEach(() => {
      journeyData = {
        all: [
          {
            journeyID: 1,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg"},"overview":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg","summarySteps":[]}}',
            resourcesContent: '',
            steps: [],
          },
          {
            journeyID: 2,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2"},"overview":{"header":"Preparing for retirement2","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.2","imgUrl":"assets/icon/journeys/In_Company.svg2","summarySteps":[{"journeyStepName":\'1\',"header":"You want to retire at:","elements":[{"id":"imageWithValue","answerId":"retirementAge"}]},{"journeyStepName":\'5\',"header":"Your Retirement Progress","elements":[{"id":"orangeMoney"}]},{"journeyStepName":\'2\',"header":"Here\'s what\'s most important to you:","elements":[{"id":"wordGroupSummary","answerId":"wordGroup"},{"id":"wordGroupOtherSummary","answerId":"otherInput"}]}]}}',
            resourcesContent: '',
            steps: [],
          },
        ],
        recommended: [
          {
            journeyID: 3,
            landingAndOverviewContent:
              '{"intro":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3"},"overview":{"header":"Preparing for retirement3","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.3","imgUrl":"assets/icon/journeys/In_Company.svg3","summarySteps":[]}}',
            resourcesContent:
              '{"resources":[{"type":"webview","header":"Articles","links":[{"text":"Setting retirement goals that will help you in your golden years","link":"https://www.voya.com/article/setting-retirement-goals-will-help-you-your-golden-years"}]},{"type":"video","header":"Videos","links":[{"text":"Learn how asset classes work in investing","playerId":"kaltura_player_1644869692","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869692&entry_id=1_9sd775pl"},{"text":"Retirement income planning","playerId":"kaltura_player_1644869723","videoUrl":"https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=kaltura_player_1644869723&entry_id=1_4pj5swer"}]}]}',
            steps: [],
          },
        ],
      };
    });

    it('When journeyStatus would be inProgress', () => {
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.inProgress);
      service['journeyTypeRouterNavigation'](journeyData, 'all');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/journeys/journey/' + journeyData['all'][0].journeyID + '/steps'],
        {
          queryParams: {journeyType: 'all'},
        }
      );
    });

    it('When journeyStatus would not be inProgress', () => {
      journeyServiceSpy.getJourneyStatus.and.returnValue(Status.completed);
      service['journeyTypeRouterNavigation'](journeyData, 'all');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/journeys/journey/' + journeyData['all'][0].journeyID + '/overview'],
        {
          queryParams: {journeyType: 'all', fromJourneys: true},
        }
      );
    });
  });
});
