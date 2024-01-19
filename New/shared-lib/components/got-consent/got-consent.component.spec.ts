import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {GotConsentComponent} from './got-consent.component';
import {of} from 'rxjs';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';

describe('GotConsentComponent', () => {
  let component: GotConsentComponent;
  let fixture: ComponentFixture<GotConsentComponent>;
  let benefitsServiceSpy;
  let consentServiceSpy;
  let utilityServiceSpy;
  let mockBenContents;
  let mockText;
  let visibilityChangedSpy;

  beforeEach(
    waitForAsync(() => {
      mockText = {
        test: 'test text',
      };
      mockBenContents = {
        Insights_ThankYouforAuth_Banner: JSON.stringify(mockText),
      } as NoBenefitContent;

      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNoBenefitContents',
      ]);
      consentServiceSpy = jasmine.createSpyObj('ConsentService', [], {
        justGaveConsent: of(true),
      });
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);

      utilityServiceSpy.getIsWeb.and.returnValue(true);
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(mockBenContents)
      );

      visibilityChangedSpy = jasmine.createSpyObj('VisChanged', ['emit']);

      TestBed.configureTestingModule({
        declarations: [GotConsentComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: ConsentService, useValue: consentServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(GotConsentComponent);
      component = fixture.componentInstance;

      component.visibilityChanged = visibilityChangedSpy;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb', () => {
      expect(component.isWeb).toBeTrue();
      expect(component.show).toBeTrue();
      expect(visibilityChangedSpy.emit).toHaveBeenCalledWith(true);
      expect(component.content).toEqual(mockText);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.subscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
