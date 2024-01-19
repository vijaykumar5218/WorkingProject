import {CurrencyPipe} from '@angular/common';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {OrangeMoneyService} from '@shared-lib/modules/orange-money/services/orange-money.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of, Subscription} from 'rxjs';
import {InputComponent} from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let getDBAnswerSpy;
  let utilityServiceSpy;
  let element;
  let orangeMoneyServiceSpy;
  let currencyPipeSpy;
  let journeyServiceSpy;
  let serviceSpy;
  let valueChange;

  beforeEach(
    waitForAsync(() => {
      orangeMoneyServiceSpy = jasmine.createSpyObj('orangeMoneyServiceSpy', [
        'getSalary',
      ]);
      currencyPipeSpy = jasmine.createSpyObj('currencyPipeSpy', ['transform']);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
        'replaceCurrentYear',
      ]);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
      ]);
      serviceSpy = jasmine.createSpyObj('Service', ['']);
      journeyServiceSpy.journeyServiceMap = {
        7: serviceSpy,
      };
      journeyServiceSpy.getCurrentJourney.and.returnValue({
        journeyID: 8,
        lastModifiedStepIndex: 0,
      });
      valueChange = of();
      serviceSpy.valueChange = valueChange;
      TestBed.configureTestingModule({
        declarations: [InputComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: OrangeMoneyService, useValue: orangeMoneyServiceSpy},
          {provide: CurrencyPipe, useValue: currencyPipeSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InputComponent);
      component = fixture.componentInstance;
      element = {
        id: 'input',
        isRequired: true,
      };
      component.element = element;
      getDBAnswerSpy = spyOn(component, 'getDBAnswer').and.returnValue('5');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'setDefaultValue');

      getDBAnswerSpy.and.returnValue('answer');
    });

    it('should call getDBAnswer if no service is set', () => {
      expect(component.getDBAnswer).toHaveBeenCalled();
    });

    it('should call setDefaultValue with the dbAnswer', () => {
      component.ngOnInit();
      expect(component.setDefaultValue).toHaveBeenCalledWith('answer');
    });

    it('should call getDBAnswer and setDefaultValue whenever the value changes if the service is set', () => {
      component['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue({
        journeyID: 7,
        lastModifiedStepIndex: 0,
      });
      const subscription = new Subscription();
      spyOn(valueChange, 'subscribe').and.callFake(f => {
        f();
        return subscription;
      });
      component.ngOnInit();
      expect(serviceSpy.valueChange.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(component.getDBAnswer).toHaveBeenCalled();
      expect(component.setDefaultValue).toHaveBeenCalledWith('answer');
    });

    it('should emit whether answer is required or not', () => {
      spyOn(component.isRequired, 'emit');
      component.ngOnInit();
      expect(component.isRequired.emit).toHaveBeenCalledWith(true);
    });

    it('should not replace the year if the element does not have a label', () => {
      expect(utilityServiceSpy.replaceCurrentYear).not.toHaveBeenCalled();
    });

    it('should replace the year if the element does have a label', () => {
      const label = 'label';
      const replacedLabel = 'replacedLabel';
      component.element.label = label;
      utilityServiceSpy.replaceCurrentYear.and.returnValue(replacedLabel);
      component.ngOnInit();
      expect(utilityServiceSpy.replaceCurrentYear).toHaveBeenCalledWith(label);
      expect(component.element.label).toEqual(replacedLabel);
    });

    it('should copy element and defaultValue if value is set', () => {
      expect(component.elementCopy).toEqual(element);
      expect(component.defaultValue).toEqual('5');
    });

    it('should not copy value if value is not set', () => {
      component.value = undefined;
      component.defaultValue = undefined;
      component.ngOnInit();
      expect(component.defaultValue).toEqual(undefined);
    });
  });

  describe('setDefaultValue', () => {
    beforeEach(() => {
      component.element.default = 67;
      spyOn(component, 'emitCurrentValue');
    });

    describe('should default value to element.default if the values are not passed in', () => {
      beforeEach(() => {
        component.values = undefined;
        component.prefill = true;
      });

      it('if answerId will not be grossYearIncome', () => {
        component.setDefaultValue(undefined);
        expect(component.value).toEqual('67');
      });

      it('if answerId will be grossYearIncome', async () => {
        orangeMoneyServiceSpy.getSalary.and.returnValue(
          Promise.resolve(1000.11)
        );
        currencyPipeSpy.transform.and.returnValue('$1,000');
        component.element.answerId = 'grossYearIncome';
        await component.setDefaultValue(undefined);
        expect(orangeMoneyServiceSpy.getSalary).toHaveBeenCalled();
        expect(currencyPipeSpy.transform).toHaveBeenCalledWith(
          1000.11,
          'USD',
          true,
          '1.2-2'
        );
        expect(component.value).toEqual('$1,000');
      });
    });

    it('should not default if prefilled value is already set', () => {
      component.values = {answerId: '65'};
      component.element.answerId = 'answerId';
      component.setDefaultValue(undefined);
      expect(component.value).toEqual('65');
    });

    it('should not default if value is empty string', () => {
      component.values = {answerId: ''};
      component.element.answerId = 'answerId';
      component.setDefaultValue(undefined);
      expect(component.value).toEqual('');
    });

    it('should default to db value if prefilled value not set', () => {
      component.values = undefined;
      component.value = undefined;
      component.element.answerId = 'answerId';
      component.setDefaultValue('65');
      expect(component.value).toEqual('65');
    });

    it('should emit the currentValue', () => {
      component.setDefaultValue(undefined);
      expect(component.emitCurrentValue).toHaveBeenCalledWith(false);
    });

    it('should not emit the currentValue if prefill is false', () => {
      component.value = undefined;
      component.prefill = false;
      component.setDefaultValue(undefined);
      expect(component.value).toBeUndefined();
      expect(component.emitCurrentValue).not.toHaveBeenCalled();
    });

    it('should default value to element.default if the values are not passed in', () => {
      component.values = undefined;
      component.element = null;
      component.setDefaultValue(undefined);
      expect(component.value).toEqual('5');
    });
  });

  describe('getDBAnswer', () => {
    beforeEach(() => {
      getDBAnswerSpy.and.callThrough();
    });

    it('should return undefined if answer is not set', () => {
      component.answer = undefined;
      const result = component.getDBAnswer();
      expect(result).toBeUndefined();
    });

    it('should return undefined element is not in answer', () => {
      component.element.answerId = 'element2';
      component.answer = JSON.stringify({element1: 'answer1'});
      const result = component.getDBAnswer();
      expect(result).toBeUndefined();
    });

    it('should return answer if element is in answer', () => {
      component.element.answerId = 'element1';
      component.answer = JSON.stringify({element1: 'answer1'});
      const result = component.getDBAnswer();
      expect(result).toEqual('answer1');
    });
  });

  describe('emitCurrentValue', () => {
    beforeEach(() => {
      spyOn(component.currentValue, 'emit');
      spyOn(component.blur, 'emit');
    });

    it('should emit the currentValue of the input and not emit blur if emitBlur is false', () => {
      component.value = 'currentValue';
      component.emitCurrentValue(false);
      expect(component.currentValue.emit).toHaveBeenCalledWith('currentValue');
      expect(component.blur.emit).not.toHaveBeenCalled();
    });

    it('should emit blur if emitBlur is true', () => {
      component.value = 'currentValue';
      component.emitCurrentValue();
      expect(component.blur.emit).toHaveBeenCalled();
    });
  });

  describe('emitValueChange', () => {
    it('should emit the value of the input', () => {
      spyOn(component.valueChange, 'emit');
      component.value = undefined;
      component.emitValueChange('100');
      expect(component.valueChange.emit).toHaveBeenCalledWith('100');
      expect(component.value).toEqual('100');
    });
  });

  describe('emitUpdateStepValueAndStep', () => {
    it('should emit event', () => {
      spyOn(component.updateStepValueAndStep, 'emit');
      component.emitUpdateStepValueAndStep();
      expect(component.updateStepValueAndStep.emit).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscription', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
