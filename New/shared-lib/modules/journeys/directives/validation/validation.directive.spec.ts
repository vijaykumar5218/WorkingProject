import {Component} from '@angular/core';
import {ValidationDirective} from './validation.directive';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {By} from '@angular/platform-browser';
import {ValidationType} from '@shared-lib/services/journey/constants/validationType.enum';

@Component({
  template: '<ion-input journeysValidation></ion-input>',
})
class HostComponent {}

describe('ValidationDirective', () => {
  let directive;
  let fixture: ComponentFixture<HostComponent>;
  let input: HTMLInputElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ValidationDirective, HostComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      const inputDebugElement = fixture.debugElement.query(By.css('ion-input'));
      input = inputDebugElement.nativeElement;
      directive = inputDebugElement.injector.get(ValidationDirective);
    })
  );

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('listeners', () => {
    beforeEach(() => {
      spyOn(directive, 'clean');
      spyOn(directive, 'validateMin').and.returnValue('15');
      spyOn(directive.ngModelChange, 'emit');
    });

    it('should call clean for input event', () => {
      const event = new CustomEvent('input');
      input.value = '10';
      input.dispatchEvent(event);
      expect(directive.clean).toHaveBeenCalledWith(input);
    });

    it('should call clean for ionInput event', () => {
      const event = new CustomEvent('ionInput');
      input.value = '10';
      input.dispatchEvent(event);
      expect(directive.clean).toHaveBeenCalledWith(input);
    });

    it('should call validateMin for focusout event', () => {
      directive.input = {
        id: 'input',
        answerId: 'disabilityPercent',
        validationRules: {
          type: ValidationType.number,
          decimalPlaces: 0,
          min: 15,
          max: 100,
        },
      };
      input.value = '10';
      const event = new CustomEvent('focusout');
      input.dispatchEvent(event);
      expect(directive.validateMin).toHaveBeenCalledWith(input);
      expect(directive.ngModelChange.emit).toHaveBeenCalledWith('15');
    });
  });

  describe('clean', () => {
    let event;

    beforeEach(() => {
      directive.input = {
        id: 'input',
        answerId: 'disabilityPercent',
        validationRules: {
          type: ValidationType.number,
          decimalPlaces: 0,
          min: 0,
          max: 100,
        },
      };
      event = {
        value: '10',
      };
      spyOn(directive.ngModelChange, 'emit');
    });

    it('should emit the empty string if the empty string is passed in', () => {
      event.value = '';
      directive.clean(event);
      expect(event.value).toEqual('');
      expect(directive.ngModelChange.emit).toHaveBeenCalledWith('');
    });
    it('should emit the empty string if the input is undefined', () => {
      directive.input = undefined;
      event.value = '';
      directive.clean(event);
      expect(directive.ngModelChange.emit).toHaveBeenCalledWith('');
    });

    it('should not change the value if the validation rule is not number or dollar and the input is not a number', () => {
      event.value = 'test';
      directive.input.validationRules.type = undefined;
      directive.clean(event);
      expect(event.value).toEqual('test');
    });

    it('should not validate the min if the type is not number or dollar', () => {
      event.value = '10';
      directive.input.validationRules.type = undefined;
      directive.input.validationRules.min = 15;
      directive.clean(event);
      expect(event.value).toEqual('10');
    });

    it('should not validate the max if the type is not number or dollar', () => {
      event.value = '10';
      directive.input.validationRules.type = undefined;
      directive.input.validationRules.max = 9;
      directive.clean(event);
      expect(event.value).toEqual('10');
    });

    it('should not change the value if min is there and type is number and value is more than the min', () => {
      event.value = '10';
      directive.input.validationRules.min = 9;
      directive.clean(event);
      expect(event.value).toEqual('10');
    });

    it('should update to the max if it is there and type is number and value is more than the max', () => {
      event.value = '10';
      directive.input.validationRules.max = 9;
      directive.clean(event);
      expect(event.value).toEqual('9');
    });

    it('should not change the value if max is there and type is number and value is less than the min', () => {
      event.value = '10';
      directive.input.validationRules.max = 11;
      directive.clean(event);
      expect(event.value).toEqual('10');
    });

    it('should give whole number if decimalPlaces is not set', () => {
      event.value = '10.15';
      directive.input.validationRules.decimalPlaces = undefined;
      directive.clean(event);
      expect(event.value).toEqual('10');
    });

    it('should give whole number if decimalPlaces is 0 and not validate max or min if they are not set', () => {
      event.value = '10.15';
      directive.input.validationRules.max = undefined;
      directive.input.validationRules.min = undefined;
      directive.clean(event);
      expect(event.value).toEqual('10');
    });

    it('should give alphabetic with space if the type is non-alphabet', () => {
      event.value = 'Max Fury%';
      directive.input.validationRules.type = ValidationType.alphabeticWithSpace;
      directive.clean(event);
      expect(event.value).toEqual('Max Fury');
    });

    it('should not give alphabetic with space if the type undefined', () => {
      event.value = 'Max Fury%';
      directive.input = undefined;
      directive.clean(event);
      expect(event.value).toEqual('Max Fury%');
    });

    it('should give particular decimal places if its not 0', () => {
      event.value = '10.155';
      directive.input.validationRules.decimalPlaces = 2;
      directive.clean(event);
      expect(event.value).toEqual('10.15');
    });

    it('should give $ with value if validation is dollar', () => {
      event.value = '54';
      directive.input.validationRules.type = ValidationType.dollar;
      directive.clean(event);
      expect(event.value).toEqual('$54');
    });

    it('should give 2 decimal value with 3 decimal value if validation is percentage and decimalPlaces is 2', () => {
      event.value = '54.031';
      directive.input.validationRules.type = ValidationType.percentage;
      directive.input.validationRules.max = 99;
      directive.input.validationRules.min = 0;
      directive.input.validationRules.decimalPlaces = 2;
      directive.clean(event);
      expect(event.value).toEqual('54.03');
    });

    it('should give unchanged value if validation is percentage and decimalPlaces is 2 and value ends with .', () => {
      event.value = '54.';
      directive.input.validationRules.type = ValidationType.percentage;
      directive.input.validationRules.max = 99;
      directive.input.validationRules.min = 0;
      directive.input.validationRules.decimalPlaces = 2;
      directive.clean(event);
      expect(event.value).toEqual('54.');
    });

    it('should change value to the max if validation is percentage and decimal places is 2 and value is over the max', () => {
      event.value = '54';
      directive.input.validationRules.type = ValidationType.percentage;
      directive.input.validationRules.max = 53;
      directive.input.validationRules.min = 0;
      directive.input.validationRules.decimalPlaces = 2;
      directive.clean(event);
      expect(event.value).toEqual('53');
    });

    it('should give empty if validation is percentage and decimal places is 2 and value is a character', () => {
      event.value = 'a';
      directive.input.validationRules.type = ValidationType.percentage;
      directive.input.validationRules.decimalPlaces = 2;
      directive.clean(event);
      expect(event.value).toEqual('');
    });
  });

  describe('validateMin', () => {
    let event;

    beforeEach(() => {
      directive.input = {
        id: 'input',
        answerId: 'disabilityPercent',
        validationRules: {
          type: ValidationType.number,
          decimalPlaces: 0,
          min: 0,
          max: 100,
        },
      };
      event = {
        value: '10',
      };
    });
    it('should update to the min and value is less than the min', () => {
      event.value = '10.01';
      directive.input.validationRules.min = 15;
      directive.validateMin(event);
      expect(event.value).toEqual('15');
    });

    it('should not update to the min when input is undefined', () => {
      event.value = '10.01';
      directive.input = undefined;
      directive.validateMin(event);
      expect(event.value).toEqual('10.01');
    });
  });
});
