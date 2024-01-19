import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {ContactCoachPopupComponent} from './contact-coach-popup.component';
import {AccountService} from '@shared-lib/services/account/account.service';

describe('ContactCoachPopupComponent', () => {
  let component: ContactCoachPopupComponent;
  let fixture: ComponentFixture<ContactCoachPopupComponent>;
  const journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
    'openWebView',
  ]);
  const modalControllerSpy = jasmine.createSpyObj('ModalController', [
    'dismiss',
  ]);
  const accountServiceSpy = jasmine.createSpyObj('AccountService', [
    'openPwebAccountLink',
  ]);
  const navParamSpy = jasmine.createSpyObj('NavParams', ['get']);
  const mockScreenMessage = {
    HealthCoachHeader: 'Health Coach',
    AccountRecoveryDisclosure:
      '<p>Do you use a Financial Aggregation Service?<br />\r\nIf you use an aggregation service such as CashEdge or Personal Capital, you may receive verification code(s) via text or email when your provider accesses this account. If you receive a code, please go to your aggregation service site and reconnect to this account to ensure continued access by your provider.</p>\r\n',
    TimetapURL: '/timetapURL',
    WealthCoachHeader: 'Wealth Coach',
    HealthCoachDesc:
      'Schedule time with a professional today. Same-day appointments are available.\r\n',
    ContactCoachDisclosure: 'TBD',
    WealthCoachDesc:
      'Schedule time with a professional today. Same-day appointments are available.',
    WealthCoachStatementText: 'text',
  };
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContactCoachPopupComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: NavParams, useValue: navParamSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ContactCoachPopupComponent);
      component = fixture.componentInstance;
      component.screenMessage = mockScreenMessage;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('when suppressAppointment will be false', () => {
      component.settingsDisplayFlags = {
        displayContactLink: true,
        suppressAppointment: false,
        pwebStatementUrl: '/url',
      };
      component.ngOnInit();
      expect(component.screenMessage.WealthCoachStatementText).toEqual('');
    });
    it('when suppressAppointment will be true', () => {
      component.settingsDisplayFlags = {
        displayContactLink: true,
        suppressAppointment: true,
        pwebStatementUrl: '/url',
      };
      component.ngOnInit();
      expect(component.screenMessage).toBeDefined();
    });
  });

  describe('openTimeTapUrl', () => {
    it('when suppressAppointment would be false', () => {
      component.settingsDisplayFlags = {
        displayContactLink: true,
        suppressAppointment: false,
        pwebStatementUrl: '/url',
      };
      component.openTimeTapUrl();
      expect(journeyServiceSpy.openWebView).toHaveBeenCalledWith('/timetapURL');
    });
    it('when suppressAppointment would be true', () => {
      component.settingsDisplayFlags = {
        displayContactLink: true,
        suppressAppointment: true,
        pwebStatementUrl: '/url',
      };
      component.openTimeTapUrl();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        '/url'
      );
    });
  });

  describe('closeDialog', () => {
    it('should call closeDialog', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
