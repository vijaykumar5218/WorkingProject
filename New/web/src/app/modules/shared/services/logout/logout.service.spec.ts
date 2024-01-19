import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {WebLogoutService} from './logout.service';
import {ModalController} from '@ionic/angular';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import * as settingsOption from '@shared-lib/components/settings/constants/settingsOption.json';
import {endPoints} from './constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';

describe('WebLogoutService', () => {
  let modalControllerSpy;
  let modalSpy;
  let service: WebLogoutService;
  let sharedUtilityServiceSpy;
  let baseServiceSpy;
  let environment;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      modalSpy = jasmine.createSpyObj('modalSpy', ['present']);
      modalSpy.present.and.returnValue(Promise.resolve(true));
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['appendBaseUrlToEndpoints', 'getEnvironment', 'getMyVoyaDomain']
      );
      environment = {
        production: false,
        baseUrl: 'http://localhost:4201/',
        tokenBaseUrl: 'https://token.intg.app.voya.com/',
        myvoyaBaseUrl: 'http://localhost:4201/',
        myVoyaDomain: 'http://localhost:4201/',
        loginBaseUrl: 'https://login.intg.voya.com/',
        savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
        logoutUrl:
          'https://login.intg.voya.com/oidcop/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:oidc_logout&oidc_op=oidc_op_voya_customer_web',
      };
      sharedUtilityServiceSpy.getEnvironment.and.returnValue(environment);
      sharedUtilityServiceSpy.getMyVoyaDomain.and.returnValue(
        'http://localhost:4201/myvoya/public/logout'
      );
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [
          WebLogoutService,
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      });
      service = TestBed.inject(WebLogoutService);
      service.endPoints = endPoints;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setLogoutURL', () => {
    spyOn(Storage.prototype, 'setItem');
    service.setLogoutURL(
      'https://token.intg.app.voya.com/oidcop/app/.well-known/openid-configuration'
    );
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'logout-url',
      'https://token.intg.app.voya.com/oidcop/app/.well-known/openid-configuration'
    );
  });

  it('getLogoutURL', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(
      'https://token.intg.app.voya.com/oidcop/app/.well-known/openid-configuration'
    );
    const result = service.getLogoutURL();
    expect(result).toEqual(
      'https://token.intg.app.voya.com/oidcop/app/.well-known/openid-configuration'
    );
    expect(Storage.prototype.getItem).toHaveBeenCalledWith('logout-url');
  });

  it('getMyVoyageLogOutURL', () => {
    spyOn(service, 'setLogoutURL');
    service.getMyVoyageLogOutURL();
    expect(service.setLogoutURL).toHaveBeenCalledWith(
      `https://login.intg.voya.com/oidcop/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:oidc_logout&oidc_op=oidc_op_voya_customer_web&post_logout_redirect_uri=https://login.intg.voya.com/voyassoui/public/logout.html%3FappId=myVoyage%26loginURL=${window.location.href.slice(
        0,
        -1
      )}`
    );
    expect(sharedUtilityServiceSpy.getEnvironment).toHaveBeenCalled();
  });

  it('getMyVoyaLogout', () => {
    spyOn(service, 'setLogoutURL');
    service.getMyVoyaLogout();
    expect(sharedUtilityServiceSpy.getMyVoyaDomain).toHaveBeenCalled();
    expect(service.setLogoutURL).toHaveBeenCalledWith(
      'http://localhost:4201/myvoya/public/logout'
    );
  });

  describe('constructLogoutURL', () => {
    beforeEach(() => {
      spyOn(service, 'getMyVoyageLogOutURL').and.returnValue('url');
      spyOn(service, 'getMyVoyaLogout').and.returnValue('url');
    });
    it('constructLogoutURL for myVoyage', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('myVoyage');
      service.constructLogoutURL();
      expect(service.getMyVoyageLogOutURL).toHaveBeenCalled();
    });

    it('constructLogoutURL for myVoya', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('myVoya');
      service.constructLogoutURL();
      expect(service.getMyVoyaLogout).toHaveBeenCalled();
    });
  });

  describe('openModal', () => {
    beforeEach(() => {
      service.content = settingsOption;
    });
    it('should open AlertComponent modal and present it', async () => {
      await service.openModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: service.content.signOutQuestion,
          yesButtonTxt: service.content.button,
          noButtonTxt: service.content.close,
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
    it('for saveFunction', async () => {
      spyOn(service, 'action');
      await service.openModal();
      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;
      await saveFunction();
      expect(service.action).toHaveBeenCalled();
    });
  });

  describe('action', () => {
    const url =
      'https://token.intg.app.voya.com/oidcop/app/.well-known/openid-configuration';
    beforeEach(() => {
      spyOn(Storage.prototype, 'clear');
      spyOn(Storage.prototype, 'removeItem');
      spyOn(service, 'getLogoutURL').and.returnValue(url);
      spyOn(window, 'open');
      baseServiceSpy.get.and.returnValue(Promise.resolve());
    });
    it('should call baseServiceSpy.get, getLogoutURL, genesysRemoveLocalStorage, window.open, Storage.prototype.clear and StoragePrototype.removeItem', () => {
      service.action();
      expect(baseServiceSpy.get).toHaveBeenCalled();
      expect(service.getLogoutURL).toHaveBeenCalled();
      expect(Storage.prototype.clear).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith(url, '_self');
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('iframeloaded');
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith(
        'LoginEventSent'
      );
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith(
        'genesysActive'
      );
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith(
        'isMyBenefitshub'
      );
    });
    it('should call baseServiceSpy.get only once', () => {
      localStorage.setItem('appId', 'PWEB');
      localStorage.setItem('sessionId', 's');
      service.action();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/endSession?s=s'
      );
      expect(baseServiceSpy.get).not.toHaveBeenCalledWith(
        'myvoya/public/logout'
      );
      localStorage.removeItem('appId');
      localStorage.removeItem('sessionId');
    });
    it('should call baseServiceSpy.get twice', () => {
      localStorage.setItem('appId', 'myVoyage');
      service.action();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      localStorage.removeItem('appId');
    });
  });

  describe('setGenesysIsActive', () => {
    it('should set the isGenesysActive in sessionStorage and in the class prop', () => {
      spyOn(Storage.prototype, 'setItem');
      service['isGenesysActive'] = undefined;
      service.setGenesysIsActive(false);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'genesysActive',
        'false'
      );
      expect(service['isGenesysActive']).toBe(false);
    });
  });

  describe('getGenesysIsActive', () => {
    beforeEach(() => {
      service['isGenesysActive'] = false;
    });
    it('return isGenesysActive from sessionStorage if it exists', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('true');
      const result = service.getGenesysIsActive();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('genesysActive');
      expect(result).toBe(true);
    });
    it('return isGenesysActive from class property if sessionStorage is undefined', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(undefined);
      const result = service.getGenesysIsActive();
      expect(result).toBe(false);
    });
  });

  describe('genesysRemoveLocalStorage', () => {
    beforeEach(() => {
      spyOn(service, 'getLocalStorageKeys').and.returnValue([
        'deploymentId',
        'PlanId',
        '_act',
        '_gc',
      ]);
      spyOn(Storage.prototype, 'removeItem');
    });
    it('should call getLocalStorageKeys, Storage.prototype.removeItem', () => {
      service.genesysRemoveLocalStorage();
      expect(service.getLocalStorageKeys).toHaveBeenCalled();
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('deploymentId');
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('_act');
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('_gc');
    });
  });

  describe('getLocalStorageKeys', () => {
    const mockLocalStorage: any = {
      deploymentId: 'deploymentId12',
      PlanId: 'PlanId123',
      _act: '_act123',
      _gc: '_gc123',
    };
    it('should return keys', () => {
      const result = service.getLocalStorageKeys(mockLocalStorage);
      expect(result).toEqual(['deploymentId', 'PlanId', '_act', '_gc']);
    });
  });

  describe('getTerminatedUser, setTerminatedUser', () => {
    it('should return data', done => {
      service.setTerminatedUser(true);
      service.getTerminatedUser().subscribe(data => {
        expect(data).toEqual(true);
        done();
      });
    });
  });
});
