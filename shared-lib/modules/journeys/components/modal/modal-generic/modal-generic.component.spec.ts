import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {ModalGenericComponent} from './modal-generic.component';

describe('ModalGenericComponent', () => {
  let component: ModalGenericComponent;
  let fixture: ComponentFixture<ModalGenericComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'isValueEmpty',
        'closeModal',
        'getCurrentJourney',
        'safeParse',
      ]);
      TestBed.configureTestingModule({
        declarations: [ModalGenericComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(ModalGenericComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      journeyServiceSpy.safeParse.calls.reset();
      journeyServiceSpy.safeParse.and.callFake(str => JSON.parse(str));
      component.element.answerId = 'answerId';
      component.stepValue = undefined;
      component.stepAnswer = undefined;
    });

    it('should set step answer and value if accumulateAnswers is false', () => {
      const stepValue = {step: 'value'};
      component.values = {
        answerId: JSON.stringify(stepValue),
      };
      component.answer = JSON.stringify(component.values);
      component['value'] = undefined;
      component.ngOnInit();
      expect(component.stepValue).toEqual(stepValue);
      expect(component['value']).toEqual(stepValue);
      expect(component.stepAnswer).toEqual(JSON.stringify(stepValue));
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify(stepValue)
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({
          answerId: JSON.stringify(stepValue),
        })
      );
    });

    it('should leave step value undefined if there is no value passed in', () => {
      component.values = undefined;
      component.answer = '';
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      component.ngOnInit();
      expect(component.stepValue).toBeUndefined();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(undefined);
    });

    it('should leave answer undefined if there is no answer for the answerId', () => {
      const stepValue = {step: 'value'};
      component.values = {
        answerId: JSON.stringify(stepValue),
      };
      component.answer = JSON.stringify({answerId2: 'answer'});
      component.ngOnInit();
      expect(component.stepAnswer).toBeUndefined();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({answerId2: 'answer'})
      );
    });

    it('should not set step answer and value if accumulateAnswers is true', () => {
      component.element.accumulateAnswers = true;
      component.ngOnInit();
      expect(component.stepValue).toBeUndefined();
      expect(component.stepAnswer).toBeUndefined();
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
    });
  });

  describe('handleContinueClick', () => {
    let value;
    beforeEach(() => {
      jasmine.clock().install();

      const today = new Date('2022-09-25');
      jasmine.clock().mockDate(today);
      spyOn(component.saveValue, 'emit');
      journeyServiceSpy.getCurrentJourney.and.returnValue({
        journeyID: 1,
        lastModifiedStepIndex: 0,
        journeyName: 'journey',
      });
      value = {input2: '7', input1: '5'};
      component['value'] = value;
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('should emit the value and close the modal for save event', () => {
      component.handleContinueClick({route: false, save: true});
      expect(component.saveValue.emit).toHaveBeenCalledWith(
        JSON.stringify({...value, id: '1664064000000'})
      );
      expect(journeyServiceSpy.closeModal).toHaveBeenCalled();
    });

    it('should not emit or close the modal for non save event', () => {
      component.handleContinueClick({route: false});
      expect(component.saveValue.emit).not.toHaveBeenCalled();
      expect(journeyServiceSpy.closeModal).not.toHaveBeenCalled();
    });

    it('should call addDependent if the answerId is addAChildModal and accumulateAnswers is true', () => {
      component.element.answerId = 'addAChildModal';
      component.element.accumulateAnswers = true;
      journeyServiceSpy.journeyServiceMap = {
        1: jasmine.createSpyObj('CollegeService', ['addDependent']),
      };
      component.handleContinueClick({route: false, save: true});
      expect(
        journeyServiceSpy.journeyServiceMap[1].addDependent
      ).toHaveBeenCalledWith(value);
    });

    it('should not call addDependent if the answerId is addAChildModal and accumulateAnswers is false', () => {
      component.element.answerId = 'addAChildModal';
      component.element.accumulateAnswers = false;
      journeyServiceSpy.journeyServiceMap = {
        1: jasmine.createSpyObj('CollegeService', ['addDependent']),
      };
      component.handleContinueClick({route: false, save: true});
      expect(
        journeyServiceSpy.journeyServiceMap[1].addDependent
      ).not.toHaveBeenCalled();
    });
  });

  describe('setRequired', () => {
    beforeEach(() => {
      component['checkForContinue'] = jasmine.createSpy();
    });

    it('should add the answer id to the list if the input is required', () => {
      const answerId = 'answerId';
      component['requiredAnswerIds'] = [];
      component.setRequired(true, {answerId: answerId});
      expect(component['requiredAnswerIds']).toEqual([answerId]);
      expect(component['checkForContinue']).toHaveBeenCalled();
    });

    it('should not add the answer id to the list if the input is not required', () => {
      const answerId = 'answerId';
      component['requiredAnswerIds'] = [];
      component.setRequired(false, {answerId: answerId});
      expect(component['requiredAnswerIds']).toEqual([]);
      expect(component['checkForContinue']).not.toHaveBeenCalled();
    });
  });

  describe('checkForContinue', () => {
    it('should set requiredInputsFilled to false if there is no value', () => {
      component['requiredAnswerIds'] = ['answerId1'];
      component.requiredInputsFilled = true;
      component['value'] = undefined;
      component['checkForContinue']();
      expect(component.requiredInputsFilled).toBeFalse();
      expect(journeyServiceSpy.isValueEmpty).not.toHaveBeenCalled();
    });

    it('should set requiredInputsFilled to false if there is a required empty input', () => {
      component['requiredAnswerIds'] = ['answerId1'];
      component.requiredInputsFilled = true;
      component['value'] = {};
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      component['checkForContinue']();
      expect(component.requiredInputsFilled).toBeFalse();
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(undefined);
    });

    it('should set continueButtonEnabled to true and emit true if there are no required empty inputs', () => {
      component['requiredAnswerIds'] = ['answerId1'];
      component.requiredInputsFilled = false;
      component['value'] = {answerId1: 'value1'};
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
      component['checkForContinue']();
      expect(component.requiredInputsFilled).toBeTrue();
    });

    it('should call detectChanges', () => {
      spyOn(component['changeDetectorRef'], 'detectChanges');
      component['checkForContinue']();
      expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalled();
    });
  });

  describe('updateElementValue', () => {
    beforeEach(() => {
      component['checkForContinue'] = jasmine.createSpy();
    });

    it('should set the value on the step if step value is undefined', () => {
      component['value'] = undefined;
      component.updateElementValue('5', 'input1');
      expect(component['value']).toEqual({input1: '5'});
    });

    it('should update the value on the step if step value is already defined', () => {
      component['value'] = {input2: '7'};
      component.updateElementValue('5', 'input1');
      expect(component['value']).toEqual({input2: '7', input1: '5'});
    });

    it('should call checkForContinue', () => {
      component.updateElementValue('5', 'input1');
      expect(component['checkForContinue']).toHaveBeenCalled();
    });
  });

  describe('handleSaveValue', () => {
    it('should emit the value', () => {
      spyOn(component.saveValue, 'emit');
      const value = 'value';
      component.handleSaveValue(value);
      expect(component.saveValue.emit).toHaveBeenCalledWith(value);
    });
  });
});
