import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {of, Subscription} from 'rxjs';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';

import {HelpEmailCardComponent} from './help-email-card.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {QualtricsService} from '@shared-lib/services/qualtrics/qualtrics.service';
import {QualtricsProperty} from '@shared-lib/services/qualtrics/constants/qualtrics-properties.enum';
import {QualtricsIntercept} from '@shared-lib/services/qualtrics/constants/qualtrics-intercepts.enum';
import {Router} from '@angular/router';

describe('HelpEmailCardComponent', () => {
  let component: HelpEmailCardComponent;
  let fixture: ComponentFixture<HelpEmailCardComponent>;
  let accountInfoServiceSpy;
  let observable;
  let subscription;
  let utilityServiceSpy;
  let qualtricsServiceSpy;
  let routerSpy;

  const message = {
    HelpPageJSON:
      '{"pageHeader":"Help","categoryList":[{"category":{"title":"Category A","questionList":[{"question":"How do to find my loans?","description":"How to find my loans"}]}},{"category":{"title":"Category B","questionList":[{"question":"How do to find my loans?","description":"How to find my loans"}]}}],"StillHaveQuestionsTile": { "questionsText":"Still have questions?", "helpEmailText":"Email Voya Support","helpEmailLink":"mailto:myvoyage@voya.com" }}',
  };
  const drupal = {
    DesktopHelpPageFAQs:
      '{"pageHeader":"Help","categoryList":[{"category":{"title":"Category A","questionList":[{"question":"How do to find my loans?","description":"How to find my loans"}]}},{"category":{"title":"Category B","questionList":[{"question":"How do to find my loans?","description":"How to find my loans"}]}}],"StillHaveQuestionsTile": { "questionsText":"Still have questions?", "helpEmailText":"Email Voya Support","helpEmailLink":"mailto:myvoyage@voya.com" }}',
  };

  beforeEach(
    waitForAsync(() => {
      accountInfoServiceSpy = jasmine.createSpyObj('AccountInfoService', [
        'getScreenMessage',
      ]);
      observable = of(message);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(message);
        return subscription;
      });
      accountInfoServiceSpy.getScreenMessage.and.returnValue(observable);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      qualtricsServiceSpy = jasmine.createSpyObj('QualtricsService', [
        'setProperty',
        'evaluateInterceptId',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);

      TestBed.configureTestingModule({
        declarations: [HelpEmailCardComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: QualtricsService, useValue: qualtricsServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HelpEmailCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getScreenMessage, set the content, and set moreContentSubscription', () => {
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.helpPageJSON).toEqual(JSON.parse(message.HelpPageJSON));
      expect(component.moreContentSubscription).toEqual(subscription);
    });

    it('should set isWeb false', () => {
      component.isWeb = undefined;
      component.ngOnInit();
      expect(component.isWeb).toBeFalse();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
    it('should set isWeb true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      accountInfoServiceSpy.getScreenMessage.and.returnValue(of(drupal));
      component.isWeb = true;
      component.ngOnInit();
      expect(component.isWeb).toBeTrue();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.helpPageJSON).toEqual(JSON.parse(drupal.DesktopHelpPageFAQs));
    });
  });

  describe('openQualtricsEmail', () => {
    it('should open qualtrics contact intercept, and not navigate if it is not web', async () => {
      component.isWeb = false;
      await component.openQualtricsEmail();

      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(qualtricsServiceSpy.setProperty.calls.all()[0].args[0]).toEqual(
        QualtricsProperty.CONTACT_VOYA_SUPPORT
      );
      expect(qualtricsServiceSpy.setProperty.calls.all()[0].args[1]).toEqual(
        'true'
      );
      expect(qualtricsServiceSpy.evaluateInterceptId).toHaveBeenCalledWith(
        QualtricsIntercept.EMAIL_INTERCEPT,
        true
      );
      expect(qualtricsServiceSpy.setProperty.calls.all()[1].args[0]).toEqual(
        QualtricsProperty.CONTACT_VOYA_SUPPORT
      );
      expect(qualtricsServiceSpy.setProperty.calls.all()[1].args[1]).toEqual(
        'false'
      );
    });

    it('should not open qualtrics contact intercept, but route to url instead if it is web', async () => {
      component.isWeb = true;
      await component.openQualtricsEmail();

      expect(qualtricsServiceSpy.setProperty).not.toHaveBeenCalled();
      expect(qualtricsServiceSpy.evaluateInterceptId).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.moreContentSubscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component.moreContentSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
