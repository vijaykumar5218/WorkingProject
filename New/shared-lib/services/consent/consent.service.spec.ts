import {TestBed} from '@angular/core/testing';
import {SharedUtilityService} from '../utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {ConsentService} from './consent.service';
import {ConsentType} from './constants/consentType.enum';
import {endpoints} from './constants/endpoints';
import {BehaviorSubject, of} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';

describe('ConsentService', () => {
  const endPoints = endpoints;
  let service: ConsentService;
  let baseServiceSpy;
  let utilityServiceSpy;
  let subscriptionSpy;
  let routerSpy;

  beforeEach(() => {
    baseServiceSpy = jasmine.createSpyObj('BaseService', ['post']);
    utilityServiceSpy = jasmine.createSpyObj('UtitlityService', [
      'appendBaseUrlToEndpoints',
    ]);
    utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endPoints);
    routerSpy = {
      events: of({}),
    };
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {provide: Router, useValue: routerSpy},
      ],
    });
    service = TestBed.inject(ConsentService);

    subscriptionSpy = jasmine.createSpyObj('Subscription', [
      'add',
      'unsubscribe',
    ]);
    service['subscription'] = subscriptionSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
      endPoints
    );
  });

  describe('getMedicalConsent', () => {
    const trueMedConsentData = {
      consentTypeName: ConsentType.MEDICAL,
      consentStatus: 'APPROVED',
    };
    const falseMedConsentData = {
      consentTypeName: ConsentType.MEDICAL,
      consentStatus: 'DENIED',
    };

    it('should load medical consent data and set true and info be cached', async () => {
      baseServiceSpy.post.and.returnValue(Promise.resolve(trueMedConsentData));

      service.getMedicalConsent().subscribe(data => {
        expect(data).toBeTrue();
        expect(baseServiceSpy.post).toHaveBeenCalledWith(endPoints.getConsent, {
          consentTypeName: ConsentType.MEDICAL,
        });
      });

      baseServiceSpy.post.and.returnValue(Promise.resolve(falseMedConsentData));

      service.getMedicalConsent().subscribe(data => {
        expect(data).toBeTrue();
        expect(baseServiceSpy.post).toHaveBeenCalledTimes(1);
      });
    });

    it('should load medical consent data and set false and force refresh it', async () => {
      baseServiceSpy.post.and.returnValue(Promise.resolve(falseMedConsentData));

      service.getMedicalConsent().subscribe(data => {
        expect(data).toBeFalse();
        expect(baseServiceSpy.post).toHaveBeenCalledWith(endPoints.getConsent, {
          consentTypeName: ConsentType.MEDICAL,
        });
      });

      service.getMedicalConsent(true).subscribe(data => {
        expect(data).toBeFalse();
        expect(baseServiceSpy.post).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('setConsent', () => {
    beforeEach(() => {
      spyOn(service, 'setJustGaveConsent');
    });

    it('should call setJustGaveConsent if approved', () => {
      service.setConsent(ConsentType.MEDICAL, true);
      expect(service.setJustGaveConsent).toHaveBeenCalled();
    });

    it('should call baseService post with approved', () => {
      service.setConsent(ConsentType.MEDICAL, true);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(endPoints.saveConsent, {
        consentTypeName: ConsentType.MEDICAL,
        consentStatus: 'APPROVED',
      });
    });

    it('should call baseService post with denied', () => {
      service.setConsent(ConsentType.MEDICAL, false);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(endPoints.saveConsent, {
        consentTypeName: ConsentType.MEDICAL,
        consentStatus: 'DENIED',
      });
    });
  });

  describe('setJustGaveConsent', () => {
    it('should set justGaveConsent to true, and then subscribe to the next navigation event to set it back to false', () => {
      const jgcSpy = jasmine.createSpyObj('JustGaveConsent', ['next']);
      service.justGaveConsent = jgcSpy;

      const subject = new BehaviorSubject<NavigationStart>(new NavigationStart(0, '/test'));
      routerSpy.events = subject;

      service.setJustGaveConsent();

      expect(jgcSpy.next).toHaveBeenCalledWith(true);
      expect(jgcSpy.next).not.toHaveBeenCalledWith(false);
    });
    it('should set justGaveConsent to true, and then subscribe to the next navigation event to set it back to false', () => {
      const jgcSpy = jasmine.createSpyObj('JustGaveConsent', ['next']);
      service.justGaveConsent = jgcSpy;

      const subject = new BehaviorSubject<NavigationStart>(new NavigationStart(0, '/test'));
      routerSpy.events = subject;

      service.setJustGaveConsent();

      subject.next(new NavigationStart(0, '/test'));

      expect(jgcSpy.next).toHaveBeenCalledWith(true);
      expect(jgcSpy.next).toHaveBeenCalledWith(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      service.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
