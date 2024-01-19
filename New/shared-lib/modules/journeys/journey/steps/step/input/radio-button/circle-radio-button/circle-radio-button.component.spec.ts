import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {CircleRadioButtonComponent} from './circle-radio-button.component';
import {
  Option,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';

describe('CircleRadioButtonComponent', () => {
  let component: CircleRadioButtonComponent;
  let fixture: ComponentFixture<CircleRadioButtonComponent>;
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
        'getCurrentJourney',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('JourneyUtilityService', [
        'updateRadioStateValue',
        'radioButtonClick',
        'setElements',
      ]);

      TestBed.configureTestingModule({
        declarations: [CircleRadioButtonComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: JourneyUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(CircleRadioButtonComponent);
      component = fixture.componentInstance;
      const answer = {answerId: 'option2'};
      stringifiedAnswer = JSON.stringify(answer);
      component.value = stringifiedAnswer;
      elements = [
        {
          id: 'intro',
          description: 'Nice! you may exceed your college saving goal by $2!',
          type: 'note',
          marginTop: '0px',
          marginBottom: '13px',
          isRequired: false,
        },
      ];
      options = [
        {
          label: '$539 (100% Montly Contribution)',
          id: '0',
          elements: elements,
          idSuffix: '1234',
        },
        {
          id: '1',
          idSuffix: '1235',
        },
      ];
      component.element = {
        answerId: 'answerId',
        options: options,
        idSuffix: '1234',
      };
      journeyServiceSpy.safeParse.and.returnValue(answer);
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

  describe('radioButtonClicked', () => {
    beforeEach(() => {
      journeyServiceSpy.journeyServiceMap = {};
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 1});
      spyOn(component.radioButtonStateChanged, 'emit');
      utilityServiceSpy.radioButtonClick.and.returnValue({
        value: '$2',
        isRequiredValid: true,
        elements: elements,
        element: {
          options: [
            {
              label: '$539 (100% Montly Contribution)',
              id: '0',
              elements: elements,
              idSuffix: '1234',
              checked: true,
              value: 539,
            },
            {
              id: '1',
              idSuffix: '1235',
              checked: false,
            },
          ],
          idSuffix: '1234',
        },
      });
    });
    it('should set checked to false except for checked item', () => {
      component.isToggle = false;
      component.radioButtonClicked(component.element.options[0]);
      expect(component.element.options).toEqual([
        {
          label: '$539 (100% Montly Contribution)',
          id: '0',
          elements: elements,
          idSuffix: '1234',
          checked: true,
          value: 539,
        },
        {
          id: '1',
          idSuffix: '1235',
          checked: false,
        },
      ]);
      expect(component.elements).toEqual(elements);
    });
    it('elements should be undefined if checked is true', () => {
      utilityServiceSpy.radioButtonClick.and.returnValue({
        value: '',
        isRequiredValid: true,
        element: {
          answerId: 'answerId',
          options: [
            {
              label: '$539 (100% Montly Contribution)',
              id: '0',
              elements: elements,
              idSuffix: '1234',
              checked: true,
            },
            {
              id: '1',
              idSuffix: '1235',
              checked: false,
            },
          ],
          idSuffix: '1234',
        },
      });
      component.isToggle = false;
      component.elements = undefined;
      component.radioButtonClicked(component.element.options[1]);
      expect(component.elements).toBeUndefined();
    });
    it('should set checked to false except for checked item', () => {
      component.element.options[0].elements[0].isRequired = true;
      component.radioButtonClicked(component.element.options[0]);
      expect(component.radioButtonStateChanged.emit).toHaveBeenCalledWith(
        undefined
      );
    });
    it('should set requiredCompleted to true if value is empty', () => {
      spyOn(component, 'updateValue');
      utilityServiceSpy.radioButtonClick.and.returnValue({
        value: '',
        isRequiredValid: true,
        elements: [
          {
            id: 'input',
            description: 'Nice! you may exceed your college saving goal by $2!',
            marginTop: '0px',
            marginBottom: '13px',
            isRequired: true,
            default: 23,
            answerId: 'option2',
          },
        ],
        element: {
          answerId: 'answerId',
          options: [
            {
              label: '$539 (100% Montly Contribution)',
              id: '0',
              elements: [
                {
                  id: 'input',
                  description:
                    'Nice! you may exceed your college saving goal by $2!',
                  type: 'note',
                  marginTop: '0px',
                  marginBottom: '13px',
                  isRequired: true,
                  default: 23,
                  answerId: 'option2',
                },
              ],
              idSuffix: '1234',
              checked: true,
            },
            {
              id: '1',
              idSuffix: '1235',
              checked: false,
            },
          ],
          idSuffix: '1234',
        },
      });
      journeyServiceSpy.isValueEmpty.and.callFake(val => val === '');
      component.isToggle = false;
      component['answer'] = {option3: '$987', option2: ''};
      component.radioButtonClicked(component.element.options[0]);
      expect(component.updateValue).toHaveBeenCalledWith({
        value: {answerId: ''},
        requiredCompleted: true,
      });
    });

    it('should set requiredCompleted to true if answer is empty', () => {
      spyOn(component, 'updateValue');
      utilityServiceSpy.radioButtonClick.and.returnValue({
        value: '',
        isRequiredValid: true,
        elements: [
          {
            id: 'input',
            description: 'Nice! you may exceed your college saving goal by $2!',
            marginTop: '0px',
            marginBottom: '13px',
            isRequired: true,
            default: 23,
            answerId: 'option2',
          },
        ],
        element: {
          answerId: 'answerId',
          options: [
            {
              label: '$539 (100% Montly Contribution)',
              id: '0',
              elements: [
                {
                  id: 'input',
                  description:
                    'Nice! you may exceed your college saving goal by $2!',
                  type: 'note',
                  marginTop: '0px',
                  marginBottom: '13px',
                  isRequired: true,
                  default: 23,
                  answerId: 'option2',
                },
              ],
              idSuffix: '1234',
              checked: true,
            },
            {
              id: '1',
              idSuffix: '1235',
              checked: false,
            },
          ],
          idSuffix: '1234',
        },
      });
      journeyServiceSpy.isValueEmpty.and.callFake(val => val === '');
      component.isToggle = false;
      component['answer'] = undefined;
      component.radioButtonClicked(component.element.options[0]);
      expect(component.updateValue).toHaveBeenCalledWith({
        value: {answerId: ''},
        requiredCompleted: true,
      });
    });

    it('should call updateNoteValueForRadioOption if it exists and option is checked', () => {
      const serviceSpy = jasmine.createSpyObj('CollegeService', [
        'updateNoteValueForRadioOption',
      ]);
      journeyServiceSpy.journeyServiceMap = {1: serviceSpy};
      component['answer'] = {option3: '$987', option2: ''};
      utilityServiceSpy.radioButtonClick.and.callFake((_1, _2, opt) => {
        opt.checked = true;
        return {
          value: '$2',
          isRequiredValid: true,
          elements: elements,
          element: {
            options: [
              {
                label: '$539 (100% Montly Contribution)',
                id: '0',
                elements: elements,
                idSuffix: '1234',
                checked: true,
                value: 539,
              },
              {
                id: '1',
                idSuffix: '1235',
                checked: false,
              },
            ],
            idSuffix: '1234',
          },
        };
      });
      component.radioButtonClicked(component.element.options[0]);
      expect(serviceSpy.updateNoteValueForRadioOption).toHaveBeenCalledWith(
        {
          label: '$539 (100% Montly Contribution)',
          id: '0',
          elements: elements,
          idSuffix: '1234',
          checked: true,
        },
        {option3: '$987', option2: '', undefined: '$2'}
      );
    });

    it('should not call updateNoteValueForRadioOption if option is not checked', () => {
      const serviceSpy = jasmine.createSpyObj('CollegeService', [
        'updateNoteValueForRadioOption',
      ]);
      journeyServiceSpy.journeyServiceMap = {1: serviceSpy};
      component.radioButtonClicked(component.element.options[0]);
      expect(serviceSpy.updateNoteValueForRadioOption).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component.radioButtonStateChanged, 'emit');
      spyOn(component, 'radioButtonClicked');
    });
    it('should set the preselected option', () => {
      expect(component.element.options).toEqual([
        {
          label: '$539 (100% Montly Contribution)',
          id: '0',
          elements: [
            {
              id: 'intro',
              description:
                'Nice! you may exceed your college saving goal by $2!',
              type: 'note',
              marginTop: '0px',
              marginBottom: '13px',
              isRequired: false,
            },
          ],
          idSuffix: '1234',
        },
        {
          id: '1',
          idSuffix: '1235',
        },
      ]);
      expect(component.elements).toBeUndefined();
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
      expect(component.radioButtonClicked).toHaveBeenCalledWith(options[0]);
      expect(component.radioButtonStateChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit undefined if no option is selected', () => {
      component.value = undefined;
      component.element.options = options;
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      component.ngOnInit();
      expect(component.radioButtonStateChanged.emit).toHaveBeenCalledWith(
        undefined
      );
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
