import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {IonicModule, LoadingController} from '@ionic/angular';
import Swiper from 'swiper';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {Status} from '@shared-lib/constants/status.enum';
import {AuthenticationService} from '../../shared/service/authentication/authentication.service';
import {LandingPage} from './landing.page';
import {LaunchContentPage} from './models/landing.model';
import {LandingService} from './service/landing.service';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import * as landingText from './constants/landing-content.json';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {HomeService} from '@shared-lib/services/home/home.service';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('LandingPage', () => {
  const pageText = landingText;
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;
  let headerFooterTypeServiceSpy;
  let authServiceSpy;
  let landingServiceSpy;
  let activeRouteSpy;
  let loadingControllerSpy;
  let homeServiceSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerFooterTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publishType',
      ]);
      authServiceSpy = jasmine.createSpyObj(
        'AuthService',
        [
          'attemptFaceIDLogin',
          'hasFaceIDSession',
          'openLogin',
          'openRegister',
          'hasNonFaceIDSession',
          'logoutAndRevoke',
          'getBiometricsIconName',
          'getBiometricsLabel',
          'shouldShowBiometricsScreen',
          'navigateToLoggedInLanding',
          'onAuthChange',
        ],
        {
          authenticationChange$: jasmine.createSpyObj('AuthChangeObservable', [
            'subscribe',
          ]),
          biometricsAuthenticationChange$: jasmine.createSpyObj(
            'BioAuthChangeObservable',
            ['subscribe']
          ),
        }
      );
      landingServiceSpy = jasmine.createSpyObj('LandingService', [
        'getLandingContent',
        'checkMyvoyageAccess',
        'openInBrowser',
        'validateApplication',
        'openVersionAlert',
        'navigateByUrl',
      ]);
      activeRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
        queryParams: of({}).pipe(),
      });
      loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
        'create',
      ]);
      homeServiceSpy = jasmine.createSpyObj('HomeService', [
        'initializeAppForUser',
      ]);
      const mockLastPreferenceData = {
        required: false,
        primaryEmail: {
          lastUpdatedDate: '2023-03-29T21:01:27',
          partyContactId: '70720357-e465-450a-a658-e9a1025913d6',
          email: 'jeni.anna@voya.com',
          lastFailedInd: 'N',
        },
        secondaryEmailAllowed: false,
        docDeliveryEmailContactId: '70720357-e465-450a-a658-e9a1025913d6',
        mobilePhone: {
          lastUpdatedDate: '2022-05-24T20:32:10',
          partyContactId: '15a2fbad-ff98-4baf-bfd7-c77d729165b8',
          phoneNumber: '1111111111',
        },
        lastPreferenceResponse: true,
        insightsNotificationPrefs: {},
        highPrioitytNotificationPrefs: {},
        accountAlertPrefs: {},
      };
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkLastPreferenceUpdated',
      ]);
      accessServiceSpy.checkLastPreferenceUpdated.and.returnValue(
        Promise.resolve({...mockLastPreferenceData})
      );
      TestBed.configureTestingModule({
        declarations: [LandingPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: HeaderFooterTypeService,
            useValue: headerFooterTypeServiceSpy,
          },
          {provide: AuthenticationService, useValue: authServiceSpy},
          {provide: LandingService, useValue: landingServiceSpy},
          {provide: ActivatedRoute, useValue: activeRouteSpy},
          {provide: LoadingController, useValue: loadingControllerSpy},
          {provide: HomeService, useValue: homeServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LandingPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to authenticationChange$ and biometricsAuthenticationChange$', () => {
      expect(authServiceSpy.authenticationChange$.subscribe).toHaveBeenCalled();
      expect(
        authServiceSpy.biometricsAuthenticationChange$.subscribe
      ).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    let landingContent;

    beforeEach(() => {
      landingContent = {
        MobileLaunchContent: [
          {
            login_description: {
              description: 'desc',
              image_url: 'img',
              link_name: 'test',
              link_url: 'https://test.com',
            },
            login_section: 'test',
            login_title: 'title',
            status: Status.notStarted,
          },
        ],
      };
      landingServiceSpy.getLandingContent.and.returnValue(
        Promise.resolve(landingContent)
      );

      spyOn(component, 'checkOldSessionAndRevoke');
      spyOn(component, 'checkFaceIdSession');
    });

    it('should set up header and footer', fakeAsync(() => {
      component.ionViewWillEnter();

      expect(headerFooterTypeServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.none,
        },
        {
          type: FooterType.none,
        }
      );
    }));

    it('should attempt faceID login and clear old (non-faceid) session if first time load and noAutoLogin is false', async () => {
      activeRouteSpy.queryParams = of({});
      component.firstTimeLoad = true;

      await component.ionViewWillEnter();

      expect(authServiceSpy.attemptFaceIDLogin).toHaveBeenCalled();
      expect(component.firstTimeLoad).toBeFalse();
      expect(component.checkFaceIdSession).toHaveBeenCalled();
      expect(component.checkOldSessionAndRevoke).toHaveBeenCalled();
    });

    it('should not attempt faceID login and clear old (non-faceid) session if not first time load', async () => {
      activeRouteSpy.queryParams = of({});
      component.firstTimeLoad = false;

      await component.ionViewWillEnter();

      expect(authServiceSpy.attemptFaceIDLogin).not.toHaveBeenCalled();
      expect(component.checkOldSessionAndRevoke).not.toHaveBeenCalled();
    });

    it('should not attempt faceID login and clear old (non-faceid) session if noAutoLogin is true', async () => {
      activeRouteSpy.queryParams = of({noAutoLogin: 'true'});
      component.firstTimeLoad = false;

      await component.ionViewWillEnter();

      expect(authServiceSpy.attemptFaceIDLogin).not.toHaveBeenCalled();
      expect(component.checkOldSessionAndRevoke).not.toHaveBeenCalled();
    });

    it('should load landing steps', async () => {
      await component.ionViewWillEnter();
      expect(landingServiceSpy.getLandingContent).toHaveBeenCalled();
      expect(component.landingSteps).toEqual(
        landingContent.MobileLaunchContent
      );
      expect(landingContent.MobileLaunchContent[0].status).toEqual(
        Status.completed
      );

      expect(component.pageWidth).toEqual(window.innerWidth * 0.8 + 'px');
    });

    it('should get proper biometrics icon', async () => {
      authServiceSpy.getBiometricsIconName.and.returnValue(
        Promise.resolve('TEST_ICON')
      );
      authServiceSpy.getBiometricsLabel.and.returnValue(
        Promise.resolve('TEST_BIO_TEXT')
      );

      await component.ionViewWillEnter();

      expect(authServiceSpy.getBiometricsIconName).toHaveBeenCalled();
      expect(authServiceSpy.getBiometricsLabel).toHaveBeenCalled();
      expect(component.biometricsIcon).toEqual('TEST_ICON');
      expect(component.biometricsText).toEqual('TEST_BIO_TEXT');
    });

    it('should call openVersionAlert', async () => {
      await component.ionViewWillEnter();

      expect(landingServiceSpy.openVersionAlert).toHaveBeenCalled();
    });
  });

  describe('checkFaceIdSession', () => {
    it('should set hasFaceIdSession to true if has session', async () => {
      authServiceSpy.hasFaceIDSession.and.returnValue(Promise.resolve(true));

      await component.checkFaceIdSession();

      expect(component.hasFaceIDSession).toBeTrue();
    });

    it('should set hasFaceIdSession to false if has no session', async () => {
      authServiceSpy.hasFaceIDSession.and.returnValue(Promise.resolve(false));

      await component.checkFaceIdSession();

      expect(component.hasFaceIDSession).toBeFalse();
    });

    it('should set hasFaceIdSession to false if error', async () => {
      authServiceSpy.hasFaceIDSession.and.callFake(() => Promise.reject());

      await component.checkFaceIdSession();

      expect(component.hasFaceIDSession).toBeFalse();
    });
  });

  describe('biometricsAuthenticationChanged', () => {
    it('should call event tracking if isAuth', () => {
      component.biometricsAuthenticationChanged(true);
      expect(homeServiceSpy.initializeAppForUser).toHaveBeenCalled();
    });
    it('should not call eventTracking if not auth', () => {
      component.biometricsAuthenticationChanged(false);
      expect(homeServiceSpy.initializeAppForUser).not.toHaveBeenCalled();
    });
  });

  describe('authenticationChanged', () => {
    let loaderSpy;
    beforeEach(() => {
      loaderSpy = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loaderSpy));
      landingServiceSpy.validateApplication.and.returnValue(
        Promise.resolve(true)
      );
    });

    it('if auth and not attested, it should show loader and check checkMyvoyageAccess and shouldShowBiometricsScreen route to biometrics page if both yes', async () => {
      landingServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: '',
          clientId: '',
          clientName: '',
          enableMyVoyage: 'Y',
        })
      );
      authServiceSpy.shouldShowBiometricsScreen.and.returnValue(
        Promise.resolve(true)
      );

      await component.authenticationChanged({auth: true, attested: false});

      expect(loadingControllerSpy.create).toHaveBeenCalledWith({
        translucent: true,
      });
      expect(loaderSpy.present).toHaveBeenCalled();
      expect(loaderSpy.dismiss).toHaveBeenCalled();
      expect(landingServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(authServiceSpy.onAuthChange).toHaveBeenCalledWith({
        auth: true,
        attested: true,
      });
      expect(authServiceSpy.shouldShowBiometricsScreen).toHaveBeenCalled();
      expect(homeServiceSpy.initializeAppForUser).toHaveBeenCalled();
      expect(landingServiceSpy.navigateByUrl).toHaveBeenCalledWith(
        'biometrics'
      );
    });

    it('if auth and not attested, it should show loader and check checkMyvoyageAccess is yes and shouldShowBiometricsScreen is no and route to home page', async () => {
      landingServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: '',
          clientId: '',
          clientName: '',
          enableMyVoyage: 'Y',
        })
      );
      authServiceSpy.shouldShowBiometricsScreen.and.returnValue(
        Promise.resolve(false)
      );

      await component.authenticationChanged({auth: true, attested: false});

      expect(authServiceSpy.navigateToLoggedInLanding).toHaveBeenCalled();
    });

    it('if auth and not attested, should check app integrity and show alert, logout, and return if not valid', async () => {
      landingServiceSpy.validateApplication.and.returnValue(
        Promise.resolve(false)
      );
      spyOn(window, 'alert');

      await component.authenticationChanged({auth: true, attested: false});

      expect(authServiceSpy.logoutAndRevoke).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(pageText.failedAttest);
      expect(loaderSpy.dismiss).toHaveBeenCalled();
      expect(landingServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
    });

    it('if auth and not attested, should check checkMyvoyageAccess and route to no access page if no', async () => {
      landingServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: '',
          clientId: '',
          clientName: '',
          enableMyVoyage: 'N',
        })
      );

      await component.authenticationChanged({auth: true, attested: false});

      expect(landingServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(landingServiceSpy.navigateByUrl).toHaveBeenCalledWith('no-access');
      expect(accessServiceSpy.checkLastPreferenceUpdated).toHaveBeenCalled();
    });

    it('should not do anything if not auth', () => {
      component.authenticationChanged({auth: false, attested: false});

      expect(loadingControllerSpy.create).not.toHaveBeenCalled();
      expect(landingServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
      expect(landingServiceSpy.navigateByUrl).not.toHaveBeenCalledWith(
        'no-access'
      );
    });

    it('should not do anything if attested', () => {
      component.authenticationChanged({auth: true, attested: true});

      expect(loadingControllerSpy.create).not.toHaveBeenCalled();
      expect(landingServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
      expect(landingServiceSpy.navigateByUrl).not.toHaveBeenCalledWith(
        'no-access'
      );
    });
  });

  describe('checkOldSessionAndRevoke', () => {
    it('should check for old, non-faceid, session and revoke if it has one', async () => {
      await authServiceSpy.hasNonFaceIDSession.and.returnValue(
        Promise.resolve(true)
      );

      await component.checkOldSessionAndRevoke();
      expect(authServiceSpy.logoutAndRevoke).toHaveBeenCalled();
    });

    it('should check for old, non-faceid, session and do nothing if has none', async () => {
      authServiceSpy.hasNonFaceIDSession.and.returnValue(
        Promise.resolve(false)
      );

      await component.checkOldSessionAndRevoke();
      expect(authServiceSpy.logoutAndRevoke).not.toHaveBeenCalled();
    });
  });

  describe('signInClicked', () => {
    it('should start authentication flow', async () => {
      spyOn(component, 'checkFaceIdSession');
      const loaderSpy = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loaderSpy));

      await component.signInClicked();

      expect(loadingControllerSpy.create).toHaveBeenCalledWith({
        translucent: true,
      });
      expect(loaderSpy.present).toHaveBeenCalled();
      expect(authServiceSpy.openLogin).toHaveBeenCalled();
      expect(component.checkFaceIdSession).toHaveBeenCalled();
      expect(loaderSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('registerClicked', () => {
    it('should call openRegister', async () => {
      spyOn(component, 'checkFaceIdSession');
      const loaderSpy = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loaderSpy));

      await component.registerClicked();

      expect(loaderSpy.present).toHaveBeenCalled();
      expect(authServiceSpy.openRegister).toHaveBeenCalled();
      expect(component.checkFaceIdSession).toHaveBeenCalled();
      expect(loaderSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('loginFaceID', () => {
    it('should call authservice and attempt faceid login', () => {
      component.loginFaceID();
      expect(authServiceSpy.attemptFaceIDLogin).toHaveBeenCalled();
    });
  });

  describe('setSwiperInstance', () => {
    it('should set slides to swiper', () => {
      component.slides = undefined;
      const swiper = new Swiper(undefined, undefined);
      component.setSwiperInstance(swiper);
      expect(component.slides).toEqual(swiper);
    });
  });

  describe('openLink', () => {
    it('should open in app browser', () => {
      component.openLink('https://www.google.com');
      expect(landingServiceSpy.openInBrowser).toHaveBeenCalledWith(
        'https://www.google.com'
      );
    });
  });

  describe('handleSlideChange', () => {
    let runSpy;
    let landingSteps;

    beforeEach(() => {
      runSpy = spyOn(component['ngZone'], 'run').and.callFake(f => f());

      landingSteps = [];
      for (let i = 0; i < 5; i++) {
        const step = {
          status: Status.notStarted,
        } as LaunchContentPage;
        landingSteps.push(step);
      }
      component.landingSteps = landingSteps;
    });

    it('should call ngZone run to run the function in the zone', () => {
      component.slides = {activeIndex: 0} as any;

      component.handleSlideChange();
      expect(runSpy).toHaveBeenCalled();
    });

    it('should update the current step using slides active index', () => {
      component.slides = {activeIndex: 2} as any;

      component.currentStep = 1;
      component.handleSlideChange();
      expect(component.currentStep).toEqual(2);
    });

    it('should update the current step status to complete and higher step to inactive in case of swiping backwards', () => {
      component.slides = {activeIndex: 1} as any;
      landingSteps[2].status = Status.completed;

      component.handleSlideChange();
      expect(component.landingSteps[1].status).toEqual(Status.completed);
      expect(component.landingSteps[2].status).toEqual(Status.notStarted);
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
