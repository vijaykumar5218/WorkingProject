import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {BenefitsBannerComponent} from './benefits-banner.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription, of} from 'rxjs';

describe('BannerComponent', () => {
  let component: BenefitsBannerComponent;
  let fixture: ComponentFixture<BenefitsBannerComponent>;
  let benefitServiceSpy;
  let benefitHomeContent;
  let benefitEnrollmentData;
  let sharedUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      benefitServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefitsSelectionHomeContent',
        'getBenefitsEnrollment',
        'openGuidelines',
        'getBannerContentObj',
      ]);
      benefitHomeContent = {
        openEnrollment: {
          NOT_STARTED: {
            header: 'Get back to your benefits',
            content: 'Stay on track and make your health benefits choices',
            icon: 'assets/icon/benefits/not_started_icon.svg',
            altText: 'calendar',
          },
          IN_PROGRESS: {
            header: 'TIme to select benefit',
            content: 'Stay on track and make your health benefits choices',
            icon: 'assets/icon/benefits/calendar_icon.svg',
            altText: '',
          },
          ACTION_PLAN_CREATED: {
            header: 'Reminder',
            content:
              'Check out your action plan for a personalized to-do list. It will help you take your next step in your benefits decisions.',
            icon: 'assets/icon/benefits/action_plan_created_icon.svg',
            altText: '',
          },
          COMPLETED: {
            header: 'Great job, your benefits action plan is complete.',
            content:
              "Congrats on checking off your list. Don't forget to come back and revisit as your needs and circumstances change.",
            icon: 'assets/icon/benefits/completed_icon.svg',
            altText: '',
            buttonText: 'Revisit Action Plan',
          },
        },
        outsideEnrollment: {
          NOT_STARTED: {
            header: 'Get back to your benefits',
            content: 'Stay on track and make your health benefits choices',
            icon: 'assets/icon/benefits/not_started_icon.svg',
            altText: 'calendar',
          },
          IN_PROGRESS: {
            header: 'TIme to select benefit',
            content: 'Stay on track and make your health benefits choices',
            icon: 'assets/icon/benefits/calendar_icon.svg',
            altText: '',
          },
          ACTION_PLAN_CREATED: {
            header: 'Reminder',
            content:
              'Check out your action plan for a personalized to-do list. It will help you take your next step in your benefits decisions.',
            icon: 'assets/icon/benefits/action_plan_created_icon.svg',
            altText: '',
          },
          COMPLETED: {
            header: 'Great job, your benefits action plan is complete.',
            content:
              "Congrats on checking off your list. Don't forget to come back and revisit as your needs and circumstances change.",
            icon: 'assets/icon/benefits/completed_icon.svg',
            altText: '',
            buttonText: 'Revisit Action Plan',
          },
        },
      };
      benefitServiceSpy.getBenefitsSelectionHomeContent.and.returnValue(
        Promise.resolve(benefitHomeContent)
      );
      benefitEnrollmentData = {
        status: 'IN_PROGRESS',
        enrollmentWindowEnabled: true,
      };
      benefitServiceSpy.getBenefitsEnrollment.and.returnValue(
        Promise.resolve(of(benefitEnrollmentData))
      );
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['getIsWeb']
      );
      const dummyObj = {
        header: 'Get back to your benefits',
        content: 'Stay on track and make your health benefits choices',
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: 'calendar',
      };
      benefitServiceSpy.getBannerContentObj.and.returnValue(dummyObj);

      TestBed.configureTestingModule({
        declarations: [BenefitsBannerComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BenefitsBannerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the content from the benefits service', () => {
      expect(
        benefitServiceSpy.getBenefitsSelectionHomeContent
      ).toHaveBeenCalled();
      expect(component.enrollmentBannerContent).toEqual(benefitHomeContent);
    });
    it('should subscribe to the benefitsEnrollment data', async () => {
      const obs = of(benefitEnrollmentData);
      const subscription = new Subscription();
      spyOn(obs, 'subscribe').and.callFake(f => {
        f(benefitEnrollmentData);
        return subscription;
      });
      spyOn(component['subscription'], 'add');
      benefitServiceSpy.getBenefitsEnrollment.and.returnValue(
        Promise.resolve(obs)
      );
      component.benefitsEnrollment = undefined;
      await component.ngOnInit();
      expect(benefitServiceSpy.getBenefitsEnrollment).toHaveBeenCalled();
      expect(obs.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(component.benefitsEnrollment).toEqual(benefitEnrollmentData);
    });
    it('should get isWeb from utility service', () => {
      sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(sharedUtilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
    it('should set the content from outside object if enrollment is false ', async () => {
      benefitEnrollmentData = {
        status: 'NOT_STARTED',
        enrollmentWindowEnabled: false,
      };
      benefitServiceSpy.getBenefitsEnrollment.and.returnValue(
        Promise.resolve(of(benefitEnrollmentData))
      );
      await component.ngOnInit();
      expect(component.contextObj).toEqual({
        header: 'Get back to your benefits',
        content: 'Stay on track and make your health benefits choices',
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: 'calendar',
      });
    });
    it('should set the content from open enrollment object if enrollment is true ', async () => {
      benefitEnrollmentData = {
        status: 'NOT_STARTED',
        enrollmentWindowEnabled: true,
      };
      benefitServiceSpy.getBenefitsEnrollment.and.returnValue(
        Promise.resolve(of(benefitEnrollmentData))
      );
      await component.ngOnInit();
      expect(component.contextObj).toEqual({
        header: 'Get back to your benefits',
        content: 'Stay on track and make your health benefits choices',
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: 'calendar',
      });
    });
    it('should set the undefined content benefits is undefined ', async () => {
      component.benefitsEnrollment = undefined;
      benefitServiceSpy.getBannerContentObj.and.returnValue(undefined);
      await component.ngOnInit();
      expect(component.contextObj).toBeUndefined();
    });
  });

  describe('openGuidelines', () => {
    it('should call benefits service openGuidelines', () => {
      component.openGuidelines();
      expect(benefitServiceSpy.openGuidelines).toHaveBeenCalledWith(
        true,
        benefitEnrollmentData.status
      );
    });
  });

  describe('closeBenefitsBanner', () => {
    it('should set displayBanner to false', () => {
      component.displayBanner = true;
      component.closeBenefitsBanner();
      expect(component.displayBanner).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
