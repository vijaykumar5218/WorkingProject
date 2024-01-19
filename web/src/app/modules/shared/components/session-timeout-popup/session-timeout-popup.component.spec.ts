import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SessionTimeoutService} from '../../services/session-timeout/session-timeout.service';
import {SessionTimeoutPopupComponent} from './session-timeout-popup.component';
import {of, Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';

describe('FooterComponent', () => {
  let component: SessionTimeoutPopupComponent;
  let fixture: ComponentFixture<SessionTimeoutPopupComponent>;
  let sessionTimeoutServiceSpy;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      sessionTimeoutServiceSpy = jasmine.createSpyObj(
        'sessionTimeoutServiceSpy',
        ['getSessionExpiringCounter']
      );
      modalControllerSpy = jasmine.createSpyObj('modalControllerSpy', [
        'dismiss',
      ]);
      TestBed.configureTestingModule({
        declarations: [SessionTimeoutPopupComponent],
        providers: [
          {provide: SessionTimeoutService, useValue: sessionTimeoutServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
        imports: [],
      }).compileComponents();
      fixture = TestBed.createComponent(SessionTimeoutPopupComponent);
      sessionTimeoutServiceSpy.getSessionExpiringCounter.and.returnValue({
        subscribe: () => undefined,
      });
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      observable = of('02:00');
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f('02:00');
        return subscription;
      });
      sessionTimeoutServiceSpy.getSessionExpiringCounter.and.returnValue(
        observable
      );
    });
    it('should call getSessionExpiringCounter', () => {
      component.ngOnInit();
      expect(component.counter).toEqual('02:00');
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
      expect(
        sessionTimeoutServiceSpy.getSessionExpiringCounter
      ).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('should call modalController.dismiss', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalledWith({
        saved: false,
      });
    });
  });

  describe('closeDialogClicked', () => {
    beforeEach(() => {
      spyOn(component, 'closeDialog');
    });
    describe('when save will be true', () => {
      it('when saveFunction will be defined', async () => {
        component.saveFunction = jasmine
          .createSpy()
          .and.returnValue(Promise.resolve(true));
        await component.closeDialogClicked(true);
        expect(component.closeDialog).toHaveBeenCalledWith(true);
      });
      it('when saveFunction will not be defined', async () => {
        component.saveFunction = undefined;
        await component.closeDialogClicked(true);
        expect(component.closeDialog).toHaveBeenCalled();
      });
    });
    it('when save will be false', async () => {
      await component.closeDialogClicked(false);
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
