import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ModalStepComponent} from './modal-step.component';

describe('ModalStepComponent', () => {
  let component: ModalStepComponent;
  let fixture: ComponentFixture<ModalStepComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ModalStepComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(ModalStepComponent);
      component = fixture.componentInstance;
      component.ele = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleContinueClick', () => {
    it('should emit the continue event', () => {
      spyOn(component.continueClick, 'emit');
      const event = {save: false, route: true};
      component.handleContinueClick(event);
      expect(component.continueClick.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('emitRequired', () => {
    it('should emit the required event', () => {
      spyOn(component.isRequired, 'emit');
      component.emitRequired(true);
      expect(component.isRequired.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('emitElementValue', () => {
    it('should emit the element value event', () => {
      spyOn(component.valueChange, 'emit');
      const value = '123';
      component.emitElementValue(value);
      expect(component.valueChange.emit).toHaveBeenCalledWith(value);
    });
  });

  describe('handleSaveValue', () => {
    it('should emit the value', () => {
      spyOn(component.saveValue, 'emit');
      const value = 'value';
      component.handleSaveValue(value);
      expect(component.saveValue.emit).toHaveBeenCalledWith(value);
    });
  });
});
