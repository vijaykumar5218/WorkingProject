import {TestBed} from '@angular/core/testing';
import {Observable, of, ReplaySubject, Subscription} from 'rxjs';
import {endPoints} from './constants/endpoints';
import {WidgetType} from './models/widget-type.enum';
import {MXService} from './mx.service';
import {
  MXRootMemberObject,
  MXRootObject,
  RootObjectMXJSON,
} from './models/mx.model';
import {Platform} from '@ionic/angular';
import {InAppBroserService} from '../../../mobile/src/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {SharedUtilityService} from '../utility/utility.service';
import {BaseService} from '../base/base-factory-provider';
import {AccessService} from '../access/access.service';
import {VoyaGlobalCacheService} from '../../../web/src/app/modules/shared/services/voya-global-cache/voya-global-cache.service';

class MockMoneyDesktopWidgetLoader {
  load(url) {
    console.log('Load Method: ', url);
  }
}

describe('MXService', () => {
  let service: MXService;
  let utilityServiceSpy;
  let baseServiceSpy;
  let platformSpy;
  let MXData: RootObjectMXJSON;
  let mxRootObject: MXRootObject;
  let mxAccount;
  let inAppSpy;
  let accessServiceSpy;
  let mxErrorHiddenSubjectSpy;
  let voyaCacheService;
  let mockPref;

  beforeEach(async () => {
    mockPref = {
      dataStatus: 'OK',
      translationEnabled: true,
      modalAlertsEnabled: false,
      contentCaptureEnabled: false,
      oneLinkKeyForEnglish: '50E9-BDF3-115F-286D',
      oneLinkKeyForSpanish: 'D002-7D8C-A50B-FA2D',
      langPreference: {
        preference: 'en-US',
      },
      translationEnabledMyvoyageDsh: true,
      clientTranslationEnabled: true,
      clientId: 'INGWIN',
    };
    mxRootObject = {
      url: {
        url: '',
        type: '',
        user_id: '',
      },
    };
    mxAccount = {
      account_number: ' ',
      account_type_name: ' ',
      available_balance: ' ',
      balance: ' ',
      currency_code: ' ',
      guid: '123',
      institution_guid: ' ',
      medium_logo_url: ' ',
      name: ' ',
      routing_number: ' ',
      small_logo_url: ' ',
      updated_at: ' ',
      user_guid: ' ',
    };
    MXData = {
      MXJSON: JSON.stringify({
        MX: [
          {
            spending_budget_title: 'Spending & Budget',
            spending_budget_description: [
              {
                top_text: '',
                image_url:
                  'https://cdn2.webdamdb.com/220th_sm_wY2B7ECU3h41.jpg?1607047662',
                bottom_text:
                  'Let’s look at your current spending and this months budget.',
              },
            ],
          },
        ],
      }),
    };

    utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
      'appendBaseUrlToEndpoints',
      'getIsWeb',
    ]);
    baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    inAppSpy = jasmine.createSpyObj('InAppBrowserService', [
      'openSystemBrowser',
    ]);
    accessServiceSpy = jasmine.createSpyObj('AccessService', [
      'checkMyvoyageAccess',
      'checkIsAltAccessUser',
    ]);
    mxErrorHiddenSubjectSpy = jasmine.createSpyObj('MXErrorHiddenSubject', [
      'next',
      'asObservable',
    ]);
    voyaCacheService = jasmine.createSpyObj('voyaCacheService', [
      'getTranslationPreference',
    ]);
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MXService,
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: Platform, useValue: platformSpy},
        {provide: InAppBroserService, useValue: inAppSpy},
        {provide: AccessService, useValue: accessServiceSpy},
        {provide: VoyaGlobalCacheService, useValue: voyaCacheService},
      ],
    });
    service = TestBed.inject(MXService);
    service['mxErrorHiddenSubject'] = mxErrorHiddenSubjectSpy;
    voyaCacheService.getTranslationPreference.and.returnValue(of(mockPref));
    service.endpoints = endPoints;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setMxErrorHidden', () => {
    it('should call mxErrorHiddenSubject next', () => {
      service.setMxErrorHidden(true);
      expect(mxErrorHiddenSubjectSpy.next).toHaveBeenCalledWith(true);
    });
  });

  describe('isMxErrorHidden', () => {
    it('should return mxErrorHiddenSubject', () => {
      const ob = new Observable<boolean>();
      mxErrorHiddenSubjectSpy.asObservable.and.returnValue(ob);
      const res = service.isMxErrorHidden();
      expect(mxErrorHiddenSubjectSpy.asObservable).toHaveBeenCalled();
      expect(res).toEqual(ob);
    });
  });
  describe('setUserAccountUpdate', () => {
    it('should set setUserAccountUpdate to true', () => {
      service['userUpdated'] = undefined;
      service.setUserAccountUpdate(true);
      expect(service['userUpdated']).toEqual(true);
    });
    it('should set setUserAccountUpdate to false', () => {
      service['userUpdated'] = undefined;
      service.setUserAccountUpdate(false);
      expect(service['userUpdated']).toEqual(false);
    });
  });

  describe('getUserAccountUpdate', () => {
    it('should return getUserAccountUpdate true', () => {
      service['userUpdated'] = true;
      const result = service.getUserAccountUpdate();
      expect(result).toEqual(true);
    });
    it('should return getUserAccountUpdate false', () => {
      service['userUpdated'] = false;
      const result = service.getUserAccountUpdate();
      expect(result).toEqual(false);
    });
  });
  describe('hasAccounts', () => {
    let mxMemberData: MXRootMemberObject;

    beforeEach(() => {
      mxMemberData = {
        members: [
          {
            guid: ' ',
            aggregated_at: new Date(),
            name: '',
            connection_status: '',
            is_user_created: '',
            user_guid: '',
            connection_status_message: '',
          },
        ],
      };
    });

    it('should call getMxMemberConnect and return true if has accounts', done => {
      mxMemberData.members[0].connection_status = 'CONNECTED';

      spyOn(service, 'getMxMemberConnect').and.returnValue(of(mxMemberData));
      service['hasMXAccountsSubscription'] = false;

      service.hasAccounts().subscribe(hasAccounts => {
        expect(service.getMxMemberConnect).toHaveBeenCalled();
        expect(hasAccounts).toBeTrue();
        done();
      });
    });

    it('should call getMxMemberConnect and return false if has no accounts', done => {
      spyOn(service, 'getMxMemberConnect').and.returnValue(of(mxMemberData));
      service['hasMXAccountsSubscription'] = false;

      service.hasAccounts().subscribe(hasAccounts => {
        expect(service.getMxMemberConnect).toHaveBeenCalled();
        expect(hasAccounts).toBeFalse();
        done();
      });
    });

    it('should call getMxMemberConnect and return false if no data', done => {
      service['hasMXAccountsSubscription'] = false;
      spyOn(service, 'getMxMemberConnect').and.returnValue(of(null));

      service.hasAccounts().subscribe(hasAccounts => {
        expect(service.getMxMemberConnect).toHaveBeenCalled();
        expect(hasAccounts).toBeFalse();
        done();
      });
    });

    it('should return the current replaySubject if its not null', () => {
      const subj = new ReplaySubject<boolean>();
      service['hasMXAccountsSubject'] = subj;
      service[
        'hasMXAccountsSubscription'
      ] = jasmine.createSpyObj('Subscription', ['unsubscribe']);

      spyOn(service, 'getMxMemberConnect');

      const resultSubj = service.hasAccounts();

      expect(resultSubj).toEqual(subj);
      expect(service.getMxMemberConnect).not.toHaveBeenCalled();
    });
  });

  describe('hasUsers', () => {
    let mxMemberData: MXRootMemberObject;

    beforeEach(() => {
      mxMemberData = {
        members: [
          {
            guid: ' ',
            aggregated_at: new Date(),
            name: '',
            connection_status: '',
            is_user_created: '',
            user_guid: '',
            connection_status_message: '',
          },
        ],
      };
    });

    it('should call getMxMemberConnect and return true if has accounts', done => {
      mxMemberData.members[0].is_user_created = 'true';

      spyOn(service, 'getMxMemberConnect').and.returnValue(of(mxMemberData));
      service['hasMXUserSubscription'] = false;

      service.hasUser().subscribe(hasUser => {
        expect(service.getMxMemberConnect).toHaveBeenCalled();
        expect(hasUser).toBeTrue();
        done();
      });
    });

    it('should call getMxMemberConnect and return false if has no accounts', done => {
      service['hasMXUserSubscription'] = false;
      mxMemberData.members[0].is_user_created = 'false';

      spyOn(service, 'getMxMemberConnect').and.returnValue(of(mxMemberData));

      service.hasUser().subscribe(hasUser => {
        expect(service.getMxMemberConnect).toHaveBeenCalled();
        expect(hasUser).toBeFalse();
        done();
      });
    });

    it('should call getMxMemberConnect and return false if no data', done => {
      service['hasMXUserSubscription'] = false;
      spyOn(service, 'getMxMemberConnect').and.returnValue(of(null));

      service.hasUser().subscribe(hasUser => {
        expect(service.getMxMemberConnect).toHaveBeenCalled();
        expect(hasUser).toBeFalse();
        done();
      });
    });

    it('should return the current replaySubject if its not null', () => {
      const subj = new ReplaySubject<boolean>();
      service['hasMXUserSubject'] = subj;
      service['hasMXUserSubscription'] = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);

      spyOn(service, 'getMxMemberConnect');

      const resultSubj = service.hasUser();
      expect(resultSubj).toEqual(subj);
      expect(service.getMxMemberConnect).not.toHaveBeenCalled();
    });
  });

  describe('getMxMemberConnect', () => {
    let emptyMemberData;

    beforeEach(() => {
      emptyMemberData = {
        members: {
          guid: '',
          aggregated_at: new Date(),
          name: '',
          connection_status: '',
          is_user_created: '',
          user_guid: '',
          connection_status_message: '',
        },
      };
    });

    it('should load mx member data', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyMemberData));

      service.getMxMemberConnect().subscribe(data => {
        expect(data).toEqual(emptyMemberData);

        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          endPoints.memberConnect
        );
      });

      service.getMxMemberConnect().subscribe(data => {
        expect(data).toEqual(emptyMemberData);

        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          endPoints.memberConnect
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      });
    });

    it('should load mx member data and force refresh it', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyMemberData));

      service.getMxMemberConnect().subscribe(data => {
        expect(data).toEqual(emptyMemberData);

        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          endPoints.memberConnect
        );
      });

      service.getMxMemberConnect(true).subscribe(data => {
        expect(data).toEqual(emptyMemberData);

        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          endPoints.memberConnect
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('getMxAccountConnect', () => {
    let mxWidgetsdata;

    beforeEach(() => {
      mxWidgetsdata = {
        MXAccount: [
          {
            account_number: '',
            account_type_name: '',
            available_balance: '',
            balance: '',
            currency_code: '',
            guid: '',
            institution_guid: '',
            medium_logo_url: '',
            name: '',
            routing_number: '',
            small_logo_url: '',
            updated_at: '',
            user_guid: '',
          },
        ],
      };
    });

    it('should load mx account member data', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(mxWidgetsdata));

      service.getMxAccountConnect().subscribe(data => {
        expect(data).toEqual(mxWidgetsdata);

        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          endPoints.accountConnect
        );
      });

      service.getMxAccountConnect().subscribe(data => {
        expect(data).toEqual(mxWidgetsdata);

        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          endPoints.accountConnect
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      });
    });

    it('should load mx  account member data and force refresh it', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(mxWidgetsdata));

      service.getMxAccountConnect().subscribe(data => {
        expect(data).toEqual(mxWidgetsdata);

        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          endPoints.accountConnect
        );
      });

      service.getMxAccountConnect(true).subscribe(data => {
        expect(data).toEqual(mxWidgetsdata);

        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          endPoints.accountConnect
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('getHeaderData', () => {
    it('should load mx header member data', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(MXData));
      service.getHeaderData().subscribe(data => {
        expect(data).toEqual({
          MX: [
            {
              spending_budget_title: 'Spending & Budget',
              spending_budget_description: [
                {
                  top_text: '',
                  image_url:
                    'https://cdn2.webdamdb.com/220th_sm_wY2B7ECU3h41.jpg?1607047662',
                  bottom_text:
                    'Let’s look at your current spending and this months budget.',
                },
              ],
            },
          ],
        });
        expect(baseServiceSpy.get).toHaveBeenCalledWith(endPoints.getHeader);
      });

      service.getHeaderData().subscribe(data => {
        expect(data).toEqual({
          MX: [
            {
              spending_budget_title: 'Spending & Budget',
              spending_budget_description: [
                {
                  top_text: '',
                  image_url:
                    'https://cdn2.webdamdb.com/220th_sm_wY2B7ECU3h41.jpg?1607047662',
                  bottom_text:
                    'Let’s look at your current spending and this months budget.',
                },
              ],
            },
          ],
        });

        expect(baseServiceSpy.get).toHaveBeenCalledWith(endPoints.getHeader);
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      });
    });

    it('should load mx  header data and force refresh it', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(MXData));

      service.getHeaderData().subscribe(data => {
        expect(data).toEqual({
          MX: [
            {
              spending_budget_title: 'Spending & Budget',
              spending_budget_description: [
                {
                  top_text: '',
                  image_url:
                    'https://cdn2.webdamdb.com/220th_sm_wY2B7ECU3h41.jpg?1607047662',
                  bottom_text:
                    'Let’s look at your current spending and this months budget.',
                },
              ],
            },
          ],
        });

        expect(baseServiceSpy.get).toHaveBeenCalledWith(endPoints.getHeader);
      });

      service.getHeaderData(true).subscribe(data => {
        expect(data).toEqual({
          MX: [
            {
              spending_budget_title: 'Spending & Budget',
              spending_budget_description: [
                {
                  top_text: '',
                  image_url:
                    'https://cdn2.webdamdb.com/220th_sm_wY2B7ECU3h41.jpg?1607047662',
                  bottom_text:
                    'Let’s look at your current spending and this months budget.',
                },
              ],
            },
          ],
        });

        expect(baseServiceSpy.get).toHaveBeenCalledWith(endPoints.getHeader);
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('getMxWidgetUrl', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(of(mxRootObject));
    });
    it('should call base service get with widget url endpoint and ios', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      platformSpy.is.and.returnValue(true);
      service['getMxWidgetUrl'](WidgetType.CONNECT);
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.widgetConnect + WidgetType.CONNECT + '/ios'
      );
    });

    it('should call base service get with widget url endpoint and android', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      platformSpy.is.and.returnValue(false);
      service['getMxWidgetUrl'](WidgetType.CONNECT);
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.widgetConnect + WidgetType.CONNECT + '/android'
      );
    });

    it('should call base service get with widget url endpoint and web', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      service['getMxWidgetUrl'](WidgetType.CONNECT);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.widgetConnect + WidgetType.CONNECT + '/web'
      );
    });
  });

  describe('getMXData', () => {
    it('return getMXData', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(mxAccount)
      );
      const result = service.getMxData();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        'currentAccountMX'
      );
      expect(result).toEqual(mxAccount);
    });
  });

  describe('setAccountLocalStorage', () => {
    it('should call setAccountLocalStorage', async () => {
      spyOn(service, 'setMxData');
      service.previousMxDataInLocalStorage = undefined;
      const mxWidgetsdata = {
        MXAccount: [
          {
            account_number: '4684406678',
            account_type_name: 'Checking',
            available_balance: '1000.0',
            balance: '1000.0',
            currency_code: 'USD',
            guid: 'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9',
            name: 'MX Bank Checking',
            routing_number: '731775673',
            updated_at: '2022-05-31T12:54:19+00:00',
            user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
            institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
            small_logo_url:
              'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
            medium_logo_url:
              'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
            institution_name: 'MX Bank (Oauth) 4',
          },
        ],
      };
      service.setMxDataLocalStorage(mxWidgetsdata.MXAccount[0]);
      expect(service.previousMxDataInLocalStorage).toEqual(
        mxWidgetsdata.MXAccount[0]
      );
    });

    it('should not call setMxData when data in cache', async () => {
      spyOn(service, 'setMxData');
      const mxWidgetsdata = {
        MXAccount: [
          {
            account_number: '4684406678',
            account_type_name: 'Checking',
            available_balance: '1000.0',
            balance: '1000.0',
            currency_code: 'USD',
            guid: 'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9',
            name: 'MX Bank Checking',
            routing_number: '731775673',
            updated_at: '2022-05-31T12:54:19+00:00',
            user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
            institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
            small_logo_url:
              'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
            medium_logo_url:
              'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
            institution_name: 'MX Bank (Oauth) 4',
          },
        ],
      };
      service.previousMxDataInLocalStorage = mxWidgetsdata.MXAccount[0];
      service.setMxDataLocalStorage(mxWidgetsdata.MXAccount[0]);
      expect(service.setMxData).not.toHaveBeenCalledWith(
        mxWidgetsdata.MXAccount[0]
      );
    });
  });

  describe('setMXData', () => {
    it('should set the currentAccountMX in localStorage', () => {
      spyOn(Storage.prototype, 'setItem');
      service.setMxData(mxAccount);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'currentAccountMX',
        JSON.stringify(mxAccount)
      );
    });
  });

  describe('getMxSubAccountWidgetUrl', () => {
    it('should call base service get with widget url endpoint', async () => {
      spyOn(service, 'getMxData').and.returnValue(mxAccount);
      baseServiceSpy.get.and.returnValue(of(mxRootObject));
      const result = await service.getMxSubAccountWidgetUrl(
        WidgetType.TRANSACTIONS
      );
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.widgetConnect +
          WidgetType.TRANSACTIONS +
          '/acct/' +
          mxAccount.guid
      );
      result.subscribe(data => {
        expect(data).toEqual(mxRootObject);
      });
    });
  });

  describe('awaitIsBusy', () => {
    it('should wait for displayWidgetBusy and resolve', async () => {
      service['displayWidgetBusy'] = true;
      setTimeout(() => {
        service['displayWidgetBusy'] = false;
      }, 1000);

      const time = new Date().getTime();

      await service.awaitIsBusy();

      const timeAfter = new Date().getTime();
      const diff = timeAfter - time;

      expect(diff).toBeGreaterThan(500);
    });
  });

  describe('displayWidget', () => {
    beforeEach(() => {
      window['MoneyDesktopWidgetLoader'] = MockMoneyDesktopWidgetLoader;
      spyOn(MockMoneyDesktopWidgetLoader.prototype, 'load');
    });

    it('should call awaitIsBusy if displayWidgetBusy', async () => {
      service['displayWidgetBusy'] = true;
      spyOn(service, 'awaitIsBusy').and.returnValue(Promise.resolve());
      spyOn(service, 'getMxSubAccountWidgetUrl');
      spyOn<any>(service, 'getMxWidgetUrl').and.returnValue(
        of({
          url: {
            url: 'https://test.widget.com',
            type: 'test_widget',
            user_id: 'user',
          },
        })
      );

      await service.displayWidget(WidgetType.FINSTRONG, {
        id: 'test',
      });
      expect(service.awaitIsBusy).toHaveBeenCalled();
      expect(service['displayWidgetBusy']).toBeFalse();
    });

    it('should get widget url from server and then display in window and return true', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      spyOn(service, 'getMxSubAccountWidgetUrl');
      spyOn<any>(service, 'getMxWidgetUrl').and.returnValue(
        of({
          url: {
            url: 'https://test.widget.com',
            type: 'test_widget',
            user_id: 'user',
          },
        })
      );
      const result = await service.displayWidget(WidgetType.FINSTRONG, {
        id: 'test',
      });
      expect(service['getMxWidgetUrl']).toHaveBeenCalledWith(
        WidgetType.FINSTRONG
      );
      expect(service.getMxSubAccountWidgetUrl).not.toHaveBeenCalledWith(
        WidgetType.FINSTRONG
      );
      expect(MockMoneyDesktopWidgetLoader.prototype.load).toHaveBeenCalledWith(
        'https://test.widget.com'
      );
      expect(result).toBeTrue();
      expect(service['displayWidgetBusy']).toBeFalse();
      expect(service['langCode']).toEqual('/en-US');
    });
    it('should have lang code empty if it is mobile', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      spyOn(service, 'getMxSubAccountWidgetUrl');
      spyOn<any>(service, 'getMxWidgetUrl').and.returnValue(
        of({
          url: {
            url: 'https://test.widget.com',
            type: 'test_widget',
            user_id: 'user',
          },
        })
      );
      await service.displayWidget(WidgetType.FINSTRONG, {
        id: 'test',
      });
      expect(service['langCode']).toEqual('');
      expect(voyaCacheService.getTranslationPreference).not.toHaveBeenCalled();
    });
    it('should set langcode to empty string if translation is not enabled', async () => {
      spyOn(service, 'getMxSubAccountWidgetUrl');
      spyOn<any>(service, 'getMxWidgetUrl').and.returnValue(
        of({
          url: {
            url: 'https://test.widget.com',
            type: 'test_widget',
            user_id: 'user',
          },
        })
      );
      mockPref.translationEnabled = false;
      voyaCacheService.getTranslationPreference.and.returnValue(of(mockPref));

      await service.displayWidget(WidgetType.FINSTRONG, {
        id: 'test',
      });
      expect(service['langCode']).toEqual('');
    });

    it('should get widget url from server and then not display in window and return false if null url', async () => {
      spyOn<any>(service, 'getMxWidgetUrl').and.returnValue(of(null));

      const result = await service.displayWidget(WidgetType.FINSTRONG, {
        id: 'test',
      });
      expect(
        MockMoneyDesktopWidgetLoader.prototype.load
      ).not.toHaveBeenCalledWith('https://test.widget.com');
      expect(result).toBeFalse();
      expect(service['displayWidgetBusy']).toBeFalse();
    });

    it('should get sub account widget url from server and then display in window and return true', async () => {
      spyOn<any>(service, 'getMxWidgetUrl');
      spyOn(service, 'getMxSubAccountWidgetUrl').and.returnValue(
        of({
          url: {
            url: 'https://test.widget.com',
            type: 'test_widget',
            user_id: 'user',
          },
        })
      );

      const result = await service.displayWidget(
        WidgetType.FINSTRONG,
        {id: 'test'},
        true
      );
      expect(service['getMxWidgetUrl']).not.toHaveBeenCalledWith(
        WidgetType.FINSTRONG
      );
      expect(service.getMxSubAccountWidgetUrl).toHaveBeenCalledWith(
        WidgetType.FINSTRONG
      );
      expect(MockMoneyDesktopWidgetLoader.prototype.load).toHaveBeenCalledWith(
        'https://test.widget.com'
      );
      expect(result).toBeTrue();
      expect(service['displayWidgetBusy']).toBeFalse();
    });

    it('should get sub account widget url from server and then not display in window and return false if null url', async () => {
      spyOn(service, 'getMxSubAccountWidgetUrl').and.returnValue(of(null));

      const result = await service.displayWidget(
        WidgetType.FINSTRONG,
        {id: 'test'},
        true
      );

      expect(
        MockMoneyDesktopWidgetLoader.prototype.load
      ).not.toHaveBeenCalledWith('https://test.widget.com');
      expect(result).toBeFalse();
      expect(service['displayWidgetBusy']).toBeFalse();
    });
  });

  describe('addMXWindowEventListener', () => {
    it('should add window listener', () => {
      spyOn(window, 'addEventListener');

      service.addMXWindowEventListener();

      expect(window.addEventListener).toHaveBeenCalledWith(
        'message',
        jasmine.any(Function)
      );
    });
  });

  describe('removeMXWindowEventListener', () => {
    it('should add window listener', () => {
      spyOn(window, 'removeEventListener');
      service['currentMessageListener'] = () => {
        console.log('listener');
      };

      service.removeMXWindowEventListener();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'message',
        jasmine.any(Function)
      );
    });
  });

  describe('gotConnectWidgetMessage', () => {
    beforeEach(() => {
      spyOn(service, 'getMxMemberConnect');
      spyOn(service, 'getMxAccountConnect');
      spyOn(service, 'openAuthBrowser');
      spyOn(service, 'setUserAccountUpdate');
      spyOn(service, 'getUserAccountUpdate');
    });

    it('should ignore the message if not from proper origin', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      const message = {
        data: {
          type: 'mx/connect/oauthRequested',
          metadata: {url: 'https://www.test.com'},
        },
        origin: 'https://spam.com',
      } as MessageEvent;

      service.gotConnectWidgetMessage(message);
      expect(service.openAuthBrowser).not.toHaveBeenCalled();
    });

    it('should ignore the message if not from not proper type', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      const message = {
        data: {
          type: 'mx/connect/spamOauthRequested',
          metadata: {url: 'https://www.test.com'},
        },
        origin: 'https://int-widgets.moneydesktop.com',
      } as MessageEvent;

      service.gotConnectWidgetMessage(message);
      expect(service.openAuthBrowser).not.toHaveBeenCalled();
    });

    it('should open in app browser with url from message if message is from proper origin', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      const message = {
        data: {
          type: 'mx/connect/oauthRequested',
          metadata: {url: 'https://www.test.com'},
        },
        origin: 'https://int-widgets.moneydesktop.com',
      } as MessageEvent;

      service.gotConnectWidgetMessage(message);
      expect(service.openAuthBrowser).toHaveBeenCalledWith(
        'https://www.test.com'
      );
    });

    it('should open in app browser with url from message if message is from proper origin 2', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      const message = {
        data: {
          type: 'mx/connect/oauthRequested',
          metadata: {url: 'https://www.test2.com'},
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;

      service.gotConnectWidgetMessage(message);
      expect(service.openAuthBrowser).toHaveBeenCalledWith(
        'https://www.test2.com'
      );
    });

    it('should not refresh mx data if !isWeb and got "created" message', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      const message = {
        data: {
          type: 'created',
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;
      service.gotConnectWidgetMessage(message);
      expect(service.getMxMemberConnect).not.toHaveBeenCalledWith(true);
      expect(service.getMxAccountConnect).not.toHaveBeenCalledWith(true);
      expect(service.setUserAccountUpdate).not.toHaveBeenCalledWith(true);
    });

    it('should refresh mx data if isWeb and got "created" message', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const message = {
        data: {
          type: 'created',
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;
      service.gotConnectWidgetMessage(message);
      expect(service.getMxMemberConnect).toHaveBeenCalledWith(true);
      expect(service.getMxAccountConnect).toHaveBeenCalledWith(true);
      expect(service.setUserAccountUpdate).toHaveBeenCalledWith(true);
    });

    it('should refresh mx data if isWeb and got "deleted" message', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const message = {
        data: {
          type: 'deleted',
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;
      service.gotConnectWidgetMessage(message);
      expect(service.getMxMemberConnect).toHaveBeenCalledWith(true);
      expect(service.getMxAccountConnect).toHaveBeenCalledWith(true);
      expect(service.setUserAccountUpdate).toHaveBeenCalledWith(true);
    });

    it('should refresh mx data if isWeb and got "mx/connect/memberConnected" message', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const message = {
        data: {
          type: 'mx/connect/memberConnected',
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;
      service.gotConnectWidgetMessage(message);
      expect(service.getMxMemberConnect).toHaveBeenCalledWith(true);
      expect(service.getMxAccountConnect).toHaveBeenCalledWith(true);
      expect(service.setUserAccountUpdate).toHaveBeenCalledWith(true);
    });

    it('should refresh mx data if isWeb and got "mx/connections/memberDeleted" message', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const message = {
        data: {
          type: 'mx/connections/memberDeleted',
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;
      service.gotConnectWidgetMessage(message);
      expect(service.getMxMemberConnect).toHaveBeenCalledWith(true);
      expect(service.getMxAccountConnect).toHaveBeenCalledWith(true);
      expect(service.setUserAccountUpdate).toHaveBeenCalledWith(true);
    });
    it('should refresh mx data if isWeb and got "mx/connect/backToSearch" message', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const message = {
        data: {
          type: 'mx/connect/backToSearch',
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;
      service.gotConnectWidgetMessage(message);
      expect(service.setUserAccountUpdate).toHaveBeenCalledWith(true);
    });

    it('should refresh mx data if isWeb and got "mx/focusTrap" message', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const message = {
        data: {
          type: 'mx/focusTrap',
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;
      service.gotConnectWidgetMessage(message);
      expect(service.getMxMemberConnect).toHaveBeenCalledWith(true);
      expect(service.getMxAccountConnect).toHaveBeenCalledWith(true);
      expect(service.setUserAccountUpdate).not.toHaveBeenCalledWith(true);
    });

    it('should refresh mx data if isWeb and got "mx/connect/stepChange" message', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const message = {
        data: {
          type: 'mx/connect/stepChange',
        },
        origin: 'https://widgets.moneydesktop.com',
      } as MessageEvent;
      service.gotConnectWidgetMessage(message);
      expect(service.getMxMemberConnect).toHaveBeenCalledWith(true);
      expect(service.getMxAccountConnect).toHaveBeenCalledWith(true);
      expect(service.setUserAccountUpdate).not.toHaveBeenCalledWith(true);
    });
  });

  describe('openAuthBrowser', () => {
    let url;
    beforeEach(() => {
      url = 'https://test.com';
    });

    it('should open in new tab if web', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      spyOn(window, 'open');
      service.openAuthBrowser(url);
      expect(window.open).toHaveBeenCalledWith(url, '_blank');
    });

    it('should open in new tab if web', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      service.openAuthBrowser(url);
      expect(inAppSpy.openSystemBrowser).toHaveBeenCalledWith(url);
    });
  });

  describe('getTotalNetWorth', () => {
    let netWorthData;
    beforeEach(() => {
      netWorthData = {
        total_networth: '',
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(netWorthData));
    });

    it('should call baseService to get the data if netWorthData is undefined', done => {
      service['netWorthData'] = undefined;
      service.getTotalNetworth().subscribe(data => {
        expect(data).toEqual(netWorthData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/mx/user/totalNetWorthAmount'
        );
        done();
      });
    });

    it('should call baseService to get the data if netWorthData is defined but refresh is true', done => {
      service['netWorthData'] = of(netWorthData);
      service['subscription'] = jasmine.createSpyObj('Subscription', [
        'add',
        'unsubscribe',
      ]);
      service.getTotalNetworth(true).subscribe(data => {
        expect(data).toEqual(netWorthData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/mx/user/totalNetWorthAmount'
        );
        expect(service['subscription'].add).toHaveBeenCalled();
        done();
      });
    });

    it('should not call baseService to get the data if netWorthData is defined and refresh is false', () => {
      service['netWorthData'] = of(netWorthData);
      const netWorthSubjectSpy = jasmine.createSpyObj('netWorthSubject', ['']);
      service['netWorthSubject'] = netWorthSubjectSpy;
      const result = service.getTotalNetworth(false);
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(netWorthSubjectSpy);
    });
  });

  describe('getMXAccountData', () => {
    const mxWidgetsdata = {
      accounts: [
        {
          account_number: '',
          account_type_name: '',
          available_balance: '',
          balance: '',
          currency_code: '',
          guid: '123',
          institution_guid: '',
          medium_logo_url: '',
          name: '',
          routing_number: '',
          small_logo_url: '',
          updated_at: '',
          user_guid: '',
          institution_name: '',
        },
      ],
    };
    beforeEach(() => {
      spyOn(service, 'getMxAccountConnect').and.returnValue(of(mxWidgetsdata));
    });
    it('When refresh would be false', done => {
      service.getMXAccountData('123').subscribe(data => {
        expect(data).toEqual(mxWidgetsdata.accounts[0]);
        expect(service.getMxAccountConnect).toHaveBeenCalledWith(false);
        done();
      });
    });
    it('When refresh would be true', done => {
      service.getMXAccountData('123', true).subscribe(data => {
        expect(data).toEqual(mxWidgetsdata.accounts[0]);
        expect(service.getMxAccountConnect).toHaveBeenCalledWith(true);
        done();
      });
    });
  });

  describe('getIsMxUserByMyvoyageAccess', () => {
    const mockMyvoyageAccessData: any = {
      isMxUser: true,
      enableMX: true,
    };
    beforeEach(() => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockMyvoyageAccessData)
      );
    });

    it('should call checkMyvoyageAccess if data is not already set', done => {
      service['hasMxUserByMyvoyageAccessData'] = undefined;
      service.getIsMxUserByMyvoyageAccess().subscribe(result => {
        expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalledWith(
          false
        );
        expect(result).toEqual(
          mockMyvoyageAccessData.enableMX && mockMyvoyageAccessData.isMxUser
        );
        done();
      });
    });

    it('should not call checkMyvoyageAccess get if data is already set', () => {
      service['hasMxUserByMyvoyageAccessData'] = of(mockMyvoyageAccessData);
      const hasMxUserByMyvoyageAccessSubjecttSpy = jasmine.createSpyObj(
        'hasMxUserByMyvoyageAccessSubjecttSpy',
        ['']
      );
      service[
        'hasMxUserByMyvoyageAccessSubject'
      ] = hasMxUserByMyvoyageAccessSubjecttSpy;
      const result = service.getIsMxUserByMyvoyageAccess();
      expect(accessServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
      expect(result).toEqual(hasMxUserByMyvoyageAccessSubjecttSpy);
    });
    it('should call checkMyvoyageAccess with isMxUser false and enableMX false', done => {
      mockMyvoyageAccessData.isMxUser = false;
      mockMyvoyageAccessData.enableMX = false;
      service
        .getIsMxUserByMyvoyageAccess(mockMyvoyageAccessData)
        .subscribe(result => {
          expect(result).toEqual(
            mockMyvoyageAccessData.enableMX && mockMyvoyageAccessData.isMxUser
          );
          done();
        });
    });
    it('should call checkMyvoyageAccess with isMxUser true and enableMX false', done => {
      mockMyvoyageAccessData.isMxUser = true;
      mockMyvoyageAccessData.enableMX = false;
      service
        .getIsMxUserByMyvoyageAccess(mockMyvoyageAccessData)
        .subscribe(result => {
          expect(result).toEqual(
            mockMyvoyageAccessData.enableMX && mockMyvoyageAccessData.isMxUser
          );
          done();
        });
    });
    it('should call checkMyvoyageAccess with isMxUser false and enableMX true', done => {
      mockMyvoyageAccessData.isMxUser = false;
      mockMyvoyageAccessData.enableMX = true;
      service
        .getIsMxUserByMyvoyageAccess(mockMyvoyageAccessData)
        .subscribe(result => {
          expect(result).toEqual(
            mockMyvoyageAccessData.enableMX && mockMyvoyageAccessData.isMxUser
          );
          done();
        });
    });

    describe('if refresh be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of(mockMyvoyageAccessData);
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(mockMyvoyageAccessData);
          return subscription;
        });
        service['subscription'] = jasmine.createSpyObj('subscriptionSpy', [
          'add',
          'unsubscribe',
        ]);
      });
      it('should call checkMyvoyageAccess to get the data', done => {
        service['hasMxUserByMyvoyageAccessData'] = observable;
        service.getIsMxUserByMyvoyageAccess(true).subscribe(data => {
          expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
          expect(data).toEqual(
            mockMyvoyageAccessData.enableMX && mockMyvoyageAccessData.isMxUser
          );
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('checkIsAltAccessUser', () => {
    const mockMyvoyageAccessData: any = {
      isAltAccessUser: true,
    };
    beforeEach(() => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockMyvoyageAccessData)
      );
    });

    it('should call checkMyvoyageAccess if data is not already set', done => {
      service['isAltAccessUserData'] = undefined;
      service.checkIsAltAccessUser().subscribe(result => {
        expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalledWith(
          false
        );
        expect(result).toEqual(mockMyvoyageAccessData.isAltAccessUser);
        done();
      });
    });

    it('should not call checkMyvoyageAccess get if data is already set', () => {
      service['isAltAccessUserData'] = of(mockMyvoyageAccessData);
      const isAltAccessUserSubjectSpy = jasmine.createSpyObj(
        'isAltAccessUserSubjectSpy',
        ['']
      );
      service['isAltAccessUserSubject'] = isAltAccessUserSubjectSpy;
      const result = service.checkIsAltAccessUser();
      expect(accessServiceSpy.checkIsAltAccessUser).not.toHaveBeenCalled();
      expect(result).toEqual(isAltAccessUserSubjectSpy);
    });
    it('should call checkMyvoyageAccess with isAltAccessUser false ', done => {
      mockMyvoyageAccessData.isAltAccessUser = false;
      service.checkIsAltAccessUser(mockMyvoyageAccessData).subscribe(result => {
        expect(result).toEqual(mockMyvoyageAccessData.isAltAccessUser);
        done();
      });
    });

    describe('if refresh be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of(mockMyvoyageAccessData);
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(mockMyvoyageAccessData);
          return subscription;
        });
        service['subscription'] = jasmine.createSpyObj('subscriptionSpy', [
          'add',
          'unsubscribe',
        ]);
      });
      it('should call checkMyvoyageAccess to get the data', done => {
        service['hasMxUserByMyvoyageAccessData'] = observable;
        service.checkIsAltAccessUser(true).subscribe(data => {
          expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
          expect(data).toEqual(mockMyvoyageAccessData.isAltAccessUser);
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });
  });
  describe('ngOnDestroy', () => {
    let subscriptionSpy;
    let hasMXAccountsSubscriptionSpy;
    let hasMXUserSubscriptionSpy;

    beforeEach(() => {
      subscriptionSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
      hasMXAccountsSubscriptionSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
      hasMXUserSubscriptionSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
    });

    it('should call unsubscribe', () => {
      service['subscription'] = subscriptionSpy;
      service['hasMXAccountsSubscription'] = hasMXAccountsSubscriptionSpy;
      service['hasMXUserSubscription'] = hasMXUserSubscriptionSpy;

      service.ngOnDestroy();

      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
      expect(hasMXAccountsSubscriptionSpy.unsubscribe).toHaveBeenCalled();
      expect(hasMXUserSubscriptionSpy.unsubscribe).toHaveBeenCalled();
    });

    it('should call not call unsubscribe if subs are null', () => {
      service['subscription'] = null;
      service['hasMXAccountsSubscription'] = null;
      service['hasMXUserSubscription'] = null;

      service.ngOnDestroy();

      expect(subscriptionSpy.unsubscribe).not.toHaveBeenCalled();
      expect(hasMXAccountsSubscriptionSpy.unsubscribe).not.toHaveBeenCalled();
      expect(hasMXUserSubscriptionSpy.unsubscribe).not.toHaveBeenCalled();
    });
  });
});
