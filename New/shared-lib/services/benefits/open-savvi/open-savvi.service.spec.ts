import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';
import {QueryAccessToken} from '@shared-lib/services/benefits/open-savvi/models/queryAccessToken.model';
import {LoadingController} from '@ionic/angular';
import {OpenSavviService} from '@shared-lib/services/benefits/open-savvi/open-savvi.service';
import {loginEndPoints, tokenEndPoints} from '../constants/endpoints';
import {Environment} from '@shared-lib/models/environment.model';
import {BenefitsService} from '../benefits.service';
import {SavviIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/savvi-iab-controller';

describe('OpenSavviService', () => {
  let utilityServiceSpy;
  let service: OpenSavviService;
  let authServiceSpy;
  let baseServiceSpy;
  let loadingControllerSpy;
  let benefitServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'getEnvironment',
        'getIsWeb',
        'appendBaseUrlToEndpoints',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
        endpoints => endpoints
      );
      const environment = {
        production: false,
        baseUrl: 'https://myvoyage.intg.app.voya.com/',
        tokenBaseUrl: 'https://token.intg.app.voya.com/',
        myvoyaBaseUrl: 'https://myvoya.intg.app.voya.com/',
        loginBaseUrl: 'https://login.intg.voya.com/',
        savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
        authClientID: 'myvoyage_app_MFbT3mcQsSY78eugY5je',
        authTokenExchangeClient:
          'myvoyage_app_token_exchange_8ah5YTB3MIavGzS3UXjj',
        ssoSamlUrl: 'https://sso.myvoya.com',
      } as Environment;
      utilityServiceSpy.getEnvironment.and.returnValue(environment);
      authServiceSpy = jasmine.createSpyObj('AuthService', ['getAccessToken']);
      baseServiceSpy = jasmine.createSpyObj('BaseService', ['postUrlEncoded']);
      loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
        'create',
      ]);
      benefitServiceSpy = jasmine.createSpyObj('BenefitService', [
        'resetBenefitsEnrollment',
        'getBenefitsEnrollment',
      ]);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [
          OpenSavviService,
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: LoadingController, useValue: loadingControllerSpy},
          {provide: BenefitsService, useValue: benefitServiceSpy},
        ],
      });
      service = TestBed.inject(OpenSavviService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    const environment = {
      production: false,
      baseUrl: 'https://myvoyage.intg.app.voya.com/',
      tokenBaseUrl: 'https://token.intg.app.voya.com/',
      myvoyaBaseUrl: 'https://myvoya.intg.app.voya.com/',
      loginBaseUrl: 'https://login.intg.voya.com/',
      savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
      authClientID: 'myvoyage_app_MFbT3mcQsSY78eugY5je',
      authTokenExchangeClient:
        'myvoyage_app_token_exchange_8ah5YTB3MIavGzS3UXjj',
      ssoSamlUrl: 'https://sso.myvoya.com',
    } as Environment;
    it('should append login base url to loginEndPoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
        loginEndPoints,
        environment.loginBaseUrl
      );
      expect(service.loginEndPoints).toEqual(loginEndPoints);
    });

    it('should append token base url to token endpoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
        tokenEndPoints,
        environment.tokenBaseUrl
      );
      expect(service.tokenEndPoints).toEqual(tokenEndPoints);
    });

    it('should get and set environment', () => {
      expect(utilityServiceSpy.getEnvironment).toHaveBeenCalled();
      expect(service.environment).toEqual(environment);
    });
  });

  describe('openSavvi', () => {
    it('should open an in app browser', async () => {
      const savviUrl = 'savviUrl';
      spyOn(service, 'generateSavviUrl').and.returnValue(
        Promise.resolve(savviUrl)
      );
      spyOn(SavviIABController.prototype, 'openInAppBrowser');
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      await service.openSavvi();
      expect(service.generateSavviUrl).toHaveBeenCalled();
      expect(
        SavviIABController.prototype.openInAppBrowser
      ).toHaveBeenCalledWith(savviUrl);
    });
  });

  describe('generateSavviUrl', () => {
    describe('when isWeb would be false', () => {
      let mockLoader;
      let mockAuthToken;
      const queryAccessTokenResponse: QueryAccessToken = {
        access_token: 'access_token',
      };
      beforeEach(() => {
        utilityServiceSpy.getIsWeb.and.returnValue(false);
        mockAuthToken = 'accessToken';
        authServiceSpy.getAccessToken.and.returnValue(
          Promise.resolve(mockAuthToken)
        );
        baseServiceSpy.postUrlEncoded.and.returnValue(
          Promise.resolve(queryAccessTokenResponse)
        );
        mockLoader = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
        loadingControllerSpy.create.and.returnValue(
          Promise.resolve(mockLoader)
        );
      });
      it('should replace savviBaseUrl with loginEndPoints', async () => {
        await service.generateSavviUrl();
        const mockSavviUrl =
          'saml/sps/saml-idp-my-to-guidance/saml20/logininitial?PartnerId=https://myhealthwealth.intg.voya.com/v1/auth/saml2/voya&access_token=';
        expect(
          service.loginEndPoints.savviSaml.replace(
            '{savviBaseUrl}',
            service.environment.savviBaseUrl
          )
        ).toEqual(mockSavviUrl);
      });

      it('should show the loader', async () => {
        await service.generateSavviUrl();
        expect(loadingControllerSpy.create).toHaveBeenCalledWith({
          translucent: true,
        });
        expect(mockLoader.present).toHaveBeenCalled();
      });

      it('should get the access token from authService', async () => {
        await service.generateSavviUrl();
        expect(authServiceSpy.getAccessToken).toHaveBeenCalled();
      });

      it('should call baseService postUrlEncoded to get the query access token', async () => {
        await service.generateSavviUrl();
        expect(baseServiceSpy.postUrlEncoded).toHaveBeenCalledWith(
          tokenEndPoints.samlAuthToken,
          {
            client_id: service.environment.authTokenExchangeClient,
            subject_token: mockAuthToken,
            subject_token_type: 'access_token',
            audience: 'https://sso.myvoya.com',
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            requested_token_type: 'access_token',
            scope: 'urn:voya:federation',
          },
          {}
        );
      });
      it('should return the savviSamlUrl', async () => {
        const mockSavviSamlUrl =
          'saml/sps/saml-idp-my-to-guidance/saml20/logininitial?PartnerId=https://myhealthwealth.intg.voya.com/v1/auth/saml2/voya&access_token=access_token';
        const result = await service.generateSavviUrl();
        expect(result).toEqual(mockSavviSamlUrl);
        expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      });
    });
    describe('when isWeb would be true', () => {
      beforeEach(() => {
        utilityServiceSpy.getIsWeb.and.returnValue(true);
      });
      it('should return savviSamlUrl', async () => {
        const mockSavviSamlUrl =
          'saml/sps/saml-idp-my-to-guidance/saml20/logininitial?PartnerId=https://myhealthwealth.intg.voya.com/v1/auth/saml2/voya&access_token=';
        const result = await service.generateSavviUrl();
        expect(result).toEqual(mockSavviSamlUrl);
        expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      });
    });
  });

  describe('exitCallback', () => {
    it('should reset the benefits enrollment data', () => {
      service.exitCallback();
      expect(benefitServiceSpy.resetBenefitsEnrollment).toHaveBeenCalled();
      expect(benefitServiceSpy.getBenefitsEnrollment).toHaveBeenCalled();
    });
  });
});
