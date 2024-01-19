import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {BenefitsBannerComponent} from './benefits-banner.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {BenefitsHomeContent} from '../../../../../../../../../shared-lib/services/benefits/models/benefits.model';

describe('BenefitsBannerComponent', () => {
  let component: BenefitsBannerComponent;
  let fixture: ComponentFixture<BenefitsBannerComponent>;
  let benefitServiceSpy;
  const mockBenefitHomeContent: BenefitsHomeContent = {
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
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: 'calendar',
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
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: 'calendar',
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

  beforeEach(
    waitForAsync(() => {
      benefitServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefitsSelectionHomeContent',
        'openGuidelines',
        'getBannerContentObj',
      ]);
      benefitServiceSpy.getBenefitsSelectionHomeContent.and.returnValue(
        Promise.resolve(mockBenefitHomeContent)
      );
      TestBed.configureTestingModule({
        declarations: [BenefitsBannerComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: BenefitsService, useValue: benefitServiceSpy}],
      }).compileComponents();
      fixture = TestBed.createComponent(BenefitsBannerComponent);
      component = fixture.componentInstance;
      component.benefitsEnrollment = {
        status: 'NOT_STARTED',
        enrollmentWindowEnabled: true,
        suppressBanner: false,
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.contextObj = undefined;
      const dummyObj = {
        header: 'Get back to your benefits',
        content: 'Stay on track and make your health benefits choices',
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: 'calendar',
      };
      benefitServiceSpy.getBannerContentObj.and.returnValue(dummyObj);
    });
    it('should set the content from func of enrollmentBannerContent', () => {
      expect(
        benefitServiceSpy.getBenefitsSelectionHomeContent
      ).toHaveBeenCalled();
      expect(component.enrollmentBannerContent).toEqual(mockBenefitHomeContent);
    });
    it('should set the content from outside object if enrollment is false ', async () => {
      component.benefitsEnrollment = {
        status: 'NOT_STARTED',
        enrollmentWindowEnabled: false,
        suppressBanner: false,
      };
      await component.ngOnInit();
      expect(component.contextObj).toEqual({
        header: 'Get back to your benefits',
        content: 'Stay on track and make your health benefits choices',
        icon: 'assets/icon/benefits/not_started_icon.svg',
        altText: 'calendar',
      });
    });
  });

  describe('openGuidelines', () => {
    it('should call benefits service openGuidelines', () => {
      const status = 'NOT_STARTED';
      component.benefitsEnrollment = {
        status: status,
        enrollmentWindowEnabled: true,
        suppressBanner: false,
      };
      component.openGuidelines();
      expect(benefitServiceSpy.openGuidelines).toHaveBeenCalledWith(
        true,
        component.benefitsEnrollment.status
      );
    });
  });
});
