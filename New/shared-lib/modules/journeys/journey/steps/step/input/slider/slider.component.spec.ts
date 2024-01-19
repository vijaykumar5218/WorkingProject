import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {of} from 'rxjs';
import {InputService} from '../service/input.service';
import {SliderComponent} from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;
  let journeyServiceSpy;
  let inputServiceSpy;
  let serviceSpy;
  let valueChange;
  let updateValueAndAnswerSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'removeDollar',
        'addDollar',
        'safeParse',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 7});
      serviceSpy = jasmine.createSpyObj('service', ['onChange']);
      journeyServiceSpy.journeyServiceMap = {
        7: serviceSpy,
      };
      valueChange = of();
      serviceSpy.valueChange = valueChange;
      inputServiceSpy = jasmine.createSpyObj('InputService', [
        'publishValidationRules',
      ]);
      TestBed.configureTestingModule({
        declarations: [SliderComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: InputService, useValue: inputServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SliderComponent);
      component = fixture.componentInstance;
      component.element = {
        id: 'slider',
        validationRules: {},
      };
      updateValueAndAnswerSpy = spyOn(component, 'updateValueAndAnswer');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let subscription;
    let max;
    beforeEach(() => {
      subscription = jasmine.createSpyObj('Subscription', ['']);
      spyOn(serviceSpy.valueChange, 'subscribe').and.callFake(f => {
        f();
        return subscription;
      });
      spyOn(component['subscription'], 'add');
      const maxId = 'maxId';
      component.element.validationRules.maxId = maxId;
      max = 100;
      serviceSpy[maxId] = max;
    });

    it('should subscribe to valueChange', () => {
      component.ngOnInit();
      expect(serviceSpy.valueChange.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });

    it('should publish the max change if it updates', () => {
      component.max = undefined;
      component.ngOnInit();
      expect(component.max).toEqual(max);
      expect(inputServiceSpy.publishValidationRules).toHaveBeenCalledWith({
        ...component.element.validationRules,
        max: 100,
      });
    });

    it('if maxId is not defined', () => {
      component.element.validationRules.maxId = undefined;
      component.element.validationRules.max = 52;
      component.ngOnInit();
      expect(component.max).toEqual(52);
    });

    it('should not publish the max change if it stays the same', () => {
      component.max = max;
      component.ngOnInit();
      expect(component.max).toEqual(max);
      expect(inputServiceSpy.publishValidationRules).not.toHaveBeenCalled();
    });

    it('should set the value to the db answer if it is present for the current max', () => {
      const defaultVal = {100: '$2500'};
      const stringifiedDefaultValue = JSON.stringify(defaultVal);
      component.defaultValue = stringifiedDefaultValue;
      journeyServiceSpy.safeParse.and.returnValue(defaultVal);
      updateValueAndAnswerSpy.and.callFake(val => {
        component.value = val;
      });
      journeyServiceSpy.removeDollar.and.returnValue('2500');
      component.sliderValue = undefined;
      component.ngOnInit();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        stringifiedDefaultValue
      );
      expect(component.updateValueAndAnswer).toHaveBeenCalledWith('$2500');
      expect(journeyServiceSpy.removeDollar).toHaveBeenCalledWith(
        '$2500',
        component.element
      );
      expect(component.sliderValue).toEqual(2500);
    });

    it('should set the value to the max if db value and answer are not present for the current max', () => {
      const defaultVal = {200: '$2500'};
      const stringifiedDefaultValue = JSON.stringify(defaultVal);
      component.defaultValue = stringifiedDefaultValue;
      journeyServiceSpy.safeParse.and.returnValue(defaultVal);
      updateValueAndAnswerSpy.and.callFake(val => {
        component.value = val;
      });
      journeyServiceSpy.removeDollar.and.returnValue('1500');
      component.sliderValue = undefined;
      component.element.defaultId = 'defaultId';
      serviceSpy.defaultId = 1500;
      component['answer'] = {};
      journeyServiceSpy.addDollar.and.returnValue('$1500');
      component.ngOnInit();
      expect(component.updateValueAndAnswer).toHaveBeenCalledWith('$1500');
      expect(journeyServiceSpy.addDollar).toHaveBeenCalledWith(
        '1500',
        component.element
      );
      expect(component.sliderValue).toEqual(1500);
    });

    it('should set the value to the answer for the max if db value is not present but answer is', () => {
      component.defaultValue = undefined;
      updateValueAndAnswerSpy.and.callFake(val => {
        component.value = val;
      });
      journeyServiceSpy.removeDollar.and.returnValue('1500');
      component.sliderValue = undefined;
      component['answer'] = {100: '$1500'};
      component.ngOnInit();
      expect(component.updateValueAndAnswer).toHaveBeenCalledWith('$1500');
      expect(journeyServiceSpy.removeDollar).toHaveBeenCalledWith(
        '$1500',
        component.element
      );
      expect(component.sliderValue).toEqual(1500);
    });
  });

  describe('onInputBlur', () => {
    it('should set the value and sliderValue', () => {
      updateValueAndAnswerSpy.and.callFake(val => {
        component.value = val;
      });
      component.value = undefined;
      component.sliderValue = undefined;
      const newValue = '$500';
      const newValueNum = 500;
      journeyServiceSpy.removeDollar.and.returnValue(newValueNum);
      component.onInputBlur(newValue);
      expect(component.updateValueAndAnswer).toHaveBeenCalledWith(
        newValue,
        false
      );
      expect(component.value).toEqual(newValue);
      expect(component.sliderValue).toEqual(newValueNum);
      expect(journeyServiceSpy.removeDollar).toHaveBeenCalledWith(
        newValue,
        component.element
      );
    });
  });

  describe('onSliderChange', () => {
    it('should not update the value if the type is not number', () => {
      const value = '20';
      component.value = value;
      component.onSliderChange({lower: 5, upper: 10});
      expect(component.value).toEqual(value);
    });

    it('should update the value if the type is number and call onChange', () => {
      component.value = '20';
      component.sliderValue = 20;
      const val = 5;
      const dollarVal = '$5';
      journeyServiceSpy.addDollar.and.returnValue(dollarVal);
      updateValueAndAnswerSpy.and.callFake(val => {
        component.value = val;
      });
      component.sliderValue = val;
      component.onSliderChange(val);
      expect(journeyServiceSpy.addDollar).toHaveBeenCalledWith(
        val.toString(),
        component.element
      );
      expect(component.updateValueAndAnswer).toHaveBeenCalledWith(dollarVal);
      expect(component.value).toEqual(dollarVal);
      expect(component.sliderValue).toEqual(val);
      expect(serviceSpy.onChange).toHaveBeenCalledWith(val);
    });
  });

  describe('updateValueAndAnswer', () => {
    let val;
    beforeEach(() => {
      val = '$10';
      component.value = '$5';
      spyOn(component['changeDetectorRef'], 'detectChanges');
      updateValueAndAnswerSpy.and.callThrough();
      spyOn(component.valueChange, 'emit');
    });

    it('should set the value and call detectChanges if value is new and detectChanges is true', () => {
      component.updateValueAndAnswer(val);
      expect(component.value).toEqual(val);
      expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalled();
    });

    it('should not set the value and call detectChanges if value is not new and detectChanges is true', () => {
      component.value = val;
      component.updateValueAndAnswer(val);
      expect(component.value).toEqual(val);
      expect(
        component['changeDetectorRef'].detectChanges
      ).not.toHaveBeenCalled();
    });

    it('should not call detectChanges if the value is new but detectChanges is false', () => {
      component.updateValueAndAnswer(val, false);
      expect(
        component['changeDetectorRef'].detectChanges
      ).not.toHaveBeenCalled();
    });

    it('should update the answer for the current max if it is already set', () => {
      component.max = 500;
      component['answer'] = {500: '$5'};
      component.updateValueAndAnswer(val);
      const answer = {500: '$10'};
      expect(component['answer']).toEqual(answer);
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        JSON.stringify(answer)
      );
    });

    it('should remove the answer for the previous max and update the answer for the max if the answer had a different max', () => {
      component.max = 500;
      component['answer'] = {250: '$5'};
      component.updateValueAndAnswer(val);
      const answer = {500: '$10'};
      expect(component['answer']).toEqual(answer);
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        JSON.stringify(answer)
      );
    });
  });

  describe('reset', () => {
    it('should call updateValueAndAnswer and set the slider value to the max', () => {
      component.max = 5000;
      component.value = undefined;
      component.sliderValue = undefined;
      updateValueAndAnswerSpy.and.callFake(val => (component.value = val));
      journeyServiceSpy.addDollar.and.returnValue('$5000');
      component.reset();
      expect(updateValueAndAnswerSpy).toHaveBeenCalledWith('$5000', false);
      expect(component.value).toEqual('$5000');
      expect(journeyServiceSpy.addDollar).toHaveBeenCalledWith(
        '5000',
        component.element
      );
      expect(component.sliderValue).toEqual(5000);
    });
    it('if service.reset function is defined', () => {
      component.max = undefined;
      component.service.reset = jasmine.createSpy().and.returnValue(10);
      updateValueAndAnswerSpy.and.callFake(val => (component.value = val));
      journeyServiceSpy.addDollar.and.returnValue(10);
      component.reset();
      expect(component.service.reset).toHaveBeenCalled();
      expect(updateValueAndAnswerSpy).toHaveBeenCalledWith(10, false);
      expect(journeyServiceSpy.addDollar).toHaveBeenCalledWith(
        '10',
        component.element
      );
      expect(component.sliderValue).toEqual(10);
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
