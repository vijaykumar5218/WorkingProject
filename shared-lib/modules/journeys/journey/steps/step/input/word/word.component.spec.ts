import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {WordComponent} from './word.component';

describe('WordComponent', () => {
  let component: WordComponent;
  let fixture: ComponentFixture<WordComponent>;
  let option;

  beforeEach(
    waitForAsync(() => {
      option = {text: 'text1', id: 'id1'};
      TestBed.configureTestingModule({
        declarations: [WordComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(WordComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should default values if defaultValue is passed in', () => {
      const defaultVal = [
        {text: 'text1', id: 'id1'},
        {text: 'text2', id: 'id2'},
      ];
      component.defaultValue = JSON.stringify(defaultVal);
      component['value'] = undefined;
      component.ngOnInit();
      expect(component['value']).toEqual(defaultVal);
    });

    it('should not default values if defaultValue is not passed in', () => {
      const val = [
        {text: 'text1', id: 'id1'},
        {text: 'text2', id: 'id2'},
      ];
      component.defaultValue = undefined;
      component['value'] = val;
      component.ngOnInit();
      expect(component['value']).toEqual(val);
    });
  });

  describe('toggleSelectOption', () => {
    beforeEach(() => {
      spyOn(component.selectionChange, 'emit');
    });

    it('should remove the option from value if it was selected before', () => {
      component['value'] = [option];
      component.toggleSelectOption(option);
      expect(component['value']).toEqual([]);
    });

    it('should add the option to value if it was not selected before', () => {
      component['value'] = [];
      component.toggleSelectOption(option);
      expect(component['value']).toEqual([option]);
    });

    it('should emit the stringified new value', () => {
      component['value'] = [];
      component.toggleSelectOption(option);
      expect(component.selectionChange.emit).toHaveBeenCalledWith(
        JSON.stringify([option])
      );
    });
  });

  describe('getSelected', () => {
    it('should return true if the option is in the value', () => {
      component['value'] = [option];
      const result = component.getSelected(option);
      expect(result).toBeTrue();
    });

    it('should return false if the option is not in the value', () => {
      component['value'] = [];
      const result = component.getSelected(option);
      expect(result).toBeFalse();
    });
  });
});
