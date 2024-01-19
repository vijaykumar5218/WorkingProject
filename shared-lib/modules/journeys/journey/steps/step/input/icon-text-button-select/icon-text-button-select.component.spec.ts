import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {IconTextButtonSelectComponent} from './icon-text-button-select.component';

describe('IconTextButtonSelectComponent', () => {
  let component: IconTextButtonSelectComponent;
  let fixture: ComponentFixture<IconTextButtonSelectComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['safeParse']);
      journeyServiceSpy.safeParse.and.callFake(str => JSON.parse(str));
      TestBed.configureTestingModule({
        declarations: [IconTextButtonSelectComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(IconTextButtonSelectComponent);
      component = fixture.componentInstance;
      component.element = {
        options: [
          {id: 'option1'},
          {
            id: 'option2',
            label: 'Option 2',
            value: 2,
          },
          {
            id: 'option3',
            checked: false,
          },
        ],
      };
      component.defaultValue = JSON.stringify({
        id: 'option2',
        label: 'Option 2',
        imageUrl: 'assets/icon/journeys/college/person.svg',
        value: '103',
        idSuffix: '0201',
        checked: false,
      });

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should checked the previous selcted dependent', () => {
      component.element.options = [
        {id: 'option1'},
        {
          id: 'option2',
          label: 'Option 2',
          value: 2,
          checked: false,
        },
        {
          id: 'option3',
          checked: false,
        },
      ];
      component.ngOnInit();
      expect(component.element.options[1].checked).toBeTrue();
    });
  });

  describe('chooseDependent', () => {
    beforeEach(() => {
      spyOn(component.valueChange, 'emit');
      component.element.options = undefined;
    });

    it('should set checked to false except for checked item', () => {
      component.element.options = [
        {id: 'option1'},
        {
          id: 'option2',
          label: 'Option 2',
          value: 2,
        },
        {
          id: 'option3',
          checked: true,
        },
      ];
      component.chooseDependent(component.element.options[1]);
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        JSON.stringify({
          id: 'option2',
          label: 'Option 2',
          value: 2,
        })
      );
      expect(component.element.options).toEqual([
        {
          id: 'option1',
          checked: false,
        },
        {
          id: 'option2',
          checked: true,
          label: 'Option 2',
          value: 2,
        },
        {
          id: 'option3',
          checked: false,
        },
      ]);
    });
    it('should emit undefined if no dependent is selected', () => {
      component.element.options = [
        {id: 'option1'},
        {
          id: 'option2',
          label: 'Option 2',
          value: 2,
          checked: true,
        },
        {
          id: 'option3',
          checked: true,
        },
      ];
      component.chooseDependent(component.element.options[1]);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('emitUpdateStepValueAndStep', () => {
    it('should emit event', () => {
      spyOn(component.updateStepValueAndStep, 'emit');
      component.emitUpdateStepValueAndStep();
      expect(component.updateStepValueAndStep.emit).toHaveBeenCalled();
    });
  });
});
