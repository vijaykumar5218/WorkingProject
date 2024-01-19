import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SummaryStepComponent} from './step.component';

@Component({
  selector: 'journeys-overview-summary-step-image-with-value',
  template: '',
})
class MockJourneyStepImageWithValueComponent {
  @Input() element;
  @Input() content;
}

@Component({selector: 'app-orange-money', template: ''})
class MockOrangeMoneyComponent {
  @Input() displayHeader;
}

@Component({selector: 'journeys-overview-summary-word', template: ''})
class MockSumamryWordComponent {
  @Input() element;
  @Input() content;
  @Input() isOther;
}

describe('SummaryStepComponent', () => {
  let component: SummaryStepComponent;
  let fixture: ComponentFixture<SummaryStepComponent>;
  let setElementAnswersSpy;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['safeParse']);

      TestBed.configureTestingModule({
        declarations: [
          SummaryStepComponent,
          MockJourneyStepImageWithValueComponent,
          MockOrangeMoneyComponent,
          MockSumamryWordComponent,
        ],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(SummaryStepComponent);
      component = fixture.componentInstance;
      setElementAnswersSpy = spyOn(component, 'setElementAnswers');
      component.step = {
        journeyStepName: '2',
        header: 'Your Goals',
        subheader: "Here's what's most important to you:",
        elements: [
          {
            id: 'wordGroupSummary',
            answerId: 'wordGroup',
          },
          {
            id: 'wordGroupOtherSummary',
            answerId: 'otherInput',
          },
        ],
        answer: {wordGroup: 'wordGroupAnswer', otherInput: 'otherInputAnswer'},
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setElementAnswers', () => {
      expect(setElementAnswersSpy).toHaveBeenCalled();
    });

    it('should set the header if no emptyValueHeader passed in', () => {
      expect(component.header).toEqual(component.step.header);
    });

    it('should not set the header if emptyValueHeader passed in', () => {
      component.step.emptyValueHeader = 'emptyValueHeader';
      component.header = undefined;
      component.ngOnInit();
      expect(component.header).toBeUndefined();
    });

    it('should set the subheader if no emptySubheader passed in', () => {
      expect(component.subheader).toEqual(component.step.subheader);
    });

    it('should not set the subheader if emptySubheader passed in', () => {
      component.step.emptySubheader = 'emptySubheader';
      component.subheader = undefined;
      component.ngOnInit();
      expect(component.subheader).toBeUndefined();
    });

    it('should set the value if the answer is truthy', () => {
      const answer = 'abc';
      component.answer = answer;
      const value = {answer1: 'abc'};
      journeyServiceSpy.safeParse.and.returnValue(value);
      component.value = undefined;
      component.ngOnInit();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(answer);
      expect(component.value).toEqual(value);
    });

    it('should set the value to {} if the answer does not parse', () => {
      const answer = 'abc';
      component.answer = answer;
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      component.value = undefined;
      component.ngOnInit();
      expect(component.value).toEqual({});
    });

    it('should not parse the answer if it is not set', () => {
      component.answer = undefined;
      component.ngOnInit();
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
    });
  });

  describe('setElementAnswers', () => {
    beforeEach(() => {
      setElementAnswersSpy.and.callThrough();
    });

    it('should set the answer for each step', () => {
      component.step.elements.forEach(element => {
        element.answer = undefined;
      });
      component.step.idSuffix = 'idSuffix';
      component.setElementAnswers();
      expect(component.step).toEqual({
        journeyStepName: '2',
        header: 'Your Goals',
        subheader: "Here's what's most important to you:",
        idSuffix: 'idSuffix',
        elements: [
          {
            id: 'wordGroupSummary',
            answerId: 'wordGroup',
            answer: 'wordGroupAnswer',
            idSuffix: 'idSuffix0',
          },
          {
            id: 'wordGroupOtherSummary',
            answerId: 'otherInput',
            answer: 'otherInputAnswer',
            idSuffix: 'idSuffix1',
          },
        ],
        answer: {wordGroup: 'wordGroupAnswer', otherInput: 'otherInputAnswer'},
      });
    });
  });

  describe('setHeaders', () => {
    beforeEach(() => {
      component.header = undefined;
      component.subheader = undefined;
    });

    it('should set isEmpty on the step according to the event', () => {
      component.step.elements[1].isEmpty = true;
      component.setHeaders(false, 1);
      expect(component.step.elements[1].isEmpty).toBeFalse();
    });

    it('should set the header to the regular header if at least 1 step is not empty and it is not already set', () => {
      component.step.elements[0].isEmpty = false;
      component.setHeaders(true, 1);
      expect(component.header).toEqual(component.step.header);
    });

    it('should not update the header if it is already set even if at least 1 step is not empty', () => {
      const header = 'header';
      component.header = header;
      component.step.elements[0].isEmpty = false;
      component.setHeaders(true, 1);
      expect(component.header).toEqual(header);
    });

    it('should set the subheader to the regular subheader if at least 1 step is not empty and it is not already set', () => {
      component.step.elements[0].isEmpty = false;
      component.setHeaders(true, 1);
      expect(component.subheader).toEqual(component.step.subheader);
    });

    it('should not update the subheader if it is already set even if at least 1 step is not empty', () => {
      const subheader = 'subheader';
      component.subheader = subheader;
      component.step.elements[0].isEmpty = false;
      component.setHeaders(true, 1);
      expect(component.subheader).toEqual(subheader);
    });

    it('should set the header to the emptyValueHeader if all steps are empty and it is not already set', () => {
      component.step.elements[0].isEmpty = true;
      component.step.elements[1].isEmpty = true;
      const emptyValueHeader = 'emptyValueHeader';
      component.step.emptyValueHeader = emptyValueHeader;
      component.setHeaders(true, 1);
      expect(component.header).toEqual(emptyValueHeader);
    });

    it('should not update the header if it is already set even if all steps are empty', () => {
      const header = 'header';
      component.header = header;
      component.step.elements[0].isEmpty = true;
      component.step.elements[1].isEmpty = true;
      component.step.emptyValueHeader = 'emptyValueHeader';
      component.setHeaders(true, 1);
      expect(component.header).toEqual(header);
    });

    it('should set the subheader to the emptySubheader if all steps are empty and it is not already set', () => {
      component.step.elements[0].isEmpty = true;
      component.step.elements[1].isEmpty = true;
      const emptySubheader = 'emptySubheader';
      component.step.emptySubheader = emptySubheader;
      component.setHeaders(true, 1);
      expect(component.subheader).toEqual(emptySubheader);
    });

    it('should not update the subheader if it is already set even if all steps are empty', () => {
      const subheader = 'subheader';
      component.subheader = subheader;
      component.step.elements[0].isEmpty = true;
      component.step.elements[1].isEmpty = true;
      component.step.emptySubheader = 'emptySubheader';
      component.setHeaders(true, 1);
      expect(component.subheader).toEqual(subheader);
    });

    it('should not set the header if there are no non empty steps and not every step is empty', () => {
      component.setHeaders(true, 1);
      expect(component.header).toBeUndefined();
    });

    it('should not set the subheader if there are no non empty steps and not every step is empty', () => {
      component.setHeaders(true, 1);
      expect(component.subheader).toBeUndefined();
    });
  });

  describe('updateValue', () => {
    it('should update the value and emit it', () => {
      component.value = {answer1: 'abc'};
      spyOn(component.valueChange, 'emit');
      const expectedValue = {answer1: 'abc', answer2: '123'};
      component.updateValue('123', 'answer2');
      expect(component.value).toEqual(expectedValue);
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        JSON.stringify(expectedValue)
      );
    });
  });
});
