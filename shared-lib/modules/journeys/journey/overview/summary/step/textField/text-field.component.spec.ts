import {ComponentFixture, waitForAsync, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {TextFieldSummaryComponent} from './text-field.component';

describe('TextFieldSummaryComponent', () => {
  let component: TextFieldSummaryComponent;
  let fixture: ComponentFixture<TextFieldSummaryComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'isValueEmpty',
      ]);
      TestBed.configureTestingModule({
        declarations: [TextFieldSummaryComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(TextFieldSummaryComponent);
      component = fixture.componentInstance;
      component.element = {
        answer: 'answer',
        label: 'label',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the answer to the element answer if it is not empty', () => {
      expect(component.answer).toEqual('answer');
    });

    it('should set the answer to - if it is empty', () => {
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      component.answer = undefined;
      component.ngOnInit();
      expect(component.answer).toEqual('-');
    });
  });
});
