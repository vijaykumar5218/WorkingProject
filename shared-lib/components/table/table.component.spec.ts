import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {of, Subscription} from 'rxjs';
import {InputService} from '../../modules/journeys/journey/steps/step/input/service/input.service';
import {JourneyService} from '../../services/journey/journey.service';
import {StepTableComponent} from './table.component';

describe('StepTableComponent', () => {
  let component: StepTableComponent;
  let fixture: ComponentFixture<StepTableComponent>;
  let journeyServiceSpy;
  let serviceSpy;
  let valueChange;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'isValueEmpty',
      ]);
      serviceSpy = jasmine.createSpyObj('Service', ['']);
      serviceSpy.answerId1 = 'answer1';
      serviceSpy.answerId2 = 'answer2';
      journeyServiceSpy.journeyServiceMap = {
        7: serviceSpy,
      };
      valueChange = of();
      serviceSpy.valueChange = valueChange;

      TestBed.configureTestingModule({
        declarations: [StepTableComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {
            provide: InputService,
            useValue: jasmine.createSpyObj('InputService', ['']),
          },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(StepTableComponent);
      component = fixture.componentInstance;
      component.element = {};
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 7});
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let element;

    beforeEach(() => {
      element = {
        rows: [
          {label: 'label1', answerId: 'answerId1'},
          {label: 'label2', answerId: 'answerId2', flag: 'flag2'},
          {label: 'label3', answerId: 'answerId3'},
          {label: 'label4'},
          {label: 'label5', answer: 'answer5', flag: 'flag5'},
        ],
      };
      component['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
    });

    it('should set the answer on the row according to the service data whenever it changes', () => {
      component.element = element;
      serviceSpy.flag5 = true;
      journeyServiceSpy.isValueEmpty.and.callFake(value => {
        return value === undefined;
      });
      const subscription = new Subscription();

      spyOn(valueChange, 'subscribe').and.callFake(f => {
        f();
        return subscription;
      });

      component.ngOnInit();
      expect(serviceSpy.valueChange.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('answer1');
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith('answer2');
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(undefined);
      expect(component.element.rows).toEqual([
        {label: 'label1', answerId: 'answerId1', answer: 'answer1'},
        {
          label: 'label2',
          answerId: 'answerId2',
          answer: 'answer2',
          flag: 'flag2',
          suppress: true,
        },
        {label: 'label3', answerId: 'answerId3', answer: '-'},
        {label: 'label4'},
        {label: 'label5', answer: 'answer5', flag: 'flag5', suppress: false},
      ]);
    });

    it('should not add the subscription if there is no service', () => {
      journeyServiceSpy.journeyServiceMap = {};
      component.ngOnInit();
      expect(component['subscription'].add).not.toHaveBeenCalled();
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
