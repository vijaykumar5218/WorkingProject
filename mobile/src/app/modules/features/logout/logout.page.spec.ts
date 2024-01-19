import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, LoadingController} from '@ionic/angular';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {AuthenticationService} from '../../shared/service/authentication/authentication.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {LogoutPage} from './logout.page';
import {LogoutService} from './service/logout.service';
import {LandingService} from '../landing/service/landing.service';

describe('LogoutPage', () => {
  let component: LogoutPage;
  let fixture: ComponentFixture<LogoutPage>;
  let headerFootertypeSpy;
  let authServiceSpy;
  let logoutServiceSpy;
  let logoutContent;
  let landingServiceSpy;
  let baseServiceSpy;
  let loadingControllerSpy;

  beforeEach(
    waitForAsync(() => {
      headerFootertypeSpy = jasmine.createSpyObj('HeaderFooterTypeService', [
        'publishType',
      ]);
      authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['login']);
      authServiceSpy = jasmine.createSpyObj(
        'AuthService',
        [
          'openLogin',
          'attemptFaceIDLogin',
          'hasFaceIDSession',
          'openLogin',
          'openRegister',
          'hasNonFaceIDSession',
          'logoutAndRevoke',
          'getBiometricsIconName',
          'getBiometricsLabel',
        ],
        {
          authenticationChange$: jasmine.createSpyObj('AuthChangeObservable', [
            'subscribe',
          ]),
          reloading: true,
        }
      );
      loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
        'create',
      ]);
      logoutServiceSpy = jasmine.createSpyObj('LogoutService', [
        'getLogoutContent',
      ]);
      landingServiceSpy = jasmine.createSpyObj('LandingService', [
        'checkMyvoyageAccess',
      ]);
      baseServiceSpy = jasmine.createSpyObj('BaseService', ['navigateByUrl']);

      TestBed.configureTestingModule({
        declarations: [LogoutPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderFooterTypeService, useValue: headerFootertypeSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
          {provide: LogoutService, useValue: logoutServiceSpy},
          {provide: LandingService, useValue: landingServiceSpy},
          {provide: LoadingController, useValue: loadingControllerSpy},
          {provide: BaseService, useValue: baseServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LogoutPage);
      component = fixture.componentInstance;

      logoutContent = {
        image_url: 'a',
        timeOutMessage: 'b',
        timeOutMessage1: 'c',
        timeOutMessage2: 'd',
      };
      logoutServiceSpy.getLogoutContent.and.returnValue(
        Promise.resolve(logoutContent)
      );

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load logout page content', () => {
      expect(logoutServiceSpy.getLogoutContent).toHaveBeenCalled();
      expect(component.logoutContent).toEqual(logoutContent);
    });
  });

  describe('authenticationChanged', () => {
    let loaderSpy;
    beforeEach(() => {
      loaderSpy = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loaderSpy));
    });

    it('if auth and not attested, it should show loader and check checkMyvoyageAccess is yes and route to home page', async () => {
      landingServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: '',
          clientId: '',
          clientName: '',
          enableMyVoyage: 'Y',
        })
      );

      await component.authenticationChanged({auth: true, attested: false});

      expect(baseServiceSpy.navigateByUrl).toHaveBeenCalledWith('home');
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
      expect(baseServiceSpy.navigateByUrl).toHaveBeenCalledWith('no-access');
    });

    it('should not do anything if not auth', () => {
      component.authenticationChanged({auth: false, attested: false});

      expect(loadingControllerSpy.create).not.toHaveBeenCalled();
      expect(landingServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
      expect(baseServiceSpy.navigateByUrl).not.toHaveBeenCalledWith(
        'no-access'
      );
    });

    it('should not do anything if attested', () => {
      component.authenticationChanged({auth: true, attested: true});

      expect(loadingControllerSpy.create).not.toHaveBeenCalled();
      expect(landingServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
      expect(baseServiceSpy.navigateByUrl).not.toHaveBeenCalledWith(
        'no-access'
      );
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set the reloading property from auth service', () => {
      component.reloading = false;
      component.ionViewWillEnter();
      expect(component.reloading).toBeTrue();
    });
  });

  describe('ionViewDidEnter', () => {
    it('should remove header and footerm and set hasFaceIDSession properly', async () => {
      await component.ionViewDidEnter();
      expect(headerFootertypeSpy.publishType).toHaveBeenCalledWith(
        {type: HeaderType.none},
        {type: FooterType.none}
      );
    });
  });

  describe('signInClicked', () => {
    it('should call auth service signin', () => {
      component.signInClicked();
      expect(authServiceSpy.openLogin).toHaveBeenCalled();
    });
  });
});
