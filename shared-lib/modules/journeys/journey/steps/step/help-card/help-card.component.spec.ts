import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {HelpCardComponent} from './help-card.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {of, Subscription} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';

describe('HelpCardComponent', () => {
  let component: HelpCardComponent;
  let fixture: ComponentFixture<HelpCardComponent>;
  let journeyServiceSpy;
  let utilityServiceSpy;
  let accountInfoServiceSpy;
  let settingsServiceSpy;
  let accountServiceSpy;
  let mockSettingsDisplayFlags;
  let mockMessage;

  beforeEach(
    waitForAsync(() => {
      mockSettingsDisplayFlags = {
        displayContactLink: true,
        suppressAppointment: true,
        pwebStatementUrl: '/url',
      };
      mockMessage = {
        HealthCoachHeader: 'Health Coach',
        AccountRecoveryDisclosure:
          '<p>Do you use a Financial Aggregation Service?<br />\r\nIf you use an aggregation service such as CashEdge or Personal Capital, you may receive verification code(s) via text or email when your provider accesses this account. If you receive a code, please go to your aggregation service site and reconnect to this account to ensure continued access by your provider.</p>\r\n',
        TimetapURL:
          '<p><a href="https://fpcconsultants.timetap.com/#/" target="_blank">https://fpcconsultants.timetap.com/#/</a></p>\r\n',
        WealthCoachHeader: 'Wealth Coach',
        HealthCoachDesc:
          'Schedule time with a professional today. Same-day appointments are available.\r\n',
        ContactCoachDisclosure: 'TBD',
        WealthCoachDesc:
          'Schedule time with a professional today. Same-day appointments are available.',
      };
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'openWebView',
        'openModal',
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'openPwebAccountLink',
      ]);

      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      accountInfoServiceSpy = jasmine.createSpyObj('accountInfoService', [
        'getScreenMessage',
      ]);
      settingsServiceSpy = jasmine.createSpyObj('settingsService', [
        'getSettingsDisplayFlags',
      ]);
      settingsServiceSpy.getSettingsDisplayFlags.and.returnValue(
        Promise.resolve(mockSettingsDisplayFlags)
      );
      TestBed.configureTestingModule({
        declarations: [HelpCardComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: SettingsService, useValue: settingsServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HelpCardComponent);
      component = fixture.componentInstance;
      component.element = {
        header: "We're here to help.",
        description:
          'Schedule time with a professional for a personalized plan.',
        link: 'https://fpcconsultants.timetap.com/#/',
        webviewHeader: 'fpcconsultants.timetap.com',
        imageUrl: 'assets/icon/journeys/retirement/calendar.svg',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getIsWeb and set isWeb', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toEqual(true);
    });
  });

  describe('fetchScreenContent', () => {
    let subscription;
    beforeEach(() => {
      const observable = of(mockMessage);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockMessage);
        return subscription;
      });
      accountInfoServiceSpy.getScreenMessage.and.returnValue(observable);
      spyOn(component.moreContentSubscription, 'add');
    });

    it('when supressAppointment would be false', async () => {
      component.settingsDisplayFlags = {
        displayContactLink: false,
        suppressAppointment: false,
        pwebStatementUrl: '/url',
      };
      await component.fetchScreenContent();
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.screenMessage).toEqual(mockMessage);
      expect(component.moreContentSubscription.add).toHaveBeenCalledWith(
        subscription
      );
    });
    it('when supressAppointment would be true', async () => {
      component.settingsDisplayFlags = mockSettingsDisplayFlags;
      await component.fetchScreenContent();
      expect(component.screenMessage.TimetapURL).toEqual('/url');
    });
  });

  describe('openWebView', () => {
    describe('when videoUrl will be defined', () => {
      beforeEach(() => {
        component.element = {
          header: '[Save even more]',
          description: 'Watch Video',
          videoUrl:
            'https://cdnapisec.kaltura.com/html5/html5lib/v2.97/mwEmbedFrame.php/p/1234081/uiconf_id/39075871/entry_id/1_vk5mvfhi?wid=_1234081&iframeembed=true&playerId=kaltura_player_1663254417&entry_id=1_vk5mvfhi,',
          imageUrl: 'assets/icon/journeys/retirement/calendar.svg',
          playerId: 'kaltura_player_1663254417',
        };
      });
      it('should call openModal', () => {
        component.isWeb = false;
        component.openWebView();
        expect(journeyServiceSpy.openModal).toHaveBeenCalledWith({
          element: {
            header: '[Save even more]',
            description: 'Watch Video',
            videoUrl:
              'https://cdnapisec.kaltura.com/html5/html5lib/v2.97/mwEmbedFrame.php/p/1234081/uiconf_id/39075871/entry_id/1_vk5mvfhi?wid=_1234081&iframeembed=true&playerId=kaltura_player_1663254417&entry_id=1_vk5mvfhi,',
            imageUrl: 'assets/icon/journeys/retirement/calendar.svg',
            playerId: 'kaltura_player_1663254417',
          },
        });
      });
    });
    describe('when displayContactLink will be true', () => {
      beforeEach(() => {
        component.element = {
          header: '[Save even more]',
          description: 'Watch Video',
          playerId: 'kaltura_player_1663254417',
        };
        spyOn(component, 'fetchScreenContent').and.returnValue(
          Promise.resolve()
        );
        component.settingsDisplayFlags.displayContactLink = true;
      });
      it('should call openModal if isWeb would be false', async () => {
        component.isWeb = false;
        component.screenMessage = mockMessage;
        await component.openWebView();
        expect(settingsServiceSpy.getSettingsDisplayFlags).toHaveBeenCalled();
        expect(journeyServiceSpy.openModal).toHaveBeenCalledWith({
          element: {
            id: 'contactACoach',
          },
          screenMessage: mockMessage,
          settingsDisplayFlags: mockSettingsDisplayFlags,
        });
      });
      it('should call navigateByUrl if isWeb would be true', async () => {
        spyOn(Router.prototype, 'navigateByUrl');
        component.isWeb = true;
        await component.openWebView();
        expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith(
          '/journeys/contact-a-coach'
        );
      });
    });
    describe('when settingsDisplayFlags will be false', () => {
      beforeEach(() => {
        component.element = {
          header: '[Save even more]',
          description: 'Contact a Coach',
          link: 'https://fpcconsultants.timetap.com/#/',
          imageUrl: 'assets/icon/journeys/retirement/calendar.svg',
        };
        component.settingsDisplayFlags.displayContactLink = false;
      });

      it('should call new browser tab in web appliaction', async () => {
        spyOn(window, 'open').and.returnValue(null);
        component.isWeb = true;
        await component.openWebView();
        expect(window.open).toHaveBeenCalledWith(
          'https://fpcconsultants.timetap.com/#/',
          '_blank'
        );
      });
    });

    describe('when settingsDisplayFlags will be false and open externalLink', () => {
      beforeEach(() => {
        component.element = {
          header: '[Save even more]',
          description: 'Contact a Coach',
          externalLink: 'https://fpcconsultants.timetap.com/#/',
          imageUrl: 'assets/icon/journeys/retirement/calendar.svg',
        };
        component.settingsDisplayFlags.displayContactLink = false;
      });

      it('should call new browser tab in web appliaction', async () => {
        spyOn(window, 'open').and.returnValue(null);
        component.isWeb = true;
        await component.openWebView();
        expect(window.open).toHaveBeenCalledWith(
          'https://fpcconsultants.timetap.com/#/',
          '_blank'
        );
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component.moreContentSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.moreContentSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
