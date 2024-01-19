import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {CheckboxComponent} from './checkbox.component';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['safeParse']);
      TestBed.configureTestingModule({
        declarations: [CheckboxComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(CheckboxComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('should parse the answer and set the checkbox value', () => {
      const value = {checked: true};
      component.answer = JSON.stringify(value);
      journeyServiceSpy.safeParse.and.returnValue(value);
      component.checkbox.nativeElement.checked = undefined;
      component.ngAfterViewInit();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(
        JSON.stringify(value)
      );
      expect(component.checkbox.nativeElement.checked).toEqual(true);
    });

    it('should set the checkbox value to undefined if no answer', () => {
      component.answer = undefined;
      journeyServiceSpy.safeParse.and.returnValue(undefined);
      component.checkbox.nativeElement.checked = true;
      component.ngAfterViewInit();
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(undefined);
      expect(component.checkbox.nativeElement.checked).toEqual(undefined);
    });
  });

  describe('handleClick', () => {
    beforeEach(() => {
      spyOn(component.valueChange, 'emit');
      component.options = undefined;
    });

    it('should update the animation if checkbox is checked and emit the value', () => {
      const options = {
        autoplay: true,
        path: 'assets/animations/CheckAnimation.json',
        loop: false,
      };
      component.checked = false;
      component.handleClick(false);
      expect(component.options).toEqual(options);
      expect(component.checked).toBeTrue();
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        JSON.stringify({checked: true})
      );
    });

    it('should not update the animation if checkbox is not checked', () => {
      component.handleClick(true);
      expect(component.options).toBeUndefined();
    });
  });
});
