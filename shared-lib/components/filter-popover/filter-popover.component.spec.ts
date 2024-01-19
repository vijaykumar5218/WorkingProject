import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import {FilterPopoverComponent} from './filter-popover.component';
import {AccountService} from '@shared-lib/services/account/account.service';
import {of} from 'rxjs';
import {FilterList} from '@shared-lib/models/filter-sort.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';

describe('FilterPopoverComponent', () => {
  let component: FilterPopoverComponent;
  let fixture: ComponentFixture<FilterPopoverComponent>;
  let accountServiceSpy;
  let popoverCtrlSpy;
  let closeDialogSpy;
  let filterSortMockData;
  let slctItem;
  let onChangeSpy;
  let resetCheckboxSpy;
  let storedKeyArrMock;
  let benefitServiceSpy;

  beforeEach(
    waitForAsync(() => {
      (filterSortMockData = {
        filtListMock: [
          {
            label: 'Tr Type',
            values: [
              {name: 'Contr', key: '1', isChecked: false},
              {name: 'Ded', key: '2', isChecked: false},
            ],
          },
        ] as FilterList[],
      }),
        (slctItem = '1');
      storedKeyArrMock = ['1'];

      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'changeFilt',
        'setFiltSlcted',
        'getFiltSlcted',
      ]);
      benefitServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'changeFilt',
        'setFiltSlcted',
        'getFiltSlcted',
      ]);
      popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

      TestBed.configureTestingModule({
        declarations: [FilterPopoverComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: PopoverController, useValue: popoverCtrlSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FilterPopoverComponent);
      component = fixture.componentInstance;

      component.service = accountServiceSpy;

      closeDialogSpy = spyOn(component, 'closeDialog');
      onChangeSpy = spyOn(component, 'onChange');
      resetCheckboxSpy = spyOn(component, 'resetCheckbox');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChange', () => {
    beforeEach(() => {
      onChangeSpy.and.callThrough();
    });

    it('should load selectedFilter', () => {
      component.filterList = filterSortMockData.filtListMock;
      component.onChange(slctItem);
      expect(onChangeSpy).toHaveBeenCalledWith(slctItem);
      expect(component.selectedFilter).toEqual([
        {
          label: 'Tr Type',
          values: [],
        },
      ]);
    });

    it('should load selected checkbox to array if not exists', () => {
      component.filterList = [];
      component.onChange(slctItem);

      component.selctedCheckBox = [] as string[];

      component.selctedCheckBox.push(slctItem);
      expect(component.selctedCheckBox).toEqual(['1']);
    });

    it('should remove selected checkbox from array if exists', () => {
      component.filterList = [];
      component.selctedCheckBox = ['1'] as string[];
      component.onChange(slctItem);

      expect(component.selctedCheckBox).toEqual([]);
    });
  });

  describe('closeDialog', () => {
    it('should closeDialog and send data of changeFilt if click on Ok', () => {
      const selectedFilter = [
        {
          label: 'Tr Type',
          values: [
            {
              name: 'Contrib',
              key: '1',
            },
          ],
        },
      ];

      closeDialogSpy.and.callThrough();
      accountServiceSpy.changeFilt(selectedFilter);
      component.closeDialog(true);
      expect(accountServiceSpy.setFiltSlcted).toHaveBeenCalledWith([]);
      expect(accountServiceSpy.changeFilt).toHaveBeenCalledWith(selectedFilter);
      expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    });
    it('should closeDialog and send empty data of changeFilt if click on Cancel', () => {
      closeDialogSpy.and.callThrough();
      accountServiceSpy.changeFilt([]);
      component.closeDialog(false);
      expect(accountServiceSpy.changeFilt).toHaveBeenCalledWith([]);
      expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    it('should reset on ionViewDidEnter', () => {
      component.storedKeyArr = storedKeyArrMock;
      component.filterList = filterSortMockData.filtListMock;
      component.ionViewDidEnter();

      accountServiceSpy.getFiltSlcted.and.returnValue(
        Promise.resolve(of(storedKeyArrMock))
      );

      resetCheckboxSpy.and.callThrough();
      component.resetCheckbox();
      expect(resetCheckboxSpy).toHaveBeenCalled();
      expect(accountServiceSpy.getFiltSlcted).toHaveBeenCalled();
    });
  });
});
