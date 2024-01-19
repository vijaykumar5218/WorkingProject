import {CurrencyPipe} from '@angular/common';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PopupInputType} from './constants/popup-input-type.enum';

import {PopupInputDialogComponent} from './popup-input-dialog.component';

describe('PopupInputDialogComponent', () => {
  let component: PopupInputDialogComponent;
  let fixture: ComponentFixture<PopupInputDialogComponent>;
  let modalControllerSpy;
  let currencyPipeSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      currencyPipeSpy = jasmine.createSpyObj('CurrencyPipe', ['transform']);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'formatPhone',
      ]);
      TestBed.configureTestingModule({
        declarations: [PopupInputDialogComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: CurrencyPipe, useValue: currencyPipeSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PopupInputDialogComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should transform currency value through pipe', () => {
      component.inputType = PopupInputType.currency;
      component.value = 200;
      currencyPipeSpy.transform.and.returnValue('$200.00');
      component.ngOnInit();

      expect(currencyPipeSpy.transform).toHaveBeenCalledWith(
        200,
        'USD',
        true,
        '1.2-2'
      );
    });
  });

  describe('beforeInput', () => {
    it('should allow input that is a number', () => {
      const event = jasmine.createSpyObj('InputEvent', ['preventDefault'], {
        data: '1',
      });
      const result = component.beforeInput(event);
      expect(result).toBeTrue();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow input that is a null (backspace)', () => {
      const event = jasmine.createSpyObj('InputEvent', ['preventDefault'], {
        data: null,
      });
      const result = component.beforeInput(event);
      expect(result).toBeTrue();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should not allow input that is not a number', () => {
      const event = jasmine.createSpyObj('InputEvent', ['preventDefault'], {
        data: '-',
      });
      const result = component.beforeInput(event);
      expect(result).toBeFalse();
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('should call dismiss with "saved"=true', () => {
      component.closeDialog(true);
      expect(modalControllerSpy.dismiss).toHaveBeenCalledWith({
        saved: true,
      });
    });

    it('should call dismiss with "saved"=false', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalledWith({
        saved: false,
      });
    });
  });

  describe('getCleanedValue', () => {
    it('should remove commas from string', () => {
      const result = component.getCleanedValue('12,000');
      expect(result).toEqual('12000');
    });

    it('should just return value if it is a number', () => {
      const result = component.getCleanedValue(20);
      expect(result).toEqual(20);
    });
  });

  describe('valueChanged', () => {
    it('should call validator', () => {
      component.value = '';
      component.validator = () => {
        return 'test';
      };
      component.valueChanged('20');
      expect(component.value).toEqual('20');
      expect(component.errorText).toEqual('test');
    });

    it('when inputType would be POPUP_INPUT_PHONE', () => {
      component.value = '';
      utilityServiceSpy.formatPhone.and.returnValue('111-');
      component.valueChanged('111', 'POPUP_INPUT_PHONE');
      expect(utilityServiceSpy.formatPhone).toHaveBeenCalledWith('111');
      expect(component.value).toEqual('111-');
    });

    it('should change the value to undefined if value is undefined', () => {
      component.value = '20';
      component.valueChanged(undefined);
      expect(component.value).toBeUndefined();
    });
  });

  describe('closeDialogClicked', () => {
    it('should just call close if save=false', () => {
      spyOn(component, 'closeDialog');
      component.closeDialogClicked(false);
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('should check for validator and return if not valid', async () => {
      component.validator = () => {
        return 'error';
      };

      spyOn(component, 'closeDialog');
      component.value = '';
      await component.closeDialogClicked(true);
      expect(component.closeDialog).not.toHaveBeenCalled();
      expect(component.invalid).toEqual(true);
    });

    it('should check for validator function and call it if exists', async () => {
      component.validator = () => {
        return null;
      };

      spyOn(component, 'closeDialog');
      component.value = '';
      component.saveFunction = () => {
        return Promise.resolve(true);
      };
      await component.closeDialogClicked(true);
      expect(component.closeDialog).toHaveBeenCalledWith(true);
    });

    it('should check for save function if save=true', async () => {
      spyOn(component, 'closeDialog');
      component.value = '';
      component.saveFunction = () => {
        return Promise.resolve(true);
      };
      await component.closeDialogClicked(true);
      expect(component.closeDialog).toHaveBeenCalledWith(true);
    });

    it('should just close if save=true and no save function', async () => {
      spyOn(component, 'closeDialog');
      component.saveFunction = null;
      component.value = '';
      await component.closeDialogClicked(true);
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('should display error if save function returns false', async () => {
      spyOn(component, 'closeDialog');
      component.value = '';
      component.saveFunction = () => {
        return Promise.resolve(false);
      };
      await component.closeDialogClicked(true);
      expect(component.closeDialog).not.toHaveBeenCalled();
      expect(component.saving).toEqual(false);
      expect(component.errorText).toEqual('Failed to save. Please try again');
    });
  });
});
