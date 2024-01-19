import {TestBed} from '@angular/core/testing';
import {ModalController} from '@ionic/angular';
import {NativeSettingsService} from './native-settings.service';
import {CardModalComponent} from '@shared-lib/components/coverages/plan-tabs/plan-details/my-id-card/card-modal/card-modal.component';

describe('NativeSettingsService', () => {
  let modalControllerSpy;
  let service;

  beforeEach(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', [
      'dismiss',
      'create',
    ]);
    TestBed.configureTestingModule({
      imports: [],
      providers: [{provide: ModalController, useValue: modalControllerSpy}],
    });
    service = TestBed.inject(NativeSettingsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('showModal', () => {
    let modalSpy;

    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });

    it('should open modal', async () => {
      const componentProps = {component: 'props'};
      await service['showModal'](componentProps);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: CardModalComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: componentProps,
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('checkNotificationStatus', () => {
    let pushPermissionSpy;
    beforeEach(() => {
      pushPermissionSpy = jasmine.createSpyObj('PushNotifications', [
        'checkPushPermissions',
      ]);
      service['pushPermission'] = pushPermissionSpy;
    });

    it('should call pushPermission.checkPushPermissions and return the result', async () => {
      pushPermissionSpy.checkPushPermissions.and.returnValue(
        Promise.resolve({result: true})
      );
      const result = await service.checkNotificationStatus();
      expect(pushPermissionSpy.checkPushPermissions).toHaveBeenCalled();
      expect(result).toBeTrue();
    });
  });

  describe('createAndShowModal', () => {
    const modalProps = {
      yesText: 'Yes',
      description:
        'By clicking yes, you will be redirected to OS settings to turn on push notifications.',
      header: 'Enable Notifications',
      redirectToSetting: true,
    };

    beforeEach(() => {
      service['showModal'] = jasmine.createSpy();
    });

    it('should call showModal', async () => {
      await service.createAndShowModal();
      expect(service['showModal']).toHaveBeenCalledWith(modalProps);
    });
  });
});
