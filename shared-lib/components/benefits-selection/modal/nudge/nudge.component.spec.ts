import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {NudgeComponent} from './nudge.component';

describe('NudgeComponent', () => {
  let component: NudgeComponent;
  let fixture: ComponentFixture<NudgeComponent>;
  let modalControllerSpy;
  let router;
  let benefitEnrollmentData;
  let benefitServiceSpy;
  let utilityServiceSpy;
  let eventTrackingServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
        'setSuppressHeaderFooter',
      ]);
      benefitServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefitsEnrollment',
        'setBenefitSummaryBackButton',
      ]);
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', ['eventTracking']);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      benefitEnrollmentData = {
        status: 'IN_PROGRESS',
        enrollmentWindowEnabled: true,
      };
      benefitServiceSpy.getBenefitsEnrollment.and.returnValue(
        Promise.resolve(benefitEnrollmentData)
      );
      TestBed.configureTestingModule({
        declarations: [NudgeComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: Router, useValue: router},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy}
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NudgeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch the benefitsEnrollment data', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      expect(benefitServiceSpy.getBenefitsEnrollment).toHaveBeenCalled();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
  });

  describe('emitSelect', () => {
    it('should track and emit event', () => {
      spyOn(component.selectBenefits, 'emit');
      component.emitSelect(benefitEnrollmentData.status);
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith({
        eventName: 'CTAClick',
        passThruAttributes: [
          {
            attributeName: 'subType',
            attributeValue: 'open_enrollment_splash',
          },
          {
            attributeName: 'Enrollment_user_status',
            attributeValue: benefitEnrollmentData.status,
          },
        ],
      });
      expect(component.selectBenefits.emit).toHaveBeenCalled();
    });
  });

  describe('goToSummaryDetails', () => {
    it('should call goToSummaryDetails When isWeb would be true', () => {
      component.isWeb = true;
      component.goToSummaryDetails();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/all-coverages/elections'
      );
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        false
      );
    });
    it('should call goToSummaryDetails When isWeb would be false', () => {
      component.isWeb = false;
      component.goToSummaryDetails();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/settings/summary');
      expect(benefitServiceSpy.setBenefitSummaryBackButton).toHaveBeenCalled();
    });
  });
});
