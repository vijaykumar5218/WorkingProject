import {fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {SessionTimeoutService} from './session-timeout.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NavigationEnd, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {WebLogoutService} from '../logout/logout.service';
import {of, Subscription} from 'rxjs';
import {SessionTimeoutPopupComponent} from '../../components/session-timeout-popup/session-timeout-popup.component';

describe('SessionTimeoutService', () => {
  let service: SessionTimeoutService;
  let modalControllerSpy;
  let modalSpy;
  let routerSpy;
  let logoutServiceSpy;
  let sharedUtilityServiceSpy;
  let baseServiceSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      modalSpy = jasmine.createSpyObj('modalSpy', ['present', 'onDidDismiss']);
      modalSpy.present.and.returnValue(Promise.resolve(true));
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl'], {
        events: of(new NavigationEnd(0, '/no-access', '/no-access')),
      });
      logoutServiceSpy = jasmine.createSpyObj('logoutServiceSpy', [
        'action',
        'getTerminatedUser',
      ]);
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['appendBaseUrlToEndpoints']
      );
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: Router, useValue: routerSpy},
          {provide: WebLogoutService, useValue: logoutServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
        ],
      });
      service = TestBed.inject(SessionTimeoutService);
      service['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('watcherInitiated', () => {
    beforeEach(() => {
      spyOn(service, 'setEventListener');
      spyOn(service, 'pingServer');
      spyOn(service, 'setWarningCountDown');
      spyOn(service, 'pingServerOnPageLoad');
      spyOn(service, 'killWarningCountDown');
      spyOn(service, 'killSessionExpiringCountDown');
      service.isSecurePage = true;
    });
    it('should call setEventListener, setWarningCountDown, pingServerOnPageLoad', () => {
      logoutServiceSpy.getTerminatedUser.and.returnValue(of(false));
      service.watcherInitiated();
      expect(service.setEventListener).toHaveBeenCalled();
      expect(service.setWarningCountDown).toHaveBeenCalled();
      expect(service.pingServerOnPageLoad).toHaveBeenCalled();
    });
    it('when isSecurePage will be true', () => {
      logoutServiceSpy.getTerminatedUser.and.returnValue(of(false));
      service.watcherInitiated();
      expect(service.killWarningCountDown).not.toHaveBeenCalled();
      expect(service.killSessionExpiringCountDown).not.toHaveBeenCalled();
      expect(logoutServiceSpy.getTerminatedUser).toHaveBeenCalled();
    });
    it('when isSecurePage will be true', () => {
      const observable = of(true);
      const subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscription;
      });
      logoutServiceSpy.getTerminatedUser.and.returnValue(observable);
      service.watcherInitiated();
      expect(service.killWarningCountDown).toHaveBeenCalled();
      expect(service.killSessionExpiringCountDown).toHaveBeenCalled();
      expect(service.isSecurePage).toEqual(false);
      expect(service['subscription'].add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('setWarningCountDown', () => {
    it('should call openWarningModal', fakeAsync(() => {
      spyOn(service, 'openWarningModal');
      service.warningTimerAmount = 100;
      service.setWarningCountDown();
      tick(100);
      expect(service.openWarningModal).toHaveBeenCalled();
    }));
  });

  describe('killWarningCountDown', () => {
    beforeEach(() => {
      spyOn(window, 'clearTimeout');
    });
    it('should call clearTimeout', () => {
      service.warningTimer = setTimeout(() => {
        console.log('test');
      }, 10);
      service.killWarningCountDown();
      expect(window.clearTimeout).toHaveBeenCalledWith(service.warningTimer);
    });
  });

  describe('setSessionExpiringCountDown', () => {
    beforeEach(() => {
      spyOn(service, 'setSessionExpiringCounter');
    });
    it('should call setSessionExpiringCounter', fakeAsync(() => {
      service.expiringCountDownAmount = 1;
      service.setSessionExpiringCountDown();
      tick(119);
      service.killSessionExpiringCountDown();
      expect(service.setSessionExpiringCounter).toHaveBeenCalledWith('00:02');
    }));
    it('should navigate navigateByUrl & call killSessionExpiringCountDown', fakeAsync(() => {
      service.expiringCountDownAmount = 1;
      service.setSessionExpiringCountDown();
      tick(121);
      service.killSessionExpiringCountDown();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/session-timeout');
    }));
  });

  describe('timeTransform', () => {
    it('should get result', () => {
      const result = service.timeTransform(120);
      expect(result).toEqual('02:00');
    });
  });

  describe('openWarningModal', () => {
    beforeEach(() => {
      spyOn(service, 'setSessionExpiringCounter');
      spyOn(service, 'setSessionExpiringCountDown');
    });
    it('should open SessionTimeoutPopupComponent modal and present it', async () => {
      modalSpy.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );
      await service.openWarningModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: SessionTimeoutPopupComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          saveFunction: jasmine.any(Function),
        },
        backdropDismiss: false,
      });
      expect(modalSpy.present).toHaveBeenCalled();
      expect(service.setSessionExpiringCounter).toHaveBeenCalledWith('2:00');
      expect(service.setSessionExpiringCountDown).toHaveBeenCalled();
    });
    it('saveFunction', async () => {
      modalSpy.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );
      await service.openWarningModal();
      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;
      const result = await saveFunction();
      expect(result).toEqual(true);
    });
    describe('onDidDismiss', () => {
      it('should call logoutService.action when saved would be false', async () => {
        modalSpy.onDidDismiss.and.returnValue(
          Promise.resolve({
            data: {
              saved: false,
            },
          })
        );
        await service.openWarningModal();
        expect(logoutServiceSpy.action).toHaveBeenCalled();
        expect(service.isOpenWarningModal).toEqual(false);
      });
      it('should call logoutService.action when saved would be true', async () => {
        spyOn(service, 'pingServer');
        modalSpy.onDidDismiss.and.returnValue(
          Promise.resolve({
            data: {
              saved: true,
            },
          })
        );
        await service.openWarningModal();
        expect(service.pingServer).toHaveBeenCalled();
        expect(service.isOpenWarningModal).toEqual(false);
      });
    });
  });

  describe('pingServer', () => {
    beforeEach(() => {
      spyOn(service, 'killWarningCountDown');
      spyOn(service, 'killSessionExpiringCountDown');
      spyOn(service, 'setWarningCountDown');
    });
    it('when isSecurePage will be false', async () => {
      service.isSecurePage = false;
      await service.pingServer();
      expect(service.killWarningCountDown).not.toHaveBeenCalled();
      expect(service.killSessionExpiringCountDown).not.toHaveBeenCalled();
      expect(service.setWarningCountDown).not.toHaveBeenCalled();
    });
    describe('when isSecurePage will be true', () => {
      beforeEach(() => {
        service.isSecurePage = true;
      });
      it("when status would be 'OK'", async () => {
        baseServiceSpy.get.and.returnValue(Promise.resolve({status: 'OK'}));
        await service.pingServer();
        expect(service.killWarningCountDown).toHaveBeenCalled();
        expect(service.killSessionExpiringCountDown).toHaveBeenCalled();
        expect(service.setWarningCountDown).toHaveBeenCalled();
      });
      it("when status would be 'notOK'", async () => {
        baseServiceSpy.get.and.returnValue(Promise.resolve({status: 'notOK'}));
        await service.pingServer();
        expect(service.killWarningCountDown).toHaveBeenCalled();
        expect(service.killSessionExpiringCountDown).toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          '/session-timeout'
        );
      });
    });
  });

  describe('setEventListener', () => {
    beforeEach(() => {
      spyOn(window.document.body, 'addEventListener');
    });
    it('should call addEventListener', () => {
      service.setEventListener();
      expect(window.document.body.addEventListener).toHaveBeenCalled();
    });
  });

  describe('handleEvent', () => {
    let e;
    beforeEach(() => {
      e = {
        target: {
          getAttribute: jasmine.createSpy(),
        },
      };
    });
    it('when type would be submit', () => {
      e.target.getAttribute.and.returnValue('submit');
      const result = service.handleEvent(e);
      expect(result).toEqual(true);
    });
    describe('when type would not be submit', () => {
      beforeEach(() => {
        e.target.getAttribute.and.returnValue(undefined);
        spyOn(service.pingChanged, 'next');
      });
      it('when isOpenWarningModal would be false', () => {
        service.isOpenWarningModal = false;
        service.handleEvent(e);
        expect(service.pingChanged.next).toHaveBeenCalledWith(true);
      });
      it('when isOpenWarningModal would be true', () => {
        service.isOpenWarningModal = true;
        service.handleEvent(e);
        expect(service.pingChanged.next).not.toHaveBeenCalled();
      });
    });
  });

  describe('pingServerOnPageLoad', () => {
    beforeEach(() => {
      spyOn(service, 'pingServer');
    });
    it('when isOnLoad would be true', () => {
      service.isOnLoad = true;
      service.pingServerOnPageLoad();
      expect(service.pingServer).toHaveBeenCalled();
      expect(service.isOnLoad).toEqual(false);
    });
    it('when isOnLoad would be false', () => {
      service.isOnLoad = false;
      service.pingServerOnPageLoad();
      expect(service.pingServer).not.toHaveBeenCalled();
      expect(service.isOnLoad).toEqual(false);
    });
  });

  describe('setSessionExpiringCounter & getSessionExpiringCounter', () => {
    it('should return data', done => {
      service.setSessionExpiringCounter('02:00');
      service.getSessionExpiringCounter().subscribe(data => {
        expect(data).toEqual('02:00');
        done();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
