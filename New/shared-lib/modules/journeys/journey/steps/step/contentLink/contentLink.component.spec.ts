import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {ContentLinkComponent} from './contentLink.component';

describe('ContentLinkComponent', () => {
  let component: ContentLinkComponent;
  let fixture: ComponentFixture<ContentLinkComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'openModal',
        'getCurrentJourney',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 7});
      journeyServiceSpy.journeyServiceMap = {};
      TestBed.configureTestingModule({
        declarations: [ContentLinkComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(ContentLinkComponent);
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

  describe('openModal', () => {
    it('should open the generic modal', async () => {
      component.element = {id: '123', label: 'abc'};
      component.answer = 'answer';
      component.values = {value1: '5'};
      await component.openModal();

      expect(journeyServiceSpy.openModal).toHaveBeenCalledWith({
        element: {label: 'abc', id: 'genericModal'},
        answer: 'answer',
        values: {value1: '5'},
        saveFunction: jasmine.any(Function),
      });
    });
  });

  describe('saveFunction', () => {
    it('should emit valueChange', () => {
      const value = 'value';
      spyOn(component.valueChange, 'emit');
      component.saveFunction(value);
      expect(component.valueChange.emit).toHaveBeenCalledWith(value);
    });
  });
});
