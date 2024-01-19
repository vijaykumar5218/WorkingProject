import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RadioButtonStepComponent} from './radio-button-step.component';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

describe('RadioButtonStepComponent', () => {
  let component: RadioButtonStepComponent;
  let fixture: ComponentFixture<RadioButtonStepComponent>;
  let elements: StepContentElement[];
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('journeyService', [
        'isValueEmpty',
        'getCurrentJourney',
        'safeParse',
      ]);
      TestBed.configureTestingModule({
        declarations: [RadioButtonStepComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(RadioButtonStepComponent);
      component = fixture.componentInstance;
      elements = [{id: 'element1'}, {id: 'element2'}];

      component.elements = elements;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      const value = {
        answerId1: 'answer1',
        answerId2: 'answer2',
        answerId3: undefined,
      };
      journeyServiceSpy.safeParse.and.returnValue(value);
      component.flagMap = {};
      component.answer = 'abc';
    });

    it('should not initialize flag map if answer is undefined', () => {
      component.answer = undefined;

      component.ngOnInit();
      expect(component.flagMap).toEqual({});
    });

    it('should not initialize flag map if parsed answer is undefined', () => {
      component.ngOnInit();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith('abc');
      expect(component.flagMap).toEqual({});
    });

    it('should initialize flag map for each input if parsed answer is defined', () => {
      journeyServiceSpy.isValueEmpty.and.callFake(val => !val);
      component.elements = [
        {id: 'input', answerId: 'answerId1'},
        {id: 'intro'},
        {id: 'input', answerId: 'answerId3'},
      ];
      component.ngOnInit();
      expect(component.flagMap).toEqual({
        answerId1: {showNote: true},
      });
    });
  });

  describe('updateStepValue', () => {
    beforeEach(() => {
      spyOn(component.valueChange, 'emit');
    });

    it('should set the value on the step if step value is undefined', () => {
      component['value'] = undefined;
      component.updateStepValue('5', 'input1');
      expect(component['value']).toEqual({input1: '5'});
    });

    it('should update the value on the step if step value is already defined', () => {
      component['value'] = {input2: '7'};
      component.updateStepValue('5', 'input1');
      expect(component['value']).toEqual({input2: '7', input1: '5'});
    });

    it('should call valueChange emit', () => {
      const obj = {
        value: {input1: '5'},
        requiredCompleted: true,
      };
      component.updateStepValue('5', 'input1');
      expect(component.valueChange.emit).toHaveBeenCalledWith(obj);
    });
  });
  describe('setRequired', () => {
    beforeEach(() => {
      spyOn(component.valueChange, 'emit');
    });
    it('should call checkForValidation', () => {
      component['value'] = {input1: '7'};
      component.setRequired(true, {answerId: 'input1'});
      const obj = {value: {input1: '7'}, requiredCompleted: true};
      expect(component.valueChange.emit).toHaveBeenCalledWith(obj);
    });
    it('should not call checkForValidation', () => {
      component.setRequired(false, {answerId: 'input1'});
      expect(component.valueChange.emit).not.toHaveBeenCalled();
    });
  });
  describe('checkForValidation', () => {
    beforeEach(() => {
      spyOn(component.valueChange, 'emit');
    });
    it('should emit value with requiredCompleted false ', () => {
      journeyServiceSpy.isValueEmpty.and.callFake(val => val === '7');
      component['requiredAnswerIds'] = ['input1', 'input2'];
      component['value'] = {input1: '7'};
      component.checkForValidation();
      const obj = {value: {input1: '7'}, requiredCompleted: false};
      expect(component.valueChange.emit).toHaveBeenCalledWith(obj);
    });
    it('should emit value with requiredCompleted true ', () => {
      journeyServiceSpy.isValueEmpty.and.callFake(val => val === '');
      component['requiredAnswerIds'] = ['input1', 'input2'];
      component['value'] = {input1: '7'};
      component.checkForValidation();
      const obj = {value: {input1: '7'}, requiredCompleted: true};
      expect(component.valueChange.emit).toHaveBeenCalledWith(obj);
    });
  });

  describe('setShowNote', () => {
    let element;
    let serviceSpy;

    beforeEach(() => {
      element = {answerId: 'answerId'};
      component.flagMap = {answerId: {prop1: false}};
      serviceSpy = jasmine.createSpyObj('CollegeService', ['updateNoteValue']);
      journeyServiceSpy.journeyServiceMap = {1: serviceSpy};
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 1});
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
    });

    it('should set showNote true if value is greater than 0', () => {
      journeyServiceSpy.journeyServiceMap = {};
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
      component.setShowNote('$789', element);
      expect(component.flagMap).toEqual({
        answerId: {showNote: true, prop1: false},
      });
    });

    it('should not set showNote to true if user not entered value', () => {
      serviceSpy.updateNoteValue = undefined;
      component.setShowNote('$', element);
      expect(component.flagMap).toEqual({
        answerId: {showNote: false, prop1: false},
      });
    });

    it('should not call updateNoteValue if value is empty', () => {
      component.setShowNote('$', element);
      expect(serviceSpy.updateNoteValue).not.toHaveBeenCalled();
    });

    it('should call updateNoteValue if value is not empty and function exists', () => {
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
      component.setShowNote('$', element);
      expect(serviceSpy.updateNoteValue).toHaveBeenCalledWith('$', element);
    });
  });
});
