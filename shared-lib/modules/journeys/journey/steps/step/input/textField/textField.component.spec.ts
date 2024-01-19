import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ValidationType} from '@shared-lib/services/journey/constants/validationType.enum';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {of, Subscription} from 'rxjs';
import {InputService} from '../service/input.service';
import {TextFieldComponent} from './textField.component';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;
  let emitValueChangeSpy;
  let journeyServiceSpy;
  let inputServiceSpy;
  let serviceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'addDollar',
        'isValueEmpty',
        'openModal',
        'getCurrentJourney',
      ]);
      serviceSpy = jasmine.createSpyObj('Service', ['getValidationRules$']);
      journeyServiceSpy.journeyServiceMap = {
        8: serviceSpy,
      };
      journeyServiceSpy.getCurrentJourney.and.returnValue({
        journeyID: 8,
        lastModifiedStepIndex: 0,
      });
      serviceSpy.getValidationRules$.and.returnValue(
        of({
          answerId: 'collegeStartAge',
          validationRules: {
            decimalPlaces: 2,
            min: 18,
            max: 99,
          },
          collegeStartAge: '20',
        })
      );
      inputServiceSpy = jasmine.createSpyObj('InputService', [
        'getValidationRules$',
      ]);
      inputServiceSpy.getValidationRules$.and.returnValue(of({max: 100}));
      TestBed.configureTestingModule({
        declarations: [TextFieldComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: InputService, useValue: inputServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TextFieldComponent);
      component = fixture.componentInstance;
      component.input = {
        id: 'input',
        answerId: 'disabilityPercent',
        validationRules: {
          type: ValidationType.number,
          decimalPlaces: 0,
          min: 0,
          max: 100,
        },
      };
      emitValueChangeSpy = spyOn(component, 'emitValueChange');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let subscription;
    let validationRules$;

    beforeEach(() => {
      spyOn(component['subscription'], 'add');
      validationRules$ = of({type: ValidationType.dollar});
      subscription = new Subscription();
      spyOn(validationRules$, 'subscribe').and.callFake(() => {
        return subscription;
      });
      inputServiceSpy.getValidationRules$.and.returnValue(validationRules$);
      component.value = '7';
    });
    it('should subscribe to validationRules changes', () => {
      component.ngOnInit();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(validationRules$.subscribe).toHaveBeenCalled();
    });
    it('it should update the validationrules', () => {
      const validationRules = {max: 500};
      validationRules$.subscribe.and.callFake(f => {
        f(validationRules);
        return subscription;
      });
      component.ngOnInit();
      expect(component.input.validationRules).toEqual(validationRules);
    });

    it('it should update the validationrules and value if answerid is collegeStartAge', () => {
      component.input = {
        id: 'input',
        answerId: 'collegeStartAge',
        validationRules: {
          type: ValidationType.number,
          decimalPlaces: 0,
          min: 0,
          max: 100,
        },
      };
      const validationRules = {
        answerId: 'collegeStartAge',
        validationRules: {
          decimalPlaces: 2,
          min: 18,
          max: 99,
        },
        collegeStartAge: '20',
      };
      validationRules$.subscribe.and.callFake(f => {
        f(validationRules);
        return subscription;
      });
      serviceSpy.getValidationRules$.and.returnValue(validationRules$);
      component.ngOnInit();
      expect(component.input.validationRules).toEqual(
        validationRules.validationRules
      );
      expect(component.value).toEqual(validationRules.collegeStartAge);
    });

    it('should not update textfield value if there is no service found', () => {
      journeyServiceSpy.journeyServiceMap = {
        8: undefined,
      };
      component.ngOnInit();
      expect(component.value).toEqual('7');
    });
  });

  describe('ngAfterViewInit', () => {
    it('should not emit the value change if value is undefined', () => {
      component.value = undefined;
      component.ngAfterViewInit();
      expect(emitValueChangeSpy).not.toHaveBeenCalled();
    });

    it('should not emit the value change if value is undefined', () => {
      component.value = '19';
      component.ngAfterViewInit();
      expect(emitValueChangeSpy).toHaveBeenCalled();
    });
  });

  describe('emitValueChange', () => {
    beforeEach(() => {
      component.value = '10';
      spyOn(component.valueChange, 'emit');
      emitValueChangeSpy.and.callThrough();
    });

    it('should emit the valueChange event', () => {
      component.emitValueChange();
      expect(component.valueChange.emit).toHaveBeenCalledWith('10');
    });
  });

  describe('emitBlur', () => {
    beforeEach(() => {
      spyOn(component.blur, 'emit');
    });

    it('should set the value to the min if the input is not allowed to be empty and is', () => {
      component.value = '$';
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      component.input.validationRules.emptyAllowed = false;
      component.input.validationRules.min = 400;
      journeyServiceSpy.addDollar.and.returnValue('$400');
      component.emitBlur();
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('$');
      expect(journeyServiceSpy.addDollar).toHaveBeenCalledWith(
        '400',
        component.input
      );
      expect(component.value).toEqual('$400');
    });

    it('should call the error popup model if the input field is emptyAllowed is false', async () => {
      component.value = '$';
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      component.input.validationRules.emptyAllowed = false;
      component.input.validationRules.min = 0;
      component.input.displayErrorPopup = true;
      journeyServiceSpy.addDollar.and.returnValue('$0');
      await component.emitBlur();
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('$');
      expect(journeyServiceSpy.addDollar).toHaveBeenCalledWith(
        '0',
        component.input
      );
      expect(component.value).toEqual('$0');
      expect(journeyServiceSpy.openModal).toHaveBeenCalledWith(
        {
          element: {
            id: 'error-msg',
            answerId: 'disabilityPercent',
            validationRules: {
              max: 100,
              emptyAllowed: false,
              min: 0,
            },
            displayErrorPopup: true,
          },
        },
        false
      );
    });

    it('should not update the value to the min if it is allowed to be empty', () => {
      component.value = '$40';
      component.input.validationRules.emptyAllowed = true;
      component.emitBlur();
      expect(journeyServiceSpy.isValueEmpty).not.toHaveBeenCalled();
      expect(component.value).toEqual('$40');
    });

    it('should not update the value to the min if there are no validation rules', () => {
      component.value = '$40';
      component.input.validationRules = undefined;
      component.emitBlur();
      expect(journeyServiceSpy.isValueEmpty).not.toHaveBeenCalled();
      expect(component.value).toEqual('$40');
    });

    it('should not update the value to the min if it is not empty', () => {
      component.value = '$40';
      component.input.validationRules.emptyAllowed = false;
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
      component.emitBlur();
      expect(journeyServiceSpy.addDollar).not.toHaveBeenCalled();
      expect(component.value).toEqual('$40');
    });

    it('should call emitValueChange', () => {
      component.emitBlur();
      expect(emitValueChangeSpy).toHaveBeenCalled();
    });

    it('should emit blur event', () => {
      component.emitBlur();
      expect(component.blur.emit).toHaveBeenCalled();
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
