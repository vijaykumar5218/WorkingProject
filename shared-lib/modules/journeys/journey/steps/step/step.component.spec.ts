import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {StepComponent} from './step.component';

@Component({selector: 'journeys-steps-step-intro', template: ''})
class MockIntroComponent {
  @Input() header;
  @Input() description;
}

@Component({selector: 'journeys-steps-step-image-with-value', template: ''})
class MockImageWithValueComponent {
  @Input() imageUrl;
  @Input() age;
}

@Component({selector: 'journeys-steps-step-input', template: ''})
class MockInputComponent {
  @Input() element;
  @Input() values;
  @Input() index;
  @Input() answer;
}

@Component({selector: 'journeys-steps-step-button', template: ''})
class MockButtonComponent {
  @Input() label;
  @Input() link;
}

describe('StepComponent', () => {
  let component: StepComponent;
  let fixture: ComponentFixture<StepComponent>;
  let utilityServiceSpy;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      journeyServiceSpy = jasmine.createSpyObj('journeyService', [
        'fetchJourneys',
        'isValueEmpty',
        'safeParse',
      ]);
      TestBed.configureTestingModule({
        declarations: [
          StepComponent,
          MockIntroComponent,
          MockImageWithValueComponent,
          MockInputComponent,
          MockButtonComponent,
        ],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(StepComponent);
      component = fixture.componentInstance;
      component.step = {
        journeyStepName: '1',
        journeyStepCMSTagId: 'step1',
        msgType: 'section1',
        answer: '{"retirementAge":"55"}',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get isWeb', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });

    it('should fetch the journeys from journey service', () => {
      expect(journeyServiceSpy.fetchJourneys).toHaveBeenCalled();
    });

    it('should set the value to the parsed answer if there is one', () => {
      const value = {value: 'test'};
      component.step.answer = JSON.stringify(value);
      journeyServiceSpy.safeParse.and.returnValue(value);
      component.ngOnInit();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify(value)
      );
      expect(component.step.value).toEqual(value);
    });

    it('should not set the value if there is no answer', () => {
      component.step.value = undefined;
      component.step.answer = undefined;
      journeyServiceSpy.safeParse.calls.reset();
      component.ngOnInit();
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
      expect(component.step.value).toBeUndefined();
      expect(component.step.answer).toBeUndefined();
    });

    it('should not set the value to the parsed answer if there is already a value', () => {
      const value = {value: 'test'};
      component.step.answer = JSON.stringify(value);
      component.step.value = value;
      journeyServiceSpy.safeParse.and.returnValue(value);
      journeyServiceSpy.safeParse.calls.reset();
      component.ngOnInit();
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
      expect(component.step.value).toEqual(value);
    });
  });

  describe('handleContinueClick', () => {
    it('should emit the continueClick event', () => {
      spyOn(component.continueClick, 'emit');
      const event = {route: false};
      component.handleContinueClick(event);
      expect(component.continueClick.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('handleBackClick', () => {
    it('should emit the backClick event', () => {
      spyOn(component.backClick, 'emit');
      component.handleBackClick();
      expect(component.backClick.emit).toHaveBeenCalled();
    });
  });

  describe('updateStepValueAndStep', () => {
    it('should call updateStepValue and emit the updateStep', () => {
      const value = '10';
      const element = {accumulateAnswers: true};
      const stepValue = {step: 'value'};
      component.step.value = stepValue;
      spyOn(component, 'updateStepValue');
      spyOn(component.updateStep, 'emit');
      component.updateStepValueAndStep(value, element);
      expect(component.updateStepValue).toHaveBeenCalledWith(value, element);
      expect(component.updateStep.emit).toHaveBeenCalledWith(stepValue);
    });
  });

  describe('updateStepValue', () => {
    beforeEach(() => {
      spyOn(component, 'checkForContinue');
    });

    it('should set the value on the step if step value is undefined', () => {
      component.step.value = undefined;
      component.updateStepValue('5', {answerId: 'input1'});
      expect(component.step.value).toEqual({input1: '5'});
    });

    it('should update the value on the step if step value is already defined', () => {
      component.step.value = {input2: '7'};
      component.updateStepValue('5', {answerId: 'input1'});
      expect(component.step.value).toEqual({input2: '7', input1: '5'});
    });

    it('should add the value to the existing list if accumulateAnswers and there is already an answer', () => {
      component.step.value = {input2: ['7']};
      component.updateStepValue('5', {
        answerId: 'input2',
        accumulateAnswers: true,
      });
      expect(component.step.value).toEqual({input2: ['7', '5']});
    });

    it('should add the value to the new list if accumulateAnswers and there is no answer yet', () => {
      component.step.value = {};
      component.updateStepValue('5', {
        answerId: 'input2',
        accumulateAnswers: true,
      });
      expect(component.step.value).toEqual({input2: ['5']});
    });

    it('should call checkForContinue', () => {
      component.updateStepValue('5', {answerId: 'input1'});
      expect(component.checkForContinue).toHaveBeenCalled();
    });
  });

  describe('checkForContinue', () => {
    beforeEach(() => {
      spyOn(component.swipeEnabled, 'emit');
      component[
        'isRequiredInputSetCompleted'
      ] = jasmine.createSpy().and.returnValue(false);
      component.index = 5;
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
    });

    it('should set continueButtonEnabled to false and emit false if there is a required empty input', () => {
      component['requiredAnswerIds'] = ['answerId1'];
      component.continueButtonEnabled = true;
      component.step.value = {};
      component.checkForContinue();
      expect(component.continueButtonEnabled).toBeFalse();
      expect(component.swipeEnabled.emit).toHaveBeenCalledWith({
        swipeEnabled: false,
        index: 5,
      });
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(undefined);
    });

    it('should set continueButtonEnabled to true and emit true if there are no required empty inputs', () => {
      component['requiredAnswerIds'] = ['answerId1'];
      component.continueButtonEnabled = false;
      component.step.value = {answerId1: 'value1'};
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
      component.checkForContinue();
      expect(component.continueButtonEnabled).toBeTrue();
      expect(component.swipeEnabled.emit).toHaveBeenCalledWith({
        swipeEnabled: true,
        index: 5,
      });
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('value1');
    });

    it('should set continueButtonEnabled to true and emit true if the empty input is part of an input set which is filled', () => {
      component[
        'isRequiredInputSetCompleted'
      ] = jasmine.createSpy().and.returnValue(true);
      component['requiredAnswerIds'] = ['answerId1'];
      component.continueButtonEnabled = false;
      component.step.value = {answerId1: 'value1'};
      component.checkForContinue();
      expect(component.continueButtonEnabled).toBeTrue();
      expect(component.swipeEnabled.emit).toHaveBeenCalledWith({
        swipeEnabled: true,
        index: 5,
      });
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('value1');
    });
  });

  describe('isRequiredInputSetCompleted', () => {
    beforeEach(() => {
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      component.step.content = {requiredInputSets: [['d'], ['a', 'b'], ['c']]};
      component.step.value = {a: 'valueA', b: 'valueB'};
    });

    it('should return false if there are no requiredInputSets', () => {
      component.step.content.requiredInputSets = undefined;
      const result = component['isRequiredInputSetCompleted']('');
      expect(result).toBeFalse();
    });

    it('should return false if there are no requiredInputSets with the id', () => {
      component.step.content = {requiredInputSets: [['a']]};
      const result = component['isRequiredInputSetCompleted']('b');
      expect(result).toBeFalse();
    });

    it('should return false if the required inputs are empty', () => {
      const result = component['isRequiredInputSetCompleted']('a');
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('valueA');
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('valueB');
      expect(result).toBeFalse();
    });

    it('should return true if any of the required inputs are not empty', () => {
      journeyServiceSpy.isValueEmpty.and.callFake(value => {
        return value === 'valueB';
      });
      const result = component['isRequiredInputSetCompleted']('a');
      expect(result).toBeTrue();
    });
  });

  describe('setRequired', () => {
    beforeEach(() => {
      spyOn(component, 'checkForContinue');
    });

    it('should add the answer id to the list if the input is required', () => {
      const answerId = 'answerId';
      component['requiredAnswerIds'] = [];
      component.setRequired(true, {answerId: answerId});
      expect(component['requiredAnswerIds']).toEqual([answerId]);
      expect(component.checkForContinue).toHaveBeenCalled();
    });

    it('should not add the answer id to the list if the input is not required', () => {
      const answerId = 'answerId';
      component['requiredAnswerIds'] = [];
      component.setRequired(false, {answerId: answerId});
      expect(component['requiredAnswerIds']).toEqual([]);
    });
  });

  describe('updateImageValue', () => {
    it('should set the age', () => {
      component.imageValue = undefined;
      component.updateImageValue('55');
      expect(component.imageValue).toEqual('55');
    });
  });
});
