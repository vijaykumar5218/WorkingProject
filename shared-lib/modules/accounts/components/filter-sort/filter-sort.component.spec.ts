import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';
import {FilterPopoverComponent} from '../../../../components/filter-popover/filter-popover.component';
import {AccountService} from '../../../../services/account/account.service';
import {SortPopoverComponent} from '../../../../components/sort-popover/sort-popover.component';

import {FilterSortComponent} from './filter-sort.component';

describe('FilterSortComponent', () => {
  let component: FilterSortComponent;
  let fixture: ComponentFixture<FilterSortComponent>;
  let popoverCtrlSpy;
  let accountServiceSpy;

  beforeEach(
    waitForAsync(() => {
      popoverCtrlSpy = jasmine.createSpyObj('PopoverController', [
        'create',
        'present',
      ]);

      TestBed.configureTestingModule({
        declarations: [FilterSortComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: PopoverController, useValue: popoverCtrlSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FilterSortComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('opnSorting', () => {
    it('should open Sorting PopUP', async () => {
      const modal = jasmine.createSpyObj('PopoverController', [
        'present',
        'create',
      ]);
      popoverCtrlSpy.create.and.returnValue(Promise.resolve(modal));
      const e = new Event('click');
      component.opnSorting(e);
      expect(popoverCtrlSpy.create).toHaveBeenCalledWith({
        component: SortPopoverComponent,
        event: e,
        cssClass: 'pop-over-class',
        componentProps: {
          sortList: component.sortList,
          service: accountServiceSpy,
        },
        mode: 'ios',
      });
    });
  });

  describe('opnFilter', () => {
    it('should open Sorting PopUP', async () => {
      const modal = jasmine.createSpyObj('PopoverController', [
        'present',
        'create',
      ]);
      popoverCtrlSpy.create.and.returnValue(Promise.resolve(modal));
      const e = new Event('click');
      component.opnFilter(e);
      expect(popoverCtrlSpy.create).toHaveBeenCalledWith({
        component: FilterPopoverComponent,
        event: e,
        cssClass: 'pop-over-class',
        componentProps: {
          filterList: component.filterList,
          service: accountServiceSpy,
        },
        mode: 'ios',
      });
    });
  });
});
