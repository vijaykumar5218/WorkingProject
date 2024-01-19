import {TestBed} from '@angular/core/testing';
import {SharedUtilityService} from '../utility/utility.service';
import {ModalPresentationService} from './modal-presentation.service';

describe('ModalPresentationService', () => {
  let service: ModalPresentationService;
  let utilityServiceSpy;
  let modal;

  beforeEach(() => {
    utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
      'setSuppressHeaderFooter',
    ]);

    TestBed.configureTestingModule({
      imports: [],
      providers: [{provide: SharedUtilityService, useValue: utilityServiceSpy}],
    }).compileComponents();
    service = TestBed.inject(ModalPresentationService);
    modal = jasmine.createSpyObj('modal', ['present', 'dismiss']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should present the modal when subject is called', () => {
    service['isPresenting'] = undefined;
    service['showModal'].next(modal);
    expect(service['isPresenting']).toBeTrue();
    expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
      true
    );
    expect(modal.present).toHaveBeenCalled();
  });

  describe('present', () => {
    beforeEach(() => {
      spyOn(service['showModal'], 'next');
    });

    it('should add the modal to the array and call next if not currently presenting', () => {
      service['modals'] = [];
      service['isPresenting'] = false;
      service.present(modal);
      expect(service['modals']).toEqual([modal]);
      expect(service['showModal'].next).toHaveBeenCalledWith(modal);
    });

    it('should not call next if already presenting', () => {
      service['isPresenting'] = true;
      service.present(modal);
      expect(service['showModal'].next).not.toHaveBeenCalled();
    });
  });

  describe('dismiss', () => {
    let modals;
    let modal2;

    beforeEach(() => {
      modal2 = jasmine.createSpyObj('modal2', ['']);
      modals = [modal, modal2];
      service['modals'] = modals;
      spyOn(service['showModal'], 'next');
    });

    it('should dismiss the modal and remove it from the array', () => {
      service.dismiss();
      expect(modal.dismiss).toHaveBeenCalled();
      expect(modals).toEqual([modal2]);
    });

    it('should show the next modal if there is one', () => {
      service.dismiss();
      expect(service['showModal'].next).toHaveBeenCalledWith(modal2);
    });

    it('should show the header and set presenting to false if there is no next modal', () => {
      service['modals'] = [modal];
      service['isPresenting'] = true;
      service.dismiss();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        false
      );
      expect(service['isPresenting']).toBeFalse();
    });
  });
});
