import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RadioButtonComponent} from './radio-button.component';
import {
  Option,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';

describe('RadioButtonComponent', () => {
  let component: RadioButtonComponent;
  let fixture: ComponentFixture<RadioButtonComponent>;
  let options: Option[];
  let elements: StepContentElement[];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RadioButtonComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(RadioButtonComponent);
      component = fixture.componentInstance;
      elements = [{id: 'element1'}, {id: 'element2'}];
      options = [
        {
          id: 'option1',
        },
        {
          id: 'option2',
          elements: elements,
        },
      ];
      component.element = {
        answerId: 'answerId',
        options: JSON.parse(JSON.stringify(options)),
        idSuffix: '1234',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateValue', () => {
    beforeEach(() => {
      spyOn(component.radioButtonStateChanged, 'emit');
    });

    it('should emit value', () => {
      component.emitValueChange(JSON.stringify({abc: '789'}));
      expect(component.radioButtonStateChanged.emit).toHaveBeenCalledWith(
        JSON.stringify({abc: '789'})
      );
    });
  });
});
