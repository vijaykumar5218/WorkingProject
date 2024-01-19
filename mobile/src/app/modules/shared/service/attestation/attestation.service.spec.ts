import {TestBed, waitForAsync} from '@angular/core/testing';
import {AuthenticationService} from '../authentication/authentication.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AttestationService} from './attestation.service';
import {endpoints} from './constants/endpoints';

describe('AttestationService', () => {
  const endPoints = endpoints;
  let service: AttestationService;
  let utilityServiceSpy;
  let authServiceSpy;
  let attestSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'appendBaseUrlToEndpoints',
        'getEnvironment',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endPoints);

      authServiceSpy = jasmine.createSpyObj('AuthService', ['getAccessToken']);
      utilityServiceSpy.getEnvironment.and.returnValue({
        production: false,
        baseUrl: '',
        tokenBaseUrl: 'http://token/',
        myvoyaBaseUrl: '',
        loginBaseUrl: '',
      });

      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
        ],
      });
      service = TestBed.inject(AttestationService);

      attestSpy = jasmine.createSpyObj('Attestation', ['attestApplication']);
      service['attest'] = attestSpy;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('attestApplication', () => {
    it('should call attestation plugin and return true if success', async () => {
      const token = 'aaa-bbb-ccc';
      authServiceSpy.getAccessToken.and.returnValue(Promise.resolve(token));
      attestSpy.attestApplication.and.returnValue(
        Promise.resolve({success: true, message: ''})
      );

      const result = await service.attestApplication();
      expect(authServiceSpy.getAccessToken).toHaveBeenCalled();
      expect(attestSpy.attestApplication).toHaveBeenCalledWith({
        attestationUrl: endPoints.attestationEndpoint,
        token: token,
      });
      expect(result).toBeTrue();
    });

    it('should call attestation plugin and return false if not success', async () => {
      const token = 'aaa-bbb-ccc';
      authServiceSpy.getAccessToken.and.returnValue(Promise.resolve(token));
      attestSpy.attestApplication.and.returnValue(
        Promise.resolve({success: false, message: ''})
      );

      const result = await service.attestApplication();
      expect(result).toBeFalse();
    });
  });
});
