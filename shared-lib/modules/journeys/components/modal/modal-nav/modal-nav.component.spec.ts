import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '../../../../../services/journey/journey.service';
import {ModalNavComponent} from './modal-nav.component';

describe('ModalNavComponent', () => {
  let component: ModalNavComponent;
  let fixture: ComponentFixture<ModalNavComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['safeParse']);
      TestBed.configureTestingModule({
        declarations: [ModalNavComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(ModalNavComponent);
      component = fixture.componentInstance;
      component.element = {
        elements: [{id: 'element1', answerId: 'answerId'}, {id: 'element2'}],
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      journeyServiceSpy.safeParse.calls.reset();
      journeyServiceSpy.safeParse.and.callFake(str => JSON.parse(str));
      component.genericValue = undefined;
      component.genericAnswer = undefined;
      component.prefill = true;
    });

    it('should default selectedElement to the first tab', () => {
      expect(component.selectedElement).toEqual({
        id: 'element1',
        answerId: 'answerId',
      });
    });

    it('should set generic answer and value if prefill is true', () => {
      const genericValue = {step: 'value'};
      component.values = {
        answerId: JSON.stringify(genericValue),
      };
      component.answer = JSON.stringify(component.values);
      component.ngOnInit();
      expect(component.genericValue).toEqual(genericValue);
      expect(component.genericValue).toEqual(genericValue);
      expect(component.genericAnswer).toEqual(JSON.stringify(genericValue));
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify(genericValue)
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({
          answerId: JSON.stringify(genericValue),
        })
      );
    });

    it('should leave generic value undefined if there is no value passed in', () => {
      component.values = undefined;
      component.answer = '';
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      component.ngOnInit();
      expect(component.genericValue).toBeUndefined();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(undefined);
    });

    it('should leave answer undefined if there is no answer for the answerId', () => {
      const genericValue = {step: 'value'};
      component.values = {
        answerId: JSON.stringify(genericValue),
      };
      component.answer = JSON.stringify({answerId2: 'answer'});
      component.ngOnInit();
      expect(component.genericAnswer).toBeUndefined();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify({answerId2: 'answer'})
      );
    });

    it('should not set generic answer and value if prefill is false', () => {
      component.prefill = false;
      component.ngOnInit();
      expect(component.genericValue).toBeUndefined();
      expect(component.genericAnswer).toBeUndefined();
      expect(journeyServiceSpy.safeParse).not.toHaveBeenCalled();
    });
  });

  describe('setSelectedTab', () => {
    it('should set the selectedElement to the element', () => {
      component.selectedElement = undefined;
      const ele = {id: 'ele1'};
      component.setSelectedTab(ele);
      expect(component.selectedElement).toEqual(ele);
    });
  });

  describe('handleSave', () => {
    it('should emit the updated value', () => {
      component.selectedElement = {id: 'element1', answerId: 'answerId'};
      const value = 'value';
      component['value'] = {answerId2: 'value2'};
      spyOn(component.saveValue, 'emit');
      component.handleSave(value);
      expect(component['value']).toEqual({
        answerId: 'value',
        answerId2: 'value2',
      });
      expect(component.saveValue.emit).toHaveBeenCalledWith(
        JSON.stringify({
          answerId2: 'value2',
          answerId: 'value',
        })
      );
    });
  });
});
