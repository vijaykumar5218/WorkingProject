import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FilterValues} from '../../models/filter-sort.model';

import {ChipsComponent} from './chips.component';

describe('FilterClaimsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChipsComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ChipsComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeChip', () => {
    it('should remove chips output function', () => {
      spyOn(component.outPutData, 'emit');
      const selctedItem = {
        name: 'Out of Network',
        key: 'OutNetwork',
        enabled: true,
        isChecked: true,
      } as FilterValues;
      component.removeChip(selctedItem);
      expect(component.outPutData.emit).toHaveBeenCalledWith(selctedItem);
    });
  });

  describe('clearBtn', () => {
    it('should send the event to parent component', () => {
      spyOn(component.clearOutPutFn, 'emit');
      component.clearBtn();
      expect(component.clearOutPutFn.emit).toHaveBeenCalled();
    });
  });
});
