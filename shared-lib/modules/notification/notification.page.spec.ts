import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {NotificationPage} from './notification.page';
import * as text from './constants/notification.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {NotificationService} from '@shared-lib/services/notification/notification.service';

describe('NotificationPage', () => {
  let component: NotificationPage;
  const pageText = JSON.parse(JSON.stringify(text)).default;

  let fixture: ComponentFixture<NotificationPage>;
  let footerTypeServiceSpy;
  let headerTypeServiceSpy;
  let notificationServiceSpy;
  let fetchSpy;
  let sharedUtilityServiceSpy;
  let activatedRouteSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);

      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
        'getNotification',
        'savePageVisit',
      ]);
      (activatedRouteSpy = {
        queryParams: of({
          previousRootPath: 'more',
        }),
      }),
        TestBed.configureTestingModule({
          declarations: [NotificationPage],
          imports: [RouterTestingModule, IonicModule.forRoot()],
          providers: [
            {provide: FooterTypeService, useValue: footerTypeServiceSpy},
            {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
            {provide: NotificationService, useValue: notificationServiceSpy},
            {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
            {provide: ActivatedRoute, useValue: activatedRouteSpy},
          ],
        }).compileComponents();

      fixture = TestBed.createComponent(NotificationPage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'getNotificationData');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getNotification if isWeb is true', () => {
      component.isWeb = true;
      component.ngOnInit();
      expect(component.getNotificationData).toHaveBeenCalled();
    });

    it('should not call getNotification if isWeb is false', () => {
      component.isWeb = false;
      component.ngOnInit();
      expect(component.getNotificationData).not.toHaveBeenCalled();
    });
    it(' should publish null', () => {
      fixture.detectChanges();
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith(null);
    });
    describe('for queryParams', () => {
      beforeEach(() => {
        component.previousRootPath = undefined;
      });
      it('when isWeb would be false', () => {
        component.isWeb = false;
        component.ngOnInit();
        expect(component.previousRootPath).toEqual(undefined);
      });
      it('when isWeb would be true', () => {
        component.isWeb = true;
        component.ngOnInit();
        expect(component.previousRootPath).toEqual('more');
      });
    });
  });

  describe('getNotificationData', () => {
    let notifData;
    beforeEach(() => {
      fetchSpy.and.callThrough();

      notifData = {
        recent: [
          {
            Category_name: 'Recent',
            Description:
              'Add in your outside accounts to power up myVoyage and get more insight into your finances.',
            Link_name: '',
            Link_url: '',
            Title: 'Add your external account',
            eventName: 'Account Aggregated',
            eventStartDt: '2022-05-31T09:22:46',
          },
        ],
        highPriority: [],
      };
      notificationServiceSpy.getNotification.and.returnValue(
        Promise.resolve(notifData)
      );
    });

    it('should call notifications service and set the notifications', async () => {
      component.notifications = undefined;
      await component.getNotificationData();
      expect(notificationServiceSpy.getNotification).toHaveBeenCalled();
      expect(component.notifications).toEqual(notifData);
      expect(notificationServiceSpy.savePageVisit).toHaveBeenCalled();
    });
  });

  describe('IonViewWillEnter', () => {
    it('should call getNotificationData', () => {
      component.ionViewWillEnter();
      expect(component.getNotificationData).toHaveBeenCalled();
    });

    it(' should publish null', () => {
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: {
          headername: pageText.pageTitle,
          btnright: false,
          btnleft: true,
          buttonLeft: {
            name: '',
            link: 'back',
          },
        },
      });
    });
  });

  describe('ngOnDestroy', () => {
    describe('when isWeb would be true', () => {
      beforeEach(() => {
        component.isWeb = true;
      });
      it('when previousRootPath would not be undefined', () => {
        component.previousRootPath = 'more';
        component.ngOnDestroy();
        expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
          type: FooterType.tabsnav,
          selectedTab: 'more',
        });
      });
      it('when previousRootPath would be undefined', () => {
        component.previousRootPath = undefined;
        component.ngOnDestroy();
        expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith(null);
      });
    });
    describe('when isWeb would be false', () => {
      beforeEach(() => {
        component.isWeb = false;
      });
      it('should publish tabsnav', () => {
        fixture.detectChanges();
        component.ngOnDestroy();
        expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
          type: FooterType.tabsnav,
        });
      });
    });
  });
});
