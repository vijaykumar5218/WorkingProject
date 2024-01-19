import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import {FilterClaimsComponent} from './filter-claims.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {of} from 'rxjs';
import {FilterList} from '@shared-lib/models/filter-sort.model';

describe('FilterClaimsComponent', () => {
  let component: FilterClaimsComponent;
  let fixture: ComponentFixture<FilterClaimsComponent>;
  let benefitsServiceSpy;
  let filterAndSortData;
  let popoverCtrlSpy;
  let closeDialogSpy;
  let onChangeSpy;
  let slctItem;
  let selctedCheckBoxMock;
  let resetCheckboxSpy;
  let storedKeyArrMock;

  beforeEach(
    waitForAsync(() => {
      filterAndSortData = {
        filterList: [
          {
            label: 'Network',

            values: [
              {name: 'In Network', key: 'inNetwork'},
              {name: 'Out of Network', key: 'OutNetwork'},
            ],
          },

          {
            label: 'Category',

            values: [
              {
                name: 'Preferred Drugs',
                key: 'preferredDrugs',
              },
              {
                name: 'Outpatient Labs',
                key: 'outpatientLabPaths',
              },
            ],
          },
        ],

        sortList: [
          {
            label: 'Sort By',
            values: [
              {name: 'Ascending Date', value: 'asc'},
              {name: 'Descending Date', value: 'dsc'},
              {name: 'Lowest Claim', value: 'low'},
              {name: 'Highest Claim', value: 'high'},
            ],
          },
        ],
      };

      slctItem = 'preferredDrugs';

      storedKeyArrMock = ['preferredDrugs'];

      selctedCheckBoxMock = [
        {
          label: 'Network',
          values: [
            {name: 'In Network', key: 'inNetwork', isChecked: false},
            {name: 'Out of Network', key: 'OutNetwork', isChecked: false},
          ],
        },

        {
          label: 'Category',

          values: [
            {
              name: 'Preferred Drugs',
              key: 'preferredDrugs',
              isChecked: true,
            },
            {
              name: 'Outpatient Labs',
              key: 'outpatientLabPaths',
              isChecked: false,
            },
          ],
        },
      ] as FilterList[];

      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'changeFilt',
        'setFiltSlcted',
        'getFiltSlcted',
      ]);
      popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

      TestBed.configureTestingModule({
        declarations: [FilterClaimsComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: PopoverController, useValue: popoverCtrlSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FilterClaimsComponent);
      component = fixture.componentInstance;

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
      component.filterList = filterAndSortData.filterList;
      component.onChange(slctItem);
      expect(onChangeSpy).toHaveBeenCalledWith(slctItem);
      expect(component.selectedFilter).toEqual([
        {label: 'Network', values: []},
        {label: 'Category', values: []},
      ]);
    });

    it('should load selected checkbox to array if not exists', () => {
      component.filterList = [];
      component.onChange(slctItem);

      component.selctedCheckBox = [] as string[];

      component.selctedCheckBox.push(slctItem);
      expect(component.selctedCheckBox).toEqual(['preferredDrugs']);
    });

    it('should remove selected checkbox from array if exists', () => {
      component.filterList = [];
      component.selctedCheckBox = ['preferredDrugs'] as string[];
      component.onChange(slctItem);

      expect(component.selctedCheckBox).toEqual([]);
    });
  });

  describe('closeDialog', () => {
    it('should closeDialog and send data of changeFilt if click on Ok', () => {
      const selectedFilter = [
        {label: 'Network', values: []},
        {label: 'Category', values: []},
      ];

      closeDialogSpy.and.callThrough();
      benefitsServiceSpy.changeFilt(selectedFilter);
      component.closeDialog(true);
      expect(benefitsServiceSpy.setFiltSlcted).toHaveBeenCalledWith([]);
      expect(benefitsServiceSpy.changeFilt).toHaveBeenCalledWith(
        selectedFilter
      );
      expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    });
    it('should closeDialog and send empty data of changeFilt if click on Cancel', () => {
      closeDialogSpy.and.callThrough();
      benefitsServiceSpy.changeFilt([]);
      component.closeDialog(false);
      expect(benefitsServiceSpy.changeFilt).toHaveBeenCalledWith([]);
      expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('resetCheckbox', () => {
    it('should reset the filter checkbox list', () => {
      resetCheckboxSpy.and.callThrough();
      component.storedKeyArr = storedKeyArrMock;
      component.filterList = filterAndSortData.filterList;
      component.resetCheckbox();
      expect(resetCheckboxSpy).toHaveBeenCalled();
      expect(component.filterList).toEqual(selctedCheckBoxMock);
    });
  });

  describe('ionViewDidEnter', () => {
    it('should reset on ionViewDidEnter', () => {
      component.storedKeyArr = storedKeyArrMock;
      component.filterList = filterAndSortData.filterList;
      component.ionViewDidEnter();

      benefitsServiceSpy.getFiltSlcted.and.returnValue(
        Promise.resolve(of(storedKeyArrMock))
      );

      resetCheckboxSpy.and.callThrough();
      component.resetCheckbox();
      expect(resetCheckboxSpy).toHaveBeenCalled();
      expect(benefitsServiceSpy.getFiltSlcted).toHaveBeenCalled();
    });
  });
});
