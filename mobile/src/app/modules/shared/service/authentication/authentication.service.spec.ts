import {AuthenticationService} from './authentication.service';
import {fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {AlertController, LoadingController, Platform} from '@ionic/angular';
import {VaultService} from './vault.service';
import {IonicAuth} from '@ionic-enterprise/auth';
import {HTTP, HTTPResponse} from '@ionic-native/http/ngx';
import * as text from './contants/accountText.json';
import {auth0NativeConfig} from './contants/authConstants';
import {Discovery} from './models/discovery';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Device, SupportedBiometricType} from '@ionic-enterprise/identity-vault';
import {PlatformService} from '../platform/platform.service';
import {endPoints} from './contants/endpoint';

describe('AuthenticationService', () => {
  const authText: Record<string, string> = text;
  const endpoints = endPoints;
  let service: AuthenticationService;
  let routerSpy;
  let vaultServiceSpy;
  let loadingControllerSpy;
  let httpSpy;
  let platformSpy;
  let authenticationChangeSpy;
  let platformServiceSpy;
  let alertControllerSpy;

  beforeEach(() => {
    platformServiceSpy = jasmine.createSpyObj(
      'PlatformService',
      ['setInitialResume'],
      {
        onPause$: of(jasmine.createSpyObj('onPause', ['subscribe'])),
      }
    );
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    vaultServiceSpy = jasmine.createSpyObj('VaultService', [
      'enableFaceID',
      'disableFaceID',
      'isFaceIDEnabled',
      'isFaceIDAvailableOnDevice',
      'hasStoredSession',
      'getAccessToken',
      'lockVault',
      'unlockVault',
      'getRefreshToken',
      'defaultFaceIDDisabled',
      'setDefaultFaceIDDisabled',
      'clearVault',
      'isLocked',
    ]);
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
      'create',
      'dismiss',
    ]);
    httpSpy = jasmine.createSpyObj('HTTP', [
      'get',
      'post',
      'setDataSerializer',
      'clearCookies',
    ]);
    platformSpy = jasmine.createSpyObj('Platform', ['is'], {
      resume: of(jasmine.createSpyObj('OBJ', ['subscribe'])).pipe(delay(1)),
      pause: of(jasmine.createSpyObj('OBJ', ['subscribe'])).pipe(delay(1)),
    });
    platformSpy.is.and.returnValue(false);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    authenticationChangeSpy = jasmine.createSpyObj('BehaviorSubject', ['next']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: LoadingController, useValue: loadingControllerSpy},
        {provide: Router, useValue: routerSpy},
        {provide: VaultService, useValue: vaultServiceSpy},
        {provide: HTTP, useValue: httpSpy},
        {provide: Platform, useValue: platformSpy},
        {provide: PlatformService, useValue: platformServiceSpy},
        {provide: AlertController, useValue: alertControllerSpy},
      ],
    }).compileComponents();
    service = TestBed.inject(AuthenticationService);

    service['authenticationChange'] = authenticationChangeSpy;
    service['platformSubscription'] = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
      'add',
    ]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('navigateToLoggedInLanding', () => {
    it('should navigate to launchUrl if set', () => {
      service['launchUrl'] = 'test/2';
      service.navigateToLoggedInLanding();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('test/2');
      expect(service['launchUrl']).toBeNull();
    });

    it('should navigate to home if launchUrl not set', () => {
      service['launchUrl'] = null;
      service.navigateToLoggedInLanding();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('home');
    });
  });

  describe('didLaunchWithURL', () => {
    it('should set launchUrl', () => {
      service['launchUrl'] = null;
      service.didLaunchWithURL('test/test');
      expect(service['launchUrl']).toEqual('test/test');
    });
  });

  describe('getBiometricsIconName', () => {
    it('should return faceid_ios icon for faceid and ios', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Face])
      );
      platformSpy.is.and.returnValue(true);

      const result = await service.getBiometricsIconName();

      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(result).toEqual('assets/icon/faceid_ios.svg');
    });

    it('should return faceid_android icon for faceid and android', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Face])
      );
      platformSpy.is.and.returnValue(false);

      const result = await service.getBiometricsIconName();

      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(result).toEqual('assets/icon/faceid_android.svg');
    });

    it('should return touchid_ios icon for touchid and ios', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Fingerprint])
      );
      platformSpy.is.and.returnValue(true);

      const result = await service.getBiometricsIconName();

      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(result).toEqual('assets/icon/touch_ios.svg');
    });

    it('should return touchid_android icon for touchid and android', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Fingerprint])
      );
      platformSpy.is.and.returnValue(false);

      const result = await service.getBiometricsIconName();

      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(result).toEqual('assets/icon/touch_android.svg');
    });

    it('should return touch_android if nothing else', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([])
      );

      const result = await service.getBiometricsIconName();

      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual('assets/icon/touch_android.svg');
    });

    it('should return touch_android if both faceid and touch id', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([
          SupportedBiometricType.Fingerprint,
          SupportedBiometricType.Face,
        ])
      );

      const result = await service.getBiometricsIconName();

      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual('assets/icon/touch_android.svg');
    });
  });

  describe('getBiometricsLabel', () => {
    it('should return authText.faceIdIos for ios iris id devices', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Iris])
      );
      platformSpy.is.and.returnValue(true);

      const result = await service.getBiometricsLabel();
      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual(authText.faceIdIos);
    });

    it('should return authText.faceIdAndroid for android iris id devices', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Iris])
      );
      platformSpy.is.and.returnValue(false);

      const result = await service.getBiometricsLabel();
      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual(authText.faceIdAndroid);
    });

    it('should return authText.faceIdIos for ios face id devices', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Face])
      );
      platformSpy.is.and.returnValue(true);

      const result = await service.getBiometricsLabel();
      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual(authText.faceIdIos);
    });

    it('should return authText.faceIdAndroid for android face id devices', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Face])
      );
      platformSpy.is.and.returnValue(false);

      const result = await service.getBiometricsLabel();
      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual(authText.faceIdAndroid);
    });

    it('should return authText.touchIdIos for ios touch id devices', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Fingerprint])
      );
      platformSpy.is.and.returnValue(true);

      const result = await service.getBiometricsLabel();
      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual(authText.touchIdIos);
    });

    it('should return authText.touchIdAndroid for android touch id devices', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([SupportedBiometricType.Fingerprint])
      );
      platformSpy.is.and.returnValue(false);

      const result = await service.getBiometricsLabel();
      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual(authText.touchIdAndroid);
    });

    it('should default to biometrics if not any of the others', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([])
      );
      const result = await service.getBiometricsLabel();
      expect(result).toEqual(authText.biometrics);
    });

    it('should return touch_android if both faceid and touch id', async () => {
      spyOn(Device, 'getAvailableHardware').and.returnValue(
        Promise.resolve([
          SupportedBiometricType.Fingerprint,
          SupportedBiometricType.Face,
        ])
      );

      const result = await service.getBiometricsLabel();

      expect(Device.getAvailableHardware).toHaveBeenCalled();
      expect(result).toEqual(authText.touchIdAndroid);
    });
  });

  describe('registerPlatformListeners', () => {
    beforeEach(
      waitForAsync(() => {
        platformServiceSpy.setInitialResume.and.callFake(f => {
          f();
        });
      })
    );
    it('when usePlatformListeners would be false', () => {
      service['usePlatformListeners'] = false;
      service.registerPlatformListeners();
      expect(vaultServiceSpy.isFaceIDEnabled).not.toHaveBeenCalled();
    });
    describe('When usePlatformListeners would be true', () => {
      beforeEach(() => {
        spyOn(service, 'logout');
        spyOn(service, 'reloadWindow');
        spyOn(service, 'isAuthenticated');
        service['usePlatformListeners'] = true;
      });
      describe('when isFaceIDEnabled would be false', () => {
        beforeEach(() => {
          vaultServiceSpy.isFaceIDEnabled.and.returnValue(false);
        });
        it('should call logout', () => {
          service['pausedTime'] = 0;
          service.registerPlatformListeners();
          expect(vaultServiceSpy.isFaceIDEnabled).toHaveBeenCalled();
          expect(service.logout).toHaveBeenCalledWith(true);
        });
        it('should not call logout', fakeAsync(() => {
          service.registerPlatformListeners();
          tick(100);
          expect(service.logout).not.toHaveBeenCalled();
        }));
      });
      describe('when isFaceIDEnabled would be true', () => {
        beforeEach(() => {
          vaultServiceSpy.isFaceIDEnabled.and.returnValue(true);
          vaultServiceSpy.unlockVault.and.returnValue(Promise.resolve());
        });
        it('should call reloadWindow', fakeAsync(() => {
          service['pausedTime'] = 0;
          service.registerPlatformListeners();
          tick(100);
          expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('landing');
          expect(service.reloadWindow).toHaveBeenCalled();
        }));
        it('should call isAuthenticated and vaultService unlockVault', fakeAsync(() => {
          service.registerPlatformListeners();
          tick(100);
          expect(service.isAuthenticated).toHaveBeenCalled();
          expect(vaultServiceSpy.unlockVault).toHaveBeenCalled();
        }));
      });

      it('should navigate to launchUrl if its set', () => {
        service['launchUrl'] = 'test/it';
        service.registerPlatformListeners();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('test/it');
        expect(service['launchUrl']).toBeNull();
      });

      it('should not navigate to launchUrl if not set', () => {
        service['launchUrl'] = null;
        service.registerPlatformListeners();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalledWith('test/it');
      });
    });
    it('should call platformSubscription add', () => {
      service.registerPlatformListeners();
      expect(service['platformSubscription'].add).toHaveBeenCalled();
    });
  });

  describe('attemptFaceIDLogin', () => {
    beforeEach(() => {
      spyOn(service, 'navigateToLoggedInLanding');
      service.biometricsAuthenticationChange$ = jasmine.createSpyObj(
        'AuthChange',
        ['next']
      );
    });

    it('should check for faceID sesssion and auth session, then navigate home and set usePlatformListeners', async () => {
      service['usePlatformListeners'] = false;
      spyOn(service, 'hasFaceIDSession').and.returnValue(Promise.resolve(true));
      spyOn(service, 'isAuthenticated').and.returnValue(Promise.resolve(true));

      await service.attemptFaceIDLogin();

      expect(service.hasFaceIDSession).toHaveBeenCalled();
      expect(service.isAuthenticated).toHaveBeenCalled();
      expect(service.navigateToLoggedInLanding).toHaveBeenCalled();
      expect(service.biometricsAuthenticationChange$.next).toHaveBeenCalledWith(
        true
      );
      expect(service['usePlatformListeners']).toBeTrue();
    });

    it('should check for faceID session, and auth session, then return if no auth session', async () => {
      service['usePlatformListeners'] = false;
      spyOn(service, 'hasFaceIDSession').and.returnValue(Promise.resolve(true));
      spyOn(service, 'isAuthenticated').and.returnValue(Promise.resolve(false));

      await service.attemptFaceIDLogin();

      expect(service.hasFaceIDSession).toHaveBeenCalled();
      expect(service.isAuthenticated).toHaveBeenCalled();
      expect(service.navigateToLoggedInLanding).not.toHaveBeenCalled();
      expect(service['usePlatformListeners']).toBeFalse();
    });

    it('should check for faceID session, then return if no faceID session', async () => {
      service['usePlatformListeners'] = false;
      spyOn(service, 'hasFaceIDSession').and.returnValue(
        Promise.resolve(false)
      );
      spyOn(service, 'isAuthenticated').and.returnValue(Promise.resolve(false));

      await service.attemptFaceIDLogin();

      expect(service.hasFaceIDSession).toHaveBeenCalled();
      expect(service.isAuthenticated).not.toHaveBeenCalled();
      expect(service.navigateToLoggedInLanding).not.toHaveBeenCalled();
      expect(service['usePlatformListeners']).toBeFalse();
    });

    it('should clear faceid session on biometrics not available error', async () => {
      spyOn(service, 'hasFaceIDSession').and.returnValue(
        Promise.reject({
          message: 'error',
          code: 13,
        })
      );
      spyOn(service, 'clearStorage');
      spyOn(service, 'isAuthenticated');

      await service.attemptFaceIDLogin();

      expect(service.isAuthenticated).not.toHaveBeenCalled();
      expect(service.clearStorage).toHaveBeenCalled();
      expect(vaultServiceSpy.disableFaceID).toHaveBeenCalled();
    });

    it('should not do anything on biometrics error thats not code 13', async () => {
      spyOn(service, 'hasFaceIDSession').and.returnValue(
        Promise.reject({
          message: 'error',
          code: 99,
        })
      );
      spyOn(service, 'clearStorage');
      spyOn(service, 'isAuthenticated');

      await service.attemptFaceIDLogin();

      expect(service.clearStorage).not.toHaveBeenCalled();
      expect(vaultServiceSpy.disableFaceID).not.toHaveBeenCalled();
    });
  });

  describe('hasNonFaceIDSession', () => {
    it('should check for non face id vault type and return true if has session', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(false);
      vaultServiceSpy.hasStoredSession.and.returnValue(Promise.resolve(true));

      const result = await service.hasNonFaceIDSession();

      expect(vaultServiceSpy.hasStoredSession).toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should check for non face id vault type and return false if has no session', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(false);
      vaultServiceSpy.hasStoredSession.and.returnValue(Promise.resolve(false));

      const result = await service.hasNonFaceIDSession();

      expect(vaultServiceSpy.hasStoredSession).toHaveBeenCalled();
      expect(result).toBeFalse();
    });

    it('should check for non face id vault type and return false if not', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(true);

      const result = await service.hasNonFaceIDSession();

      expect(vaultServiceSpy.hasStoredSession).not.toHaveBeenCalled();
      expect(result).toBeFalse();
    });
  });

  describe('hasFaceIDSession', () => {
    it('should check for face id vault type and return true if has session', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(true);
      vaultServiceSpy.hasStoredSession.and.returnValue(Promise.resolve(true));

      const result = await service.hasFaceIDSession();

      expect(vaultServiceSpy.hasStoredSession).toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should check for face id vault type and return false if has no session', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(true);
      vaultServiceSpy.hasStoredSession.and.returnValue(Promise.resolve(false));

      const result = await service.hasFaceIDSession();

      expect(vaultServiceSpy.hasStoredSession).toHaveBeenCalled();
      expect(result).toBeFalse();
    });

    it('should check for face id vault type and return false if not', async () => {
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(false);

      const result = await service.hasFaceIDSession();

      expect(vaultServiceSpy.hasStoredSession).not.toHaveBeenCalled();
      expect(result).toBeFalse();
    });
  });

  describe('getDiscoveryURLS', () => {
    it('should call http get to fetch discovery urls', async () => {
      httpSpy.get.and.returnValue(
        Promise.resolve({
          data: `{
        "issuer":"https://a.com",
        "authorization_endpoint":"https://b.com",
        "token_endpoint":"https://c.com",
        "userinfo_endpoint":"https://d.com",
        "jwks_uri":"https://e.com",
        "response_types_supported":["code","none"],
        "response_modes_supported":["fragment","form_post"],
        "grant_types_supported":["authorization_code","refresh_token"],
        "id_token_signing_alg_values_supported":["RS256"],
        "id_token_encryption_alg_values_supported":[],
        "id_token_encryption_enc_values_supported":[],
        "poc":"https://f.com",
        "name":"oidc_op_voya_customer_app",
        "introspect_endpoint":"https://g.com",
        "revocation_endpoint":"https://h.com"
      }`,
        })
      );

      const result = await service.getDiscoveryURLS();

      expect(httpSpy.get).toHaveBeenCalledWith(
        auth0NativeConfig.discoveryUrl,
        {},
        {}
      );
      expect(result).toEqual({
        issuer: 'https://a.com',
        authorization_endpoint: 'https://b.com',
        token_endpoint: 'https://c.com',
        userinfo_endpoint: 'https://d.com',
        jwks_uri: 'https://e.com',
        response_types_supported: ['code', 'none'],
        response_modes_supported: ['fragment', 'form_post'],
        grant_types_supported: ['authorization_code', 'refresh_token'],
        id_token_signing_alg_values_supported: ['RS256'],
        id_token_encryption_alg_values_supported: [],
        id_token_encryption_enc_values_supported: [],
        poc: 'https://f.com',
        name: 'oidc_op_voya_customer_app',
        introspect_endpoint: 'https://g.com',
        revocation_endpoint: 'https://h.com',
      });
    });

    it('should return null if bad data', async () => {
      httpSpy.get.and.returnValue(Promise.resolve({}));

      const result = await service.getDiscoveryURLS();

      expect(httpSpy.get).toHaveBeenCalledWith(
        auth0NativeConfig.discoveryUrl,
        {},
        {}
      );
      expect(result).toEqual(null);
    });
  });

  describe('logoutAndRevoke', () => {
    beforeEach(() => {
      spyOn(service, 'getAccessToken').and.returnValue(
        Promise.resolve('ACCESS_TOKEN')
      );
      spyOn(service, 'getRefreshToken').and.returnValue(
        Promise.resolve('REFRESH_TOKEN')
      );
    });

    it('should just clear vault if there was a problem getting discovery urls', async () => {
      spyOn(service, 'getDiscoveryURLS').and.returnValue(Promise.resolve(null));
      spyOn(service, 'clearStorage');

      const result = await service.logoutAndRevoke();
      expect(service.clearStorage).toHaveBeenCalled();
      expect(result).toBeFalse();
    });

    it('should call revoke endpoint for both access and refresh tokens and return true', async () => {
      spyOn(service, 'getDiscoveryURLS').and.returnValue(
        Promise.resolve({
          revocation_endpoint: 'https://revoke.com',
        } as Discovery)
      );

      httpSpy.post.and.returnValue(
        Promise.resolve({status: 200} as HTTPResponse)
      );

      const result = await service.logoutAndRevoke();

      expect(service.getAccessToken).toHaveBeenCalled();
      expect(service.getRefreshToken).toHaveBeenCalled();

      const httpHeader = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const acccessBody =
        'client_id=' +
        auth0NativeConfig.clientID +
        '&token=' +
        'ACCESS_TOKEN' +
        '&token_type_hint=access_token';
      expect(httpSpy.post).toHaveBeenCalledWith(
        'https://revoke.com',
        acccessBody,
        httpHeader
      );

      const refreshBody =
        'client_id=' +
        auth0NativeConfig.clientID +
        '&token=' +
        'REFRESH_TOKEN' +
        '&token_type_hint=refresh_token';
      expect(httpSpy.post).toHaveBeenCalledWith(
        'https://revoke.com',
        refreshBody,
        httpHeader
      );

      expect(result).toBeTrue();
    });

    it('should call revoke endpoint for both access and refresh tokens and return false if error', async () => {
      spyOn(service, 'getDiscoveryURLS').and.returnValue(
        Promise.resolve({
          revocation_endpoint: 'https://revoke.com',
        } as Discovery)
      );

      httpSpy.post.and.returnValue(
        Promise.resolve({status: 403} as HTTPResponse)
      );

      const result = await service.logoutAndRevoke();

      expect(result).toBeFalse();
    });
  });

  describe('openRegister', () => {
    it('should clear and extra params and call login', () => {
      spyOn(service, 'login');
      spyOn(service, 'additionalLoginParameters');
      service.openRegister();
      expect(service.additionalLoginParameters).toHaveBeenCalledWith({
        register: 'allow',
      });
      expect(service.login).toHaveBeenCalled();
    });
  });

  describe('openLogin', () => {
    it('should clear and extra params and call login', () => {
      spyOn(service, 'login');
      spyOn(service, 'additionalLoginParameters');
      service.openLogin();
      expect(service.additionalLoginParameters).toHaveBeenCalledWith({});
      expect(service.login).toHaveBeenCalled();
    });
  });

  describe('shouldShowBiometricsScreen', () => {
    it('should return true if isFaceIDAvailableOnDevice and defaultFaceIDDisabled is false', async () => {
      vaultServiceSpy.isFaceIDAvailableOnDevice.and.returnValue(
        Promise.resolve(true)
      );
      vaultServiceSpy.defaultFaceIDDisabled.and.returnValue(false);

      const result = await service.shouldShowBiometricsScreen();

      expect(vaultServiceSpy.isFaceIDAvailableOnDevice).toHaveBeenCalled();
      expect(vaultServiceSpy.defaultFaceIDDisabled).toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should return false if isFaceIDAvailableOnDevice and defaultFaceIDDisabled is true', async () => {
      vaultServiceSpy.isFaceIDAvailableOnDevice.and.returnValue(
        Promise.resolve(true)
      );
      vaultServiceSpy.defaultFaceIDDisabled.and.returnValue(true);

      const result = await service.shouldShowBiometricsScreen();
      expect(result).toBeFalse();
    });

    it('should return false if isFaceIDAvailableOnDevice is false', async () => {
      vaultServiceSpy.isFaceIDAvailableOnDevice.and.returnValue(
        Promise.resolve(false)
      );

      const result = await service.shouldShowBiometricsScreen();
      expect(result).toBeFalse();
    });
  });

  describe('showLoginFailureAlert', () => {
    it('should call alertController', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

      await service.showLoginFailureAlert();

      expect(alertControllerSpy.create).toHaveBeenCalled();
      expect(alertSpy.present).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      spyOn(service, 'clearStorage');
      spyOn(service, 'showLoginFailureAlert');
    });

    it('should call super', async () => {
      spyOn(IonicAuth.prototype, 'login');

      await service.login();

      expect(service.clearStorage).toHaveBeenCalled();
      expect(vaultServiceSpy.clearVault).toHaveBeenCalled();
      expect(vaultServiceSpy.disableFaceID).toHaveBeenCalled();
      expect(IonicAuth.prototype.login).toHaveBeenCalled();
    });

    it('should clear vault again and re login if error code 5', fakeAsync(async () => {
      spyOn(IonicAuth.prototype, 'login').and.returnValue(
        Promise.reject({code: 5})
      );

      await service.login();

      expect(vaultServiceSpy.disableFaceID).toHaveBeenCalledTimes(2);

      tick(51);

      expect(IonicAuth.prototype.login).toHaveBeenCalledTimes(2);
    }));

    it('should not do anything if error is "Error: browser was closed"', fakeAsync(async () => {
      spyOn(IonicAuth.prototype, 'login').and.returnValue(
        Promise.reject('Error: browser was closed')
      );

      await service.login();

      expect(vaultServiceSpy.disableFaceID).not.toHaveBeenCalledTimes(2);
      expect(IonicAuth.prototype.login).not.toHaveBeenCalledTimes(2);
      expect(service.showLoginFailureAlert).not.toHaveBeenCalled();
    }));

    it('should call showLoginFailureAlert if error is anything else', fakeAsync(async () => {
      spyOn(IonicAuth.prototype, 'login').and.returnValue(
        Promise.reject({code: 939393939})
      );

      await service.login();

      expect(vaultServiceSpy.disableFaceID).not.toHaveBeenCalledTimes(2);
      expect(IonicAuth.prototype.login).not.toHaveBeenCalledTimes(2);
      expect(service.showLoginFailureAlert).toHaveBeenCalled();
    }));
  });

  describe('onAuthChange', () => {
    it('should call ngzone run and authenticationChange next', () => {
      const runSpy = spyOn(service['ngZone'], 'run').and.callFake(f => f());
      const value = {auth: false, attested: true};
      service.onAuthChange(value);
      expect(service['authenticationChange'].next).toHaveBeenCalledWith(value);

      expect(runSpy).toHaveBeenCalled();
    });
  });

  describe('onLoginSuccess', () => {
    beforeEach(() => {
      spyOn(service, 'onAuthChange');
      spyOn(service, 'clearStorage');
      spyOn(service, 'showLoginFailureAlert');
    });

    it('should call on auth change', async () => {
      spyOn(service, 'isAuthenticated').and.returnValue(Promise.resolve(true));

      await service.onLoginSuccess();

      expect(service.isAuthenticated).toHaveBeenCalled();
      expect(service.onAuthChange).toHaveBeenCalledWith({
        auth: true,
        attested: false,
      });
      expect(service['usePlatformListeners']).toBeTrue();
    });

    it('should not call on auth change if not authenticated', async () => {
      spyOn(service, 'isAuthenticated').and.returnValue(Promise.resolve(false));

      await service.onLoginSuccess();

      expect(service.isAuthenticated).toHaveBeenCalled();
      expect(service.showLoginFailureAlert).toHaveBeenCalled();
      expect(service.clearStorage).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('landing');

      expect(service.onAuthChange).not.toHaveBeenCalledWith({
        auth: true,
        attested: false,
      });
      expect(service['usePlatformListeners']).toBeFalse();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'clear');
      spyOn(service, 'clearUserSessionLocalStorage');
      spyOn(service, 'reloadWindow');
      spyOn(service, 'onAuthChange');
    });

    it('should call onAuthChange', async () => {
      await service.logout(true);
      expect(service.onAuthChange).toHaveBeenCalledWith({
        auth: false,
        attested: false,
      });
    });

    it('should route to logout page if it is a timeout', async () => {
      await service.logout(true);

      expect(service.reloading).toBeTrue();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('logout');
      expect(service.clearUserSessionLocalStorage).toHaveBeenCalled();
      expect(service.reloadWindow).toHaveBeenCalled();
    });

    it('should logout and just lock vault if is faceid session', async () => {
      service['usePlatformListeners'] = true;
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(true);

      await service.logout();

      expect(service.reloading).toBeTrue();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalledWith('logout');
      expect(service['usePlatformListeners']).toBeFalse();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('secure-sign-out');
      expect(vaultServiceSpy.isFaceIDEnabled).toHaveBeenCalled();
      expect(vaultServiceSpy.lockVault).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['landing'], {
        queryParams: {
          noAutoLogin: true,
        },
      });
      expect(service.clearUserSessionLocalStorage).toHaveBeenCalled();
      expect(service.reloadWindow).toHaveBeenCalled();
    });

    it('should logout and revoke tokens if not faceid session', async () => {
      service['usePlatformListeners'] = true;
      vaultServiceSpy.isFaceIDEnabled.and.returnValue(false);

      spyOn(service, 'logoutAndRevoke');
      spyOn(IonicAuth.prototype, 'clearStorage');

      await service.logout();

      expect(service['usePlatformListeners']).toBeFalse();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('secure-sign-out');
      expect(vaultServiceSpy.isFaceIDEnabled).toHaveBeenCalled();
      expect(vaultServiceSpy.lockVault).not.toHaveBeenCalled();
      expect(service.logoutAndRevoke).toHaveBeenCalled();
      expect(IonicAuth.prototype.clearStorage).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['landing'], {
        queryParams: {
          noAutoLogin: true,
        },
      });
      expect(service.clearUserSessionLocalStorage).toHaveBeenCalled();
      expect(service.reloadWindow).toHaveBeenCalled();
    });
  });

  describe('clearUserSessionLocalStorage', () => {
    it('should clear local storage but keep certain properties', () => {
      service.peristedLocalStorageItems = ['itemA', 'itemB'];
      spyOn(Storage.prototype, 'getItem').and.returnValue('test');
      spyOn(Storage.prototype, 'setItem');
      spyOn(Storage.prototype, 'clear');

      service.clearUserSessionLocalStorage();

      expect(Storage.prototype.getItem).toHaveBeenCalledWith('itemA');
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('itemB');

      expect(Storage.prototype.clear).toHaveBeenCalled();

      expect(Storage.prototype.setItem).toHaveBeenCalledWith('itemA', 'test');
      expect(Storage.prototype.setItem).toHaveBeenCalledWith('itemB', 'test');
    });
  });

  describe('clearStorage', () => {
    it('should call http clearCookies and then call super clearStorage', async () => {
      spyOn(IonicAuth.prototype, 'clearStorage');

      await service.clearStorage();
      expect(IonicAuth.prototype.clearStorage).toHaveBeenCalled();
      expect(httpSpy.clearCookies).toHaveBeenCalled();
    });
  });

  describe('clearStorage', () => {
    it('should call myvoya logout, clear cookies, and then call super', () => {
      spyOn(IonicAuth.prototype, 'clearStorage');

      service.clearStorage();

      expect(httpSpy.get).toHaveBeenCalledWith(endpoints.myvoyaLogout, {}, {});
      expect(httpSpy.clearCookies).toHaveBeenCalled();
      expect(IonicAuth.prototype.clearStorage).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from platform events', () => {
      service.ngOnDestroy();
      expect(service['platformSubscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
