import {TestBed} from '@angular/core/testing';
import {AltAccessService} from './alt-access.service';

import {ModalController} from '@ionic/angular';
import {AltAccessModalComponent} from '../../components/alt-access-modal/alt-access-modal.component';

describe('AltAccessService', () => {
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
    service = TestBed.inject(AltAccessService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('createAndShowModal', () => {
    let modalSpy;
    const modalProps = {
      header:
        'You are authorized to view and model changes to myOrangeMoney. Only Participants are allowed to save these changes.',
      message:
        'Users with Dashboard capabilities will never have access to MX account data and all associated buttons/links will be disabled.',
      buttonText: 'OK',
    };

    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });

    it('should call showModal', async () => {
      await service.createAndShowModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AltAccessModalComponent,
        cssClass: 'modal-not-fullscreen',
        backdropDismiss: false,
        componentProps: modalProps,
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });
});
