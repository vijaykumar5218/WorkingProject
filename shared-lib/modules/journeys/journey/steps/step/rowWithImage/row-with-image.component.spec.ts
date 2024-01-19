import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {Subscription} from 'rxjs';
import {RowWithImageComponent} from './row-with-image.component';

describe('RowWithImageComponent', () => {
  let component: RowWithImageComponent;
  let fixture: ComponentFixture<RowWithImageComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'isValueEmpty',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 7});
      journeyServiceSpy.journeyServiceMap = {};
      TestBed.configureTestingModule({
        declarations: [RowWithImageComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(RowWithImageComponent);
      component = fixture.componentInstance;
      component.element = {
        id: 'contentModal',
        header: 'How did we come up with these numbers?',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let answer;
    beforeEach(() => {
      answer = 'answer';
      component.answer = undefined;
    });

    it('should default to the answer provided if no service', () => {
      component.element.answer = answer;
      component.service = undefined;
      component.ngOnInit();
      expect(component.answer).toEqual(answer);
    });

    it('should default to the answer provided if no answerId', () => {
      component.element.answer = answer;
      component.service = jasmine.createSpyObj('service', ['']);
      component.ngOnInit();
      expect(component.answer).toEqual(answer);
    });

    it('should subscribe to valueChange and get the value from the service if its not empty', () => {
      const answerId = 'answerId';
      component.element.answerId = answerId;
      component.service = jasmine.createSpyObj('service', ['']);
      component.service = {answerId: answer};
      component.service.valueChange = jasmine.createSpyObj('valueChange', [
        'subscribe',
      ]);
      const subscription = new Subscription();
      component.service.valueChange.subscribe.and.callFake(f => {
        f();
        return subscription;
      });
      spyOn(component['subscription'], 'add');
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
      component.ngOnInit();
      expect(component.answer).toEqual(answer);
      expect(component.service.valueChange.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(journeyServiceSpy.isValueEmpty).toHaveBeenCalledWith(answer);
    });

    it('should get the value from the service and set it to - if its empty', () => {
      const answerId = 'answerId';
      component.element.answerId = answerId;
      component.service = jasmine.createSpyObj('service', ['']);
      component.service = {answerId: answer};
      component.service.valueChange = jasmine.createSpyObj('valueChange', [
        'subscribe',
      ]);
      const subscription = new Subscription();
      component.service.valueChange.subscribe.and.callFake(f => {
        f();
        return subscription;
      });
      spyOn(component['subscription'], 'add');
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      component.ngOnInit();
      expect(component.answer).toEqual('-');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
