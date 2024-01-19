import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SelectComponent} from './select.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      TestBed.configureTestingModule({
        declarations: [SelectComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should not error or set value if defaultValue is not defined', () => {
      expect(component['value']).toBeUndefined();
    });

    it('should parse the defaultValue if it is defined', () => {
      const value = {
        id: 'id1',
        value: '25',
        label: 'label 1',
      };
      component.defaultValue = JSON.stringify(value);
      component.ngOnInit();
      expect(component['value']).toEqual(value);
    });

    it('should set isWeb', () => {
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toBeTrue();
    });
  });

  describe('onChange', () => {
    it('should find the option with given value and set value to the option', () => {
      component['value'] = undefined;
      const option12 = {
        value: '12',
        id: 'option3',
      };
      component.element = {
        options: [
          {id: 'option1'},
          {id: 'option2', value: 10},
          option12,
          {id: 'option4'},
        ],
      };
      spyOn(component.valueChange, 'emit');
      component.onChange('12');
      expect(component['value']).toEqual(option12);
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        JSON.stringify(option12)
      );
    });
  });
});
