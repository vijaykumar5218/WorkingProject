import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {CalendarComponent} from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let emitValueChangeSpy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CalendarComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(CalendarComponent);
      component = fixture.componentInstance;
      component.input = {
        id: 'input',
        answerId: 'disabilityPercent',
      };
      emitValueChangeSpy = spyOn(component, 'emitValueChange');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should transform incoming date and set fullDateValue', () => {
      component.value = '1990-08';
      component.ngOnInit();
      expect(component.fullDateValue).toEqual('1990-08-01');
    });
  });

  describe('emitValueChange', () => {
    beforeEach(() => {
      component.value = '10';
      spyOn(component.valueChange, 'emit');
      emitValueChangeSpy.and.callThrough();
    });

    it('should emit the valueChange event', () => {
      const val = 'Fri Jun 09 2023 17:37:45 GMT+0530 (India Standard Time)';
      component.emitValueChange({
        detail: {
          value: val,
        },
      } as CustomEvent);
      expect(component.valueChange.emit).toHaveBeenCalledWith('2023-06');
    });
  });
});
