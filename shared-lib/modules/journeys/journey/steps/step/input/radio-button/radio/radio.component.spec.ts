import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RadioComponent} from './radio.component';
import {
  Option,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;
  let options: Option[];
  let elements: StepContentElement[];
  let journeyServiceSpy;
  let stringifiedAnswer;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'safeParse',
        'isValueEmpty',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('JourneyUtilityService', [
        'updateRadioStateValue',
        'radioButtonClick',
        'setElements',
      ]);
      TestBed.configureTestingModule({
        declarations: [RadioComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: JourneyUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(RadioComponent);
      component = fixture.componentInstance;
      const answer = {answerId: 'option2'};
      stringifiedAnswer = JSON.stringify(answer);
      component.value = stringifiedAnswer;
      elements = [{id: 'element1'}, {id: 'element2'}];
      options = [
        {
          id: 'option1',
          idSuffix: '12341',
          default: true,
        },
        {
          id: 'option2',
          elements: elements,
          idSuffix: '12342',
        },
      ];
      component.element = {
        answerId: 'answerId',
        options: options,
        idSuffix: '1234',
      };
      journeyServiceSpy.safeParse.and.returnValue(answer);
      component.elements = [];
      utilityServiceSpy.radioButtonClick.and.returnValue({
        value: '',
        isRequiredValid: true,
        elements: elements,
        element: component.element,
      });
      utilityServiceSpy.setElements.and.returnValue({
        value: '',
        isRequiredValid: true,
        elements: elements,
      });
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the preselected option', () => {
      expect(component.element.options).toEqual([
        {
          id: 'option1',
          idSuffix: '12341',
          default: true,
        },
        {
          id: 'option2',
          elements: elements,
          idSuffix: '12342',
          checked: true,
        },
      ]);
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        stringifiedAnswer
      );
    });

    it('should set to the default if there is no preselected option', () => {
      component.value = undefined;
      options[0].default = true;
      component.element.options = options;
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      component.ngOnInit();
      expect(component.element.options).toEqual([
        {
          id: 'option1',
          default: true,
          idSuffix: '12341',
          checked: true,
        },
        {
          id: 'option2',
          elements: elements,
          idSuffix: '12342',
          checked: true,
        },
      ]);
    });
  });

  describe('radioButtonClicked', () => {
    beforeEach(() => {
      spyOn(component.radioButtonStateChanged, 'emit');
      spyOn(component, 'updateValue');
    });

    it('should set checked to false except for checked item', () => {
      utilityServiceSpy.radioButtonClick.and.returnValue({
        value: 'option2',
        isRequiredValid: true,
        elements: elements,
        element: {
          answerId: 'answerId',
          options: [
            {id: 'option1', checked: false},
            {
              id: 'option2',
              elements: elements,
              checked: true,
            },
            {
              id: 'option3',
              checked: false,
            },
          ],
          idSuffix: '1234',
        },
      });
      component.element.options = [
        {id: 'option1'},
        {
          id: 'option2',
          elements: elements,
        },
        {
          id: 'option3',
          checked: true,
        },
      ];
      component.elements = undefined;
      component.radioButtonClicked(component.element.options[1]);
      expect(component.element.options).toEqual([
        {
          id: 'option1',
          checked: false,
        },
        {
          id: 'option2',
          checked: true,
          elements: elements,
        },
        {
          id: 'option3',
          checked: false,
        },
      ]);
      const obj = {
        value: {answerId: 'option2'},
      };
      expect(component.updateValue).toHaveBeenCalledWith(obj);
      expect(component.elements).toEqual(elements);
    });

    it('should set elements to undefined if there are no elements in checked option', () => {
      utilityServiceSpy.radioButtonClick.and.returnValue({
        value: 'option2',
        isRequiredValid: true,
        elements: undefined,
        element: {
          answerId: 'answerId',
          options: [
            {id: 'option1', checked: false},
            {
              id: 'option2',
              elements: elements,
              checked: true,
            },
            {
              id: 'option3',
              checked: false,
            },
          ],
          idSuffix: '1234',
        },
      });
      component.element.options = [
        {id: 'option1'},
        {
          id: 'option2',
        },
        {
          id: 'option3',
          checked: true,
        },
      ];
      component.elements = elements;
      component.radioButtonClicked(component.element.options[1]);
      expect(component.elements).toBeUndefined();
    });

    it('should set emit answer as empty string if no element is checked', () => {
      utilityServiceSpy.radioButtonClick.and.returnValue({
        value: '',
        isRequiredValid: true,
        elements: undefined,
        element: {
          answerId: 'answerId',
          options: [
            {id: 'option1', checked: false},
            {
              id: 'option2',
              elements: elements,
              checked: true,
            },
            {
              id: 'option3',
              checked: false,
            },
          ],
          idSuffix: '1234',
        },
      });
      component.element.options = [{id: 'option1', checked: true}];
      component.elements = elements;
      component.radioButtonClicked(component.element.options[0]);
      const obj = {
        value: {answerId: ''},
      };
      expect(component.updateValue).toHaveBeenCalledWith(obj);
      expect(component.elements).toBeUndefined();
    });
  });

  describe('updateValue', () => {
    beforeEach(() => {
      spyOn(component.radioButtonStateChanged, 'emit');
    });

    it('should combine the current answer with the new answer and emit the updated value', () => {
      utilityServiceSpy.updateRadioStateValue.and.returnValue(
        JSON.stringify({option2: '789', def: '456', ghi: '101'})
      );
      component['answer'] = {option2: '123', def: '456'};
      const obj = {
        value: {option2: '789', ghi: '101'},
        requiredCompleted: true,
      };
      component.updateValue(obj);
      const newVal = {option2: '789', def: '456', ghi: '101'};
      expect(component['answer']).toEqual(newVal);
      expect(component.radioButtonStateChanged.emit).toHaveBeenCalledWith(
        JSON.stringify(newVal)
      );
    });

    it('should remove the answer at answerId if it is empty', () => {
      utilityServiceSpy.updateRadioStateValue.and.returnValue(
        JSON.stringify({option2: '789', def: '456', ghi: '101'})
      );
      component['answer'] = {answerId: '123', def: '456'};
      journeyServiceSpy.isValueEmpty.and.callFake(val => val === '');
      const obj = {
        value: {answerId: '', ghi: '101'},
        requiredCompleted: true,
      };
      component.updateValue(obj);
      const newVal = {def: '456', ghi: '101'};
      expect(component['answer']).toEqual(newVal);
    });

    it('should emit empty string if value is {}', () => {
      component['answer'] = {answerId: '123'};
      journeyServiceSpy.isValueEmpty.and.callFake(val => val === '');
      const obj = {
        value: {answerId: ''},
        requiredCompleted: true,
      };
      component.updateValue(obj);
      expect(component['answer']).toEqual({});
      expect(component.radioButtonStateChanged.emit).toHaveBeenCalledWith(
        undefined
      );
    });
    it('should emit undefined', () => {
      component['answer'] = {answerId: '123'};
      journeyServiceSpy.isValueEmpty.and.callFake(val => val === '');
      const obj = {
        value: {answerId: ''},
        requiredCompleted: false,
      };
      component.updateValue(obj);
      expect(component['answer']).toEqual({});
      expect(component.radioButtonStateChanged.emit).toHaveBeenCalledWith(
        undefined
      );
    });
  });
});
