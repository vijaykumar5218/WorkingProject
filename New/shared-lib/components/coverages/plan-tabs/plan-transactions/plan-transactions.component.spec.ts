import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router, RouterModule} from '@angular/router';
import {IonicModule, PopoverController} from '@ionic/angular';
import {
  AllCategory,
  HealthDates,
} from '@shared-lib/components/coverages/models/chart.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import moment from 'moment';
import {PlanTransactionsComponent} from './plan-transactions.component';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {of, Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ElementRef} from '@angular/core';
import {SortPopoverComponent} from '../../../sort-popover/sort-popover.component';
import {DateRangeFilterComponent} from './date-range-filter/date-range-filter.component';
import {FilterPopoverComponent} from '../../../filter-popover/filter-popover.component';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {TPAClaimsData} from '@shared-lib/services/tpa-stream/models/tpa.model';
import {GroupingCategoryDetails} from '../../models/chart.model';
import * as pageText from './constants/pageText.json';
import {FilterList, FilterValues} from '../../../../models/filter-sort.model';
import {AccessService} from '@shared-lib/services/access/access.service';
import {AccessResult} from '@shared-lib/services/access/models/access.model';

describe('PlanTransactionsComponent', () => {
  let component: PlanTransactionsComponent;
  let fixture: ComponentFixture<PlanTransactionsComponent>;
  let benefitsServiceSpy;
  let consentServiceSpy;
  let checkAuthSpy;
  let healthData;
  let sharedUtilityServiceSpy;
  let getFilterDataSpy;
  let getSortDataSpy;
  let popOverControllerSpy;
  let filtData;
  let emptyFiltData;
  let groupMockData;
  let getSectionValueSpy;
  let getDateOptionSpy;
  let sortMockData;
  let dateRangeMockData;
  let filterModelData;
  let subscriptionFilterSpy;
  let subscriptionSortSpy;
  let subscriptionDateSpy;
  let tpaServiceSpy;
  let mergedArray;
  let routerSpy;
  let accessServiceSpy;
  let tpaFilterModelData;
  let thisYearMockData;
  let mockFilterChips;
  let storedKeyArrMock;
  let storeSlctdFilterChipsMock;
  let determineTPASpy;
  let initFilterMinMaxDatesSpy;

  const pagetext = pageText;

  beforeEach(
    waitForAsync(() => {
      mergedArray = [
        {
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 0,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths',
            },
            {
              inNetwork: false,
              outOfPocketCost: 0,
              providerName: 'DEARBORN SURGERY CENTER',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths2',
            },
            {
              inNetwork: true,
              outOfPocketCost: 8,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-02-28',
              serviceName: 'genericDrugs',
            },
            {
              inNetwork: false,
              outOfPocketCost: 0,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL Z',
              serviceDate: '2022-02-28',
              serviceName: 'genericDrugs2',
            },
          ],
        },
      ] as AllCategory[];
      healthData = {
        groupingCategoryDetails: {
          '2022-05': [
            {
              inNetwork: true,
              outOfPocketCost: 22,
              providerName: 'Provider_name_emr',
              serviceDate: '2022-05-13',
              serviceName: 'emergencyRoomServices',
            },
            {
              inNetwork: false,
              outOfPocketCost: 22,
              providerName: 'Provider_name_emr',
              serviceDate: '2022-05-13',
              serviceName: 'emergencyRoomServices',
            },
          ],
          '2022-07': [
            {
              inNetwork: true,
              outOfPocketCost: 22,
              providerName: 'Provider_name_emr',
              serviceDate: '2022-07-13',
              serviceName: 'emergencyRoomServices',
            },
            {
              inNetwork: false,
              outOfPocketCost: 22,
              providerName: 'Provider_name_emr',
              serviceDate: '2022-07-13',
              serviceName: 'emergencyRoomServices',
            },
          ],
        },
      };

      groupMockData = [
        {
          date: '2022-03',
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 0,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths',
            },
            {
              inNetwork: false,
              outOfPocketCost: 0,
              providerName: 'DEARBORN SURGERY CENTER',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths2',
            },
          ],
        },
        {
          date: '2022-02',
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 8,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-02-28',
              serviceName: 'genericDrugs',
            },
            {
              inNetwork: false,
              outOfPocketCost: 0,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL Z',
              serviceDate: '2022-02-28',
              serviceName: 'genericDrugs2',
            },
          ],
        },
      ];

      filtData = [
        {
          label: 'Network',
          values: [{name: 'In Network', key: 'inNetwork', isChecked: true}],
        },
        {
          label: 'Category',
          values: [
            {name: 'Preferred Drugs', key: 'preferredDrugs', isChecked: true},
            {
              name: 'Outpatient Labs',
              key: 'outpatientLabPaths',
              isChecked: true,
            },
          ],
        },
      ];

      sortMockData = [
        {
          date: '2022-03',
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 100,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths',
            },
            {
              inNetwork: true,
              outOfPocketCost: 200,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-03-24',
              serviceName: 'genericDrugs',
              drugName: 'Ketorolac Tromethamine',
            },
          ],
        },
        {
          date: '2022-02',
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 100,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-02-25',
              serviceName: 'outpatientLabPaths',
            },
            {
              inNetwork: true,
              outOfPocketCost: 200,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-02-24',
              serviceName: 'genericDrugs',
              drugName: 'Ketorolac Tromethamine',
            },
          ],
        },
      ];

      dateRangeMockData = [
        {
          date: '2022-09',
          name: [
            {
              serviceDate: '2022-09-20',
            },
          ],
        },
        {
          date: '2022-08',
          name: [
            {
              serviceDate: '2022-08-20',
            },
          ],
        },
        {
          date: '2022-03',
          name: [
            {
              serviceDate: '2022-03-20',
            },
          ],
        },
        {
          date: '2022-02',
          name: [
            {
              serviceDate: '2022-02-20',
            },
          ],
        },
        {
          date: '2021-08',
          name: [
            {
              serviceDate: '2021-08-20',
            },
          ],
        },
        {
          date: '2020-01',
          name: [
            {
              serviceDate: '2020-01-20',
            },
          ],
        },
      ] as AllCategory[];

      thisYearMockData = [
        {
          date: '2022-09',
          name: [
            {
              serviceDate: '2022-09-20',
            },
          ],
        },
        {
          date: '2022-08',
          name: [
            {
              serviceDate: '2022-08-20',
            },
          ],
        },
        {
          date: '2022-03',
          name: [
            {
              serviceDate: '2022-03-20',
            },
          ],
        },
        {
          date: '2022-02',
          name: [
            {
              serviceDate: '2022-02-20',
            },
          ],
        },
        {
          date: '2021-08',
          name: [],
        },
        {
          date: '2020-01',
          name: [],
        },
      ] as AllCategory[];

      emptyFiltData = [
        {label: 'Network', values: []},

        {
          label: 'Category',
          values: [],
        },
      ];

      filterModelData = {
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
              {name: 'Specialist Care', key: 'specialVisits'},
              {name: 'Preventative Care', key: 'preventive'},
              {name: 'Generic Drugs', key: 'genericDrugs'},
              {name: 'X-rays', key: 'outpatientXrays'},
              {name: 'Primary Care', key: 'primaryVisits'},
              {
                name: 'Inpatient Care',
                key: 'inpatientHosptialCares',
              },
              {
                name: 'ER Services',
                key: 'emergencyRoomServices',
              },
              {
                name: 'Outpatient Surgery',
                key: 'outpatientSurgery',
              },
              {name: 'Other Services', key: 'other'},
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

      tpaFilterModelData = {
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
            values: pagetext.tpaFilterOptions,
          },
        ],
        sortList: [
          {
            label: 'Sort By',
            values: pagetext.tpaSortOptions,
          },
        ],
      };

      mockFilterChips = [
        {name: 'FilterChips1', key: 'chips1', enabled: true, isChecked: true},
        {name: 'FilterChips2', key: 'chips2', isChecked: true, enabled: true},
        {name: 'FilterChips3', key: 'chips3', isChecked: true, enabled: true},
      ];

      storeSlctdFilterChipsMock = [
        {
          label: 'Network',
          values: [
            {
              name: 'FilterChips1',
              key: 'chips1',
              enabled: true,
              isChecked: true,
            },
          ],
        },
        {
          label: 'Category',
          values: [
            {
              name: 'FilterChips2',
              key: 'chips2',
              isChecked: true,
              enabled: true,
            },
            {
              name: 'FilterChips3',
              key: 'chips3',
              isChecked: true,
              enabled: true,
            },
          ],
        },
      ] as FilterList[];

      storedKeyArrMock = ['chips1', 'chips2'];

      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
        'scrollToTop',
      ]);

      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'fetchSpending',
        'currentFilter',
        'currentSort',
        'getSectionValues',
        'currentDateOpt',
        'setFiltSlcted',
        'setSortSlcted',
        'getSortSlcted',
        'getFiltSlcted',
        'changeFilt',
      ]);

      consentServiceSpy = jasmine.createSpyObj('ConsentService', [
        'getMedicalConsent',
      ]);

      popOverControllerSpy = jasmine.createSpyObj('PopoverController', [
        'create',
        'present',
      ]);

      subscriptionFilterSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);

      subscriptionSortSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);

      subscriptionDateSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);

      tpaServiceSpy = jasmine.createSpyObj('TPAStreamService', ['getTPAData']);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);

      TestBed.configureTestingModule({
        declarations: [PlanTransactionsComponent],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: ConsentService, useValue: consentServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: PopoverController, useValue: popOverControllerSpy},
          {provide: TPAStreamService, useValue: tpaServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PlanTransactionsComponent);
      component = fixture.componentInstance;

      determineTPASpy = spyOn(component, 'determineTPA');
      checkAuthSpy = spyOn(component, 'checkAuthorization');
      getFilterDataSpy = spyOn(component, 'getFilterOptions');
      getSortDataSpy = spyOn(component, 'getSortOptions');
      getDateOptionSpy = spyOn(component, 'getDateOptions');
      getSectionValueSpy = spyOn(component, 'getSectionValue');

      component['subscriptionFilter'] = subscriptionFilterSpy;
      component['subscriptionSort'] = subscriptionSortSpy;
      component['subscriptionDate'] = subscriptionDateSpy;

      initFilterMinMaxDatesSpy = spyOn(component, 'initFilterMinMaxDates');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', async () => {
    sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
    component.isWeb = false;
    await component.ngOnInit();
    expect(component.determineTPA).toHaveBeenCalled();
    expect(sharedUtilityServiceSpy.getIsWeb).toHaveBeenCalled();
    expect(component.isWeb).toEqual(true);
    expect(component.getFilterOptions).toHaveBeenCalled();
    expect(component.getSortOptions).toHaveBeenCalled();
    expect(component.getSectionValue).toHaveBeenCalled();
    expect(component.getDateOptions).toHaveBeenCalled();
    expect(checkAuthSpy).toHaveBeenCalled();
    expect(component.initFilterMinMaxDates).toHaveBeenCalled();
  });

  describe('initFilterMinMaxDates', () => {
    let date;
    beforeEach(() => {
      initFilterMinMaxDatesSpy.and.callThrough();

      jasmine.clock().install();

      date = new Date('2022-02-05');
      jasmine.clock().mockDate(date);
    });

    it('should set min max date for toDate and fromDate pickers', () => {
      component.initFilterMinMaxDates();

      expect(component.fromMinDate).toEqual('2019-02-04');
      expect(component.fromMaxDate).toEqual('2022-02-04');
      expect(component.toMinDate).toEqual('2019-02-04');
      expect(component.toMaxDate).toEqual('2022-02-04');
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  describe('determineTPA', () => {
    beforeEach(() => {
      determineTPASpy.and.callThrough();
    });

    it('should set isTpa to true if is Tpa', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          enableTPA: 'Y',
        } as AccessResult)
      );
      await component.determineTPA();
      expect(component.isTpa).toBeTrue();
    });

    it('should set isTpa to false if not Tpa', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          enableTPA: 'N',
        } as AccessResult)
      );
      await component.determineTPA();
      expect(component.isTpa).toBeFalse();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should call checkAuthorization if the subscription is not set yet', () => {
      component.consentSubscription = undefined;
      component.ionViewWillEnter();
      expect(checkAuthSpy).toHaveBeenCalled();
    });

    it('should not call checkAuthorization if the subscription is already set', () => {
      component.consentSubscription = new Subscription();
      checkAuthSpy.calls.reset();
      component.ionViewWillEnter();
      expect(checkAuthSpy).not.toHaveBeenCalled();
    });
  });

  describe('checkAuthorization', () => {
    beforeEach(() => {
      checkAuthSpy.and.callThrough();
      component.topmostElement = {
        nativeElement: jasmine.createSpyObj('nativeElement', [
          'scrollIntoView',
        ]),
      } as ElementRef;
      spyOn(component.consent, 'emit');
    });

    it('should just call getSpending and set hasConsent to true if isTpa', () => {
      component.isTpa = true;
      component.hasConsent = false;
      spyOn(component, 'getSpending');

      component.checkAuthorization();

      expect(component.hasConsent).toBeTrue();
      expect(component.getSpending).toHaveBeenCalled();
    });

    it('should call getMedicalConsent and set property', () => {
      component.hasConsent = true;
      component.isTpa = false;
      consentServiceSpy.getMedicalConsent.and.returnValue(of(false));

      component.checkAuthorization();
      expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalled();
      expect(component.hasConsent).toBeFalse();
      expect(component.consent.emit).toHaveBeenCalledWith(false);
    });

    it('should call getMedicalConsent and call loadInsightsData if true', () => {
      spyOn(component, 'getSpending');

      component.hasConsent = true;
      component.isTpa = false;
      consentServiceSpy.getMedicalConsent.and.returnValue(of(true));

      component.checkAuthorization();
      expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalled();
      expect(component.hasConsent).toBeTrue();
      expect(component.consent.emit).toHaveBeenCalledWith(true);
      expect(component.getSpending).toHaveBeenCalled();
    });

    it('Should call scrollToTop when isWeb would be true', () => {
      spyOn(component, 'getSpending');
      consentServiceSpy.getMedicalConsent.and.returnValue(of(true));
      component.isWeb = true;
      component.isTpa = false;
      component.checkAuthorization();
      expect(sharedUtilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
        component.topmostElement
      );
    });

    it('Should not call scrollToTop when isWeb would be false', () => {
      spyOn(component, 'getSpending');
      consentServiceSpy.getMedicalConsent.and.returnValue(of(true));
      component.isWeb = false;
      component.isTpa = false;
      component.checkAuthorization();
      expect(sharedUtilityServiceSpy.scrollToTop).not.toHaveBeenCalled();
    });
  });

  describe('getSpending', () => {
    beforeEach(() => {
      spyOn(component, 'getSpendingRegular');
      spyOn(component, 'getSpendingTPA');
    });

    it('should call getSpendingRegular if not tpa', () => {
      component.isTpa = false;
      component.getSpending();
      expect(component.getSpendingRegular).toHaveBeenCalled();
    });

    it('should call getSpendingTPA if tpa', () => {
      component.isTpa = true;
      component.getSpending();
      expect(component.getSpendingTPA).toHaveBeenCalled();
    });
  });

  describe('getSpendingRegular', () => {
    beforeEach(() => {
      benefitsServiceSpy.fetchSpending.and.returnValue(
        Promise.resolve(healthData)
      );
      spyOn(component, 'createGroupDetails');
    });

    it('should load healthData', async () => {
      await component.getSpendingRegular();

      const healthDates = {
        startDate: moment()
          .startOf('year')
          .add(-2, 'years')
          .format('MM/DD/YYYY'),
        endDate: moment()
          .endOf('year')
          .format('MM/DD/YYYY'),
      } as HealthDates;

      component.healthDates = healthDates;

      expect(benefitsServiceSpy.fetchSpending).toHaveBeenCalledWith(
        healthDates,
        true
      );
      expect(component.createGroupDetails).toHaveBeenCalledWith(
        healthData.groupingCategoryDetails
      );
    });
  });

  describe('manageCarriers', () => {
    it('should emit event for manageCarriers', () => {
      component.manageButtonEvent = jasmine.createSpyObj('ManageEvent', [
        'emit',
      ]);

      component.manageCarriers();
      expect(component.manageButtonEvent.emit).toHaveBeenCalled();
    });
  });

  describe('getSpendingTPA', () => {
    it('should call getTPAData and then transform it', () => {
      spyOn(component, 'createGroupDetails');
      const data: TPAClaimsData = {
        memberId: 12345,
        claims: [],
        carriers: [],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(data));

      component.getSpendingTPA();

      expect(tpaServiceSpy.getTPAData).toHaveBeenCalled();
      expect(component.createGroupDetails).toHaveBeenCalledWith(
        data.groupingCategoryDetails
      );
    });
  });

  describe('createGroupDetails', () => {
    beforeEach(() => {
      spyOn(component, 'checkAndDisableFilters');
      spyOn(component, 'gethealthDates');
      spyOn(component, 'filterData');
    });
    it('should load groupData', () => {
      component.groupData = [];
      component.createGroupDetails(healthData.groupingCategoryDetails);

      expect(component.groupData).toEqual([
        {date: '2022-05', name: healthData.groupingCategoryDetails['2022-05']},
        {date: '2022-07', name: healthData.groupingCategoryDetails['2022-07']},
      ]);
      expect(benefitsServiceSpy.setFiltSlcted).toHaveBeenCalledWith([]);
      expect(component.checkAndDisableFilters).toHaveBeenCalled();
      expect(component.gethealthDates).toHaveBeenCalled();
      expect(benefitsServiceSpy.setFiltSlcted).toHaveBeenCalledWith([]);
      expect(component.filterData).toHaveBeenCalledWith(
        component.storeSelectedFilter
      );
    });
    it('should not load groupData', () => {
      healthData = null;
      component.createGroupDetails(healthData);
      expect(component.groupData).toEqual([]);
      expect(benefitsServiceSpy.setFiltSlcted).toHaveBeenCalledWith([]);
    });
  });

  describe('checkAndDisableFilters', () => {
    it('should not do anything if groupData or filterList is null', () => {
      component.filterList = null;
      component.groupData = null;

      component.checkAndDisableFilters();

      expect(component.filterList).toBeNull();
      expect(component.groupData).toBeNull();
    });

    it('should loop through filter options and disable options that have no data', () => {
      component.filterList = [
        {
          label: 'Network',
          values: [
            {
              name: 'In Network',
              key: 'inNetwork',
              isChecked: false,
              enabled: false,
            },
            {
              name: 'Out of Network',
              key: 'OutNetwork',
              isChecked: false,
              enabled: false,
            },
          ],
        },
        {
          label: 'Category',
          values: [
            {
              name: 'Specialist Care',
              key: 'specialVisits',
              isChecked: false,
              enabled: false,
            },
            {
              name: 'Preventative Care',
              key: 'preventive',
              isChecked: false,
              enabled: false,
            },
            {
              name: 'Generic Drugs',
              key: 'genericDrugs',
              isChecked: false,
              enabled: false,
            },
            {
              name: 'X-rays',
              key: 'outpatientXrays',
              isChecked: false,
              enabled: false,
            },
            {
              name: 'Primary Care',
              key: 'primaryVisits',
              isChecked: false,
              enabled: false,
            },
            {
              name: 'Other Services',
              key: 'other',
              isChecked: false,
              enabled: false,
            },
          ],
        },
      ];
      component.groupData = [
        {
          date: '2022-02',
          name: [
            {
              drugName: 'Ketorolac Tromethamine',
              inNetwork: true,
              outOfPocketCost: 200,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-02-24',
              serviceName: 'specialVisits',
            },
            {
              inNetwork: true,
              outOfPocketCost: 100,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-02-25',
              serviceName: 'preventive',
            },
          ],
        },
        {
          date: '2022-03',
          name: [
            {
              drugName: 'Ketorolac Tromethamine',
              inNetwork: true,
              outOfPocketCost: 200,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-03-24',
              serviceName: 'genericDrugs',
            },
            {
              inNetwork: true,
              outOfPocketCost: 100,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-03-25',
              serviceName: 'primaryVisits',
            },
          ],
        },
      ] as AllCategory[];

      component.checkAndDisableFilters();

      expect(component.filterList).toEqual([
        {
          label: 'Network',
          values: [
            {
              name: 'In Network',
              key: 'inNetwork',
              isChecked: false,
              enabled: true,
            },
            {
              name: 'Out of Network',
              key: 'OutNetwork',
              isChecked: false,
              enabled: false,
            },
          ],
        },
        {
          label: 'Category',
          values: [
            {
              name: 'Specialist Care',
              key: 'specialVisits',
              isChecked: false,
              enabled: true,
            },
            {
              name: 'Preventative Care',
              key: 'preventive',
              isChecked: false,
              enabled: true,
            },
            {
              name: 'Generic Drugs',
              key: 'genericDrugs',
              isChecked: false,
              enabled: true,
            },
            {
              name: 'X-rays',
              key: 'outpatientXrays',
              isChecked: false,
              enabled: false,
            },
            {
              name: 'Primary Care',
              key: 'primaryVisits',
              isChecked: false,
              enabled: true,
            },
            {
              name: 'Other Services',
              key: 'other',
              isChecked: false,
              enabled: false,
            },
          ],
        },
      ]);
    });
  });

  describe('opnFilter', () => {
    it('should open Filter PopUP', async () => {
      const modal = jasmine.createSpyObj('PopoverController', [
        'present',
        'create',
      ]);
      popOverControllerSpy.create.and.returnValue(Promise.resolve(modal));
      const e = new Event('click');
      component.opnFilter(e);
      expect(popOverControllerSpy.create).toHaveBeenCalledWith({
        component: FilterPopoverComponent,
        event: e,
        cssClass: 'pop-over-class',
        componentProps: {
          filterList: component.filterList,
          service: benefitsServiceSpy,
        },
        mode: 'ios',
      });
    });
  });

  describe('opnSorting', () => {
    it('should open Sorting PopUP', async () => {
      const modal = jasmine.createSpyObj('PopoverController', [
        'present',
        'create',
      ]);
      popOverControllerSpy.create.and.returnValue(Promise.resolve(modal));
      const e = new Event('click');
      component.opnSorting(e);
      expect(popOverControllerSpy.create).toHaveBeenCalledWith({
        component: SortPopoverComponent,
        event: e,
        cssClass: 'pop-over-class',
        componentProps: {
          sortList: component.sortList,
          service: benefitsServiceSpy,
        },
        mode: 'ios',
      });
    });
  });

  describe('opnDateRangeFilter', () => {
    it('should open date ranege PopUP', async () => {
      const modal = jasmine.createSpyObj('PopoverController', [
        'present',
        'create',
      ]);
      popOverControllerSpy.create.and.returnValue(Promise.resolve(modal));
      const e = new Event('click');
      component.opnDateRangeFilter(e);
      expect(popOverControllerSpy.create).toHaveBeenCalledWith({
        component: DateRangeFilterComponent,
        event: e,
        cssClass: 'pop-over-class',
        componentProps: {
          dateRangeList: component.dateRangeList,
          selectedDate: component.selectedRangeType,
        },
        mode: 'ios',
      });
    });
  });

  describe('getFilterOptions', () => {
    it('should call filterData', () => {
      getFilterDataSpy.and.callThrough();
      benefitsServiceSpy.currentFilter.and.returnValue(of(filtData));
      spyOn(component, 'filterData');
      spyOn(component, 'createFilterChips');
      component.getFilterOptions();
      expect(benefitsServiceSpy.currentFilter).toHaveBeenCalled();
      expect(component.filterData).toHaveBeenCalledWith(filtData);
      expect(component.createFilterChips).toHaveBeenCalled();
    });
  });

  describe('getSortOptions', () => {
    it('should call sortData', async () => {
      spyOn(component, 'filterData');
      getSortDataSpy.and.callThrough();
      benefitsServiceSpy.currentSort.and.returnValue(of('string'));
      component.getSortOptions();
      expect(benefitsServiceSpy.currentSort).toHaveBeenCalled();
      expect(component.sortOption).toEqual('string');
      expect(component.filterData).toHaveBeenCalledWith(
        component.storeSelectedFilter
      );
    });
  });

  describe('getDateOptions', () => {
    it('should call date range options', async () => {
      spyOn(component, 'gethealthDates');
      getDateOptionSpy.and.callThrough();
      benefitsServiceSpy.currentDateOpt.and.returnValue(of('dateopt'));
      component.getDateOptions();
      expect(component.selectedRangeType).toEqual('dateopt');
      expect(component.gethealthDates).toHaveBeenCalled();
    });
  });

  describe('getSectionValue', () => {
    beforeEach(() => {
      getSectionValueSpy.and.callThrough();
      benefitsServiceSpy.getSectionValues.and.returnValue(
        Promise.resolve(filterModelData)
      );
      spyOn(component, 'checkAndDisableFilters');
    });
    it('should load filterlist and sortlist labels to popup', async () => {
      await component.getSectionValue();
      expect(benefitsServiceSpy.getSectionValues).toHaveBeenCalled();
      expect(component.filterList).toEqual(filterModelData.filterList);
      expect(component.sortList).toEqual(filterModelData.sortList);
    });

    it('should load filterList and sortList and replace bst labels with TPA ones if isTpa', async () => {
      component.isTpa = true;
      await component.getSectionValue();
      expect(benefitsServiceSpy.getSectionValues).toHaveBeenCalled();
      expect(component.filterList).toEqual(tpaFilterModelData.filterList);
      expect(component.sortList).toEqual(tpaFilterModelData.sortList);
    });

    it('should call checkAndDisableFilters', async () => {
      await component.getSectionValue();
      expect(component.checkAndDisableFilters).toHaveBeenCalled();
    });
  });

  describe('filterAllCategoryItem', () => {
    let nameItem1;
    let nameItem2;
    let nameItem3;
    let nameItem4;

    beforeEach(() => {
      nameItem1 = {
        inNetwork: true,
        outOfPocketCost: 0,
        providerName: 'provider',
        serviceDate: '01/01/1970',
        serviceName: 'test_service1',
        lastFilledDate: '01/01/1970',
        drugName: 'drug',
      };
      nameItem2 = {
        inNetwork: false,
        outOfPocketCost: 0,
        providerName: 'provider',
        serviceDate: '01/01/1970',
        serviceName: 'test_service2',
        lastFilledDate: '01/01/1970',
        drugName: 'drug',
      };
      nameItem3 = {
        inNetwork: true,
        outOfPocketCost: 0,
        providerName: 'provider',
        serviceDate: '01/01/1970',
        serviceName: 'test_service2',
        lastFilledDate: '01/01/1970',
        drugName: 'drug',
      };
      nameItem4 = {
        inNetwork: false,
        outOfPocketCost: 0,
        providerName: 'provider',
        serviceDate: '01/01/1970',
        serviceName: 'test_service1',
        lastFilledDate: '01/01/1970',
        drugName: 'drug',
      };
    });

    it('should take in and item and return it unfiltered if no filter values', () => {
      const item = {
        date: 'test_date',
        name: [nameItem1, nameItem2],
      };
      const filterData = [
        {
          label: 'In Network',
          values: [],
        },
        {
          label: 'Category',
          values: [],
        },
      ];

      const result = component.filterAllCategoryItem(item, filterData);
      expect(result).toEqual([nameItem1, nameItem2]);
    });

    it('should take in and item and return only in network items if in network selected', () => {
      const item = {
        date: 'test_date',
        name: [nameItem1, nameItem2],
      };
      const filterData = [
        {
          label: 'In Network',
          values: [
            {
              name: 'In Network',
              key: 'inNetwork',
              isChecked: true,
            },
          ],
        },
        {
          label: 'Category',
          values: [],
        },
      ];

      const result = component.filterAllCategoryItem(item, filterData);
      expect(result).toEqual([nameItem1]);
    });

    it('should take in and item and return only out of network items if out of network selected', () => {
      const item = {
        date: 'test_date',
        name: [nameItem1, nameItem2],
      };
      const filterData = [
        {
          label: 'In Network',
          values: [
            {
              name: 'Out Of Network',
              key: 'OutNetwork',
              isChecked: true,
            },
          ],
        },
        {
          label: 'Category',
          values: [],
        },
      ];

      const result = component.filterAllCategoryItem(item, filterData);
      expect(result).toEqual([nameItem2]);
    });

    it('should take in and item and return only items with service 1 if service 1 is selected and no network selected', () => {
      const item = {
        date: 'test_date',
        name: [nameItem1, nameItem4, nameItem3],
      };
      const filterData = [
        {
          label: 'In Network',
          values: [],
        },
        {
          label: 'Category',
          values: [
            {
              name: 'Test Service 1',
              key: 'test_service1',
              isChecked: true,
            },
          ],
        },
      ];

      const result = component.filterAllCategoryItem(item, filterData);
      expect(result).toEqual([nameItem1, nameItem4]);
    });

    it('should take in and item and return only item with in network and service 1 if that is the selection', () => {
      const item = {
        date: 'test_date',
        name: [nameItem1, nameItem2, nameItem3, nameItem4],
      };
      const filterData = [
        {
          label: 'In Network',
          values: [
            {
              name: 'In Network',
              key: 'inNetwork',
              isChecked: true,
            },
          ],
        },
        {
          label: 'Category',
          values: [
            {
              name: 'Test Service 1',
              key: 'test_service1',
              isChecked: true,
            },
          ],
        },
      ];

      const result = component.filterAllCategoryItem(item, filterData);
      expect(result).toEqual([nameItem1]);
    });

    it('should take in and item and return only item with out of network and service 2 if that is the selection', () => {
      const item = {
        date: 'test_date',
        name: [nameItem1, nameItem2, nameItem3, nameItem4],
      };
      const filterData = [
        {
          label: 'Out Of Network',
          values: [
            {
              name: 'Out Of Network',
              key: 'OutNetwork',
              isChecked: true,
            },
          ],
        },
        {
          label: 'Category',
          values: [
            {
              name: 'Test Service 2',
              key: 'test_service2',
              isChecked: true,
            },
          ],
        },
      ];

      const result = component.filterAllCategoryItem(item, filterData);
      expect(result).toEqual([nameItem2]);
    });
  });

  describe('filterData', () => {
    let filterAllSpy;
    beforeEach(() => {
      filterAllSpy = spyOn(component, 'filterAllCategoryItem').and.returnValue(
        groupMockData[0].name
      );

      spyOn(component, 'filterByDateRange');
      spyOn(component, 'sortData');
    });

    it('it should set filteredGroupData to groupData when filters are not initialized', () => {
      component.groupData = thisYearMockData;
      component.filterData([]);

      expect(component.filteredGroupData).toEqual(thisYearMockData);
    });

    it('it should set filteredGroupData to groupData when filters are empty', () => {
      component.groupData = thisYearMockData;
      component.filterData(emptyFiltData);

      expect(component.filteredGroupData).toEqual(thisYearMockData);
    });

    it('should always call filterbyDate and sortData', () => {
      component.filterData(emptyFiltData);

      expect(component.filterByDateRange).toHaveBeenCalledWith(
        component.filteredGroupData
      );
      expect(component.sortData).toHaveBeenCalledWith(component.sortOption);
    });

    it('should call filterAllCategoryItem for each item in group data', () => {
      const healthDates = {
        startDate: '2022-01-01',
        endDate: '2022-31-01',
      } as HealthDates;

      component.healthDates = healthDates;

      component.groupData = groupMockData;

      component.filterData(filtData);
      expect(filterAllSpy.calls.all()[0].args[0]).toEqual(groupMockData[0]);
      expect(filterAllSpy.calls.all()[0].args[1]).toEqual(filtData);
      expect(filterAllSpy.calls.all()[1].args[0]).toEqual(groupMockData[1]);
      expect(filterAllSpy.calls.all()[1].args[1]).toEqual(filtData);

      expect(component.filteredGroupData).toEqual([
        {
          date: '2022-03',
          name: groupMockData[0].name,
        },
        {
          date: '2022-02',
          name: groupMockData[0].name,
        },
      ]);
    });
  });

  describe('sortData', () => {
    beforeEach(() => {
      component.filteredGroupData = sortMockData;
    });

    it('it should sort the groupData ascending order', () => {
      const ascData = [
        {
          date: '2022-02',
          name: [
            {
              drugName: 'Ketorolac Tromethamine',
              inNetwork: true,
              outOfPocketCost: 200,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-02-24',
              serviceName: 'genericDrugs',
            },
            {
              inNetwork: true,
              outOfPocketCost: 100,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-02-25',
              serviceName: 'outpatientLabPaths',
            },
          ],
        },
        {
          date: '2022-03',
          name: [
            {
              drugName: 'Ketorolac Tromethamine',
              inNetwork: true,
              outOfPocketCost: 200,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-03-24',
              serviceName: 'genericDrugs',
            },
            {
              inNetwork: true,
              outOfPocketCost: 100,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths',
            },
          ],
        },
      ] as AllCategory[];

      component.storeSelectedFilter = [
        {
          label: 'Network',
          values: [{name: 'In Network', key: 'inNetwork', isChecked: true}],
        },
        {
          label: 'Category',
          values: [
            {name: 'Generic Drugs', key: 'genericDrugs', isChecked: true},
          ],
        },
      ];

      component.sortData('asc');
      expect(component.filteredGroupData).toEqual(ascData);
    });

    it('it should sort the groupData descending order', () => {
      const dscData = [
        {
          date: '2022-03',
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 100,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths',
            },

            {
              drugName: 'Ketorolac Tromethamine',
              inNetwork: true,
              outOfPocketCost: 200,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-03-24',
              serviceName: 'genericDrugs',
            },
          ],
        },
        {
          date: '2022-02',
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 100,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-02-25',
              serviceName: 'outpatientLabPaths',
            },

            {
              drugName: 'Ketorolac Tromethamine',
              inNetwork: true,
              outOfPocketCost: 200,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-02-24',
              serviceName: 'genericDrugs',
            },
          ],
        },
      ] as AllCategory[];

      component.storeSelectedFilter = [
        {
          label: 'Network',
          values: [{name: 'In Network', key: 'inNetwork', isChecked: true}],
        },
        {
          label: 'Category',
          values: [
            {name: 'Generic Drugs', key: 'genericDrugs', isChecked: true},
          ],
        },
      ];

      component.sortData('dsc');
      expect(component.filteredGroupData).toEqual(dscData);
    });

    it('it should sort the groupData lower order', () => {
      const lowData = [
        {
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 0,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths',
            },
            {
              inNetwork: false,
              outOfPocketCost: 0,
              providerName: 'DEARBORN SURGERY CENTER',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths2',
            },
            {
              inNetwork: false,
              outOfPocketCost: 0,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL Z',
              serviceDate: '2022-02-28',
              serviceName: 'genericDrugs2',
            },
            {
              inNetwork: true,
              outOfPocketCost: 8,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-02-28',
              serviceName: 'genericDrugs',
            },
          ],
        },
      ] as AllCategory[];

      component.filteredGroupData = mergedArray;
      spyOn(component, 'listWithoutMonth');
      component.sortData('low');

      expect(component.filteredGroupData).toEqual(lowData);
    });

    it('it should sort the groupData higher order', () => {
      const highData = [
        {
          name: [
            {
              inNetwork: true,
              outOfPocketCost: 8,
              providerName: 'MONROE PHARMACY',
              serviceDate: '2022-02-28',
              serviceName: 'genericDrugs',
            },
            {
              inNetwork: true,
              outOfPocketCost: 0,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL C',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths',
            },
            {
              inNetwork: false,
              outOfPocketCost: 0,
              providerName: 'DEARBORN SURGERY CENTER',
              serviceDate: '2022-03-25',
              serviceName: 'outpatientLabPaths2',
            },
            {
              inNetwork: false,
              outOfPocketCost: 0,
              providerName: 'OAKWOOD HOSPITAL AND MEDICAL Z',
              serviceDate: '2022-02-28',
              serviceName: 'genericDrugs2',
            },
          ],
        },
      ] as AllCategory[];

      component.filteredGroupData = mergedArray;
      spyOn(component, 'listWithoutMonth');
      component.sortData('high');
      expect(component.filteredGroupData).toEqual(highData);
    });

    it('it should sort the groupData not selected anything', () => {
      component.sortData('');
      expect(component.filteredGroupData).toEqual(sortMockData);
    });
  });

  describe('fromDateChange', () => {
    it('should set fromDate and call customDateRange', () => {
      spyOn(component, 'customDateRange');
      const val = {
        detail: {
          value: '1999-02-12',
        },
      } as CustomEvent;
      component.toDate = '1920-02-30';
      component.fromDateChange(val);
      expect(component.fromDate).toEqual('1999-02-12');
      expect(component.customDateRange).toHaveBeenCalledWith(
        '1999-02-12',
        '1920-02-30'
      );
    });
  });

  describe('toDateChange', () => {
    it('should set toDate and call customDateRange', () => {
      spyOn(component, 'customDateRange');
      const val = {
        detail: {
          value: '1999-02-12',
        },
      } as CustomEvent;
      component.fromDate = '1920-02-30';
      component.toDateChange(val);
      expect(component.toDate).toEqual('1999-02-12');
      expect(component.customDateRange).toHaveBeenCalledWith(
        '1920-02-30',
        '1999-02-12'
      );
    });
  });

  describe('customDateRange', () => {
    let healthData;
    beforeEach(() => {
      benefitsServiceSpy.fetchSpending.and.returnValue(
        Promise.resolve(healthData)
      );
      spyOn(component, 'createGroupDetails');
    });

    it('should load healthData with custom dates', async () => {
      const fromDate = '01/01/1111';
      const toDate = '12/12/2222';
      const healthDates = {
        startDate: moment(fromDate).format('YYYY-MM-DD'),
        endDate: moment(toDate).format('YYYY-MM-DD'),
      } as HealthDates;

      component.healthDates = healthDates;
      component.customDateRange(fromDate, toDate);
      expect(component.healthDates).toEqual({
        startDate: '1111-01-01',
        endDate: '2222-12-12',
      });
    });

    it('should set toMinDate to fromDate and fromMaxDate to toDate', () => {
      const fromDate = '01/01/1111';
      const toDate = '12/12/2222';

      component.customDateRange(fromDate, toDate);
      expect(component.toMinDate).toEqual('1111-01-01');
      expect(component.fromMaxDate).toEqual('2222-12-12');
    });
  });

  describe('gethealthDates', () => {
    beforeEach(() => {
      component.groupData = dateRangeMockData;
      jasmine.clock().install();

      const today = new Date('2022-09-25');
      jasmine.clock().mockDate(today);

      spyOn(component, 'filterData');
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('should set fromDate and toDate to healthDates', () => {
      component.selectedRangeType = 'thisYear';
      component.gethealthDates();
      expect(component.fromDate).toEqual('2022-01-01');
      expect(component.toDate).toEqual('2022-12-31');
    });

    it('should load healthData if selectedRangeType == "thisYear" ', async () => {
      component.selectedRangeType = 'thisYear';
      component.gethealthDates();

      expect(component.healthDates).toEqual({
        startDate: '2022-01-01',
        endDate: '2022-12-31',
      });
    });

    it('should load healthData if selectedRangeType == "lastYear" ', async () => {
      component.selectedRangeType = 'lastYear';
      component.gethealthDates();

      expect(component.healthDates).toEqual({
        startDate: '2021-01-01',
        endDate: '2021-12-31',
      });
    });

    it('should load healthData if selectedRangeType == "30Days" ', async () => {
      component.selectedRangeType = '30Days';
      component.gethealthDates();

      expect(component.healthDates).toEqual({
        startDate: moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      });
    });

    it('should load healthData if selectedRangeType == "3Months" ', async () => {
      component.selectedRangeType = '3Months';
      component.gethealthDates();

      expect(component.healthDates).toEqual({
        startDate: moment()
          .subtract(90, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      });
    });

    it('should load healthData if selectedRangeType == "6Months" ', async () => {
      component.selectedRangeType = '6Months';
      component.gethealthDates();

      expect(component.healthDates).toEqual({
        startDate: moment()
          .subtract(180, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      });
    });

    it('should load healthData if selectedRangeType == "12Months" ', async () => {
      component.selectedRangeType = '12Months';
      component.gethealthDates();

      expect(component.healthDates).toEqual({
        startDate: moment()
          .subtract(360, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      });
    });

    it('should call filterData every time', () => {
      component.gethealthDates();
      expect(component.filterData).toHaveBeenCalledWith(
        component.storeSelectedFilter
      );
    });
  });

  describe('filterByDateRange', () => {
    it('should filter data by date range', () => {
      component.healthDates = {
        startDate: '2022-01-01',
        endDate: '2022-12-31',
      };
      const yearThis = [
        {
          date: '2022-09',
          name: [
            {
              serviceDate: '2022-09-20',
            },
          ],
        },
        {
          date: '2022-08',
          name: [
            {
              serviceDate: '2022-08-20',
            },
          ],
        },
        {
          date: '2022-03',
          name: [
            {
              serviceDate: '2022-03-20',
            },
          ],
        },
        {
          date: '2022-02',
          name: [
            {
              serviceDate: '2022-02-20',
            },
          ],
        },
        {
          date: '2021-08',
          name: [],
        },
        {
          date: '2020-01',
          name: [],
        },
      ] as AllCategory[];

      component.filterByDateRange(dateRangeMockData);
      expect(component.filteredGroupData).toEqual(yearThis);
    });
  });

  describe('listWithoutMonth', () => {
    it('should create a list of data without month header', () => {
      component.filteredGroupData = groupMockData;
      component.listWithoutMonth();
      expect(component.filteredGroupData).toEqual(mergedArray);
    });
  });

  describe('ionViewWillLeave', () => {
    it('should unsubscribe from consentSubscription', () => {
      const spy = jasmine.createSpyObj('Sub', ['unsubscribe']);
      component.consentSubscription = spy;
      component.ionViewWillLeave();
      expect(spy.unsubscribe).toHaveBeenCalled();
      expect(component.consentSubscription).toBeNull();
    });
  });

  describe('clearAllChips', () => {
    it('should clear all the selcted chips and reset filter data to default', () => {
      component.storeSelectedFilter = storeSlctdFilterChipsMock;
      component.filterChips = mockFilterChips as FilterValues[];
      component.clearAllChips();
      expect(component.storeSelectedFilter).toEqual([]);
      expect(component.filterChips).toEqual([]);
      expect(benefitsServiceSpy.setFiltSlcted).toHaveBeenCalledWith([]);
      expect(benefitsServiceSpy.changeFilt).toHaveBeenCalledWith(
        component.storeSelectedFilter
      );
    });
  });

  describe('onRemoveChips', () => {
    let clickedItem;
    beforeEach(() => {
      component.storeSelectedFilter = storeSlctdFilterChipsMock;

      clickedItem = {
        name: 'FilterChips2',
        key: 'chips2',
        isChecked: true,
        enabled: true,
      } as FilterValues;

      component.filterChips = mockFilterChips as FilterValues[];

      spyOn(component, 'filterData');
      component.storedKeyArr = storedKeyArrMock;

      benefitsServiceSpy.getFiltSlcted.and.returnValue(storedKeyArrMock);
    });

    it('should update the filterChips after remove  ', () => {
      component.onRemoveChips(clickedItem);
      expect(component.filterChips).toEqual([
        {name: 'FilterChips1', key: 'chips1', enabled: true, isChecked: true},
        {name: 'FilterChips3', key: 'chips3', isChecked: true, enabled: true},
      ]);
    });

    it('should update the storeSelectedFilter and call filterdata  ', () => {
      component.onRemoveChips(clickedItem);
      expect(component.storeSelectedFilter).toEqual([
        {
          label: 'Network',
          values: [
            {
              name: 'FilterChips1',
              key: 'chips1',
              enabled: true,
              isChecked: true,
            },
          ],
        },
        {
          label: 'Category',
          values: [
            {
              name: 'FilterChips3',
              key: 'chips3',
              isChecked: true,
              enabled: true,
            },
          ],
        },
      ]);
      expect(benefitsServiceSpy.changeFilt).toHaveBeenCalledWith(
        component.storeSelectedFilter
      );
    });

    it('should check storedKeyArr and setFiltSlcted if clikced item is there  ', () => {
      component.storedKeyArr = storedKeyArrMock as string[];
      component.onRemoveChips(clickedItem);
      expect(component.storedKeyArr).toEqual(['chips1']);
      expect(benefitsServiceSpy.setFiltSlcted).toHaveBeenCalledWith(
        component.storedKeyArr
      );
    });

    it('should check storedKeyArr and setFiltSlcted if data not removed ', () => {
      component.storedKeyArr = storedKeyArrMock as string[];
      benefitsServiceSpy.getFiltSlcted.and.returnValue([]);
      component.onRemoveChips(clickedItem);
      expect(component.storedKeyArr).toEqual([]);
      expect(benefitsServiceSpy.setFiltSlcted).not.toHaveBeenCalledWith(
        component.storedKeyArr
      );
    });
  });

  describe('createFilterChips', () => {
    it('create filterChips list of data', () => {
      component.filterChips = [] as FilterValues[];

      component.storeSelectedFilter = storeSlctdFilterChipsMock;

      component.createFilterChips();
      expect(component.filterChips).toEqual([
        {
          name: 'FilterChips1',
          key: 'chips1',
          enabled: true,
          isChecked: true,
        },
        {
          name: 'FilterChips2',
          key: 'chips2',
          isChecked: true,
          enabled: true,
        },
        {
          name: 'FilterChips3',
          key: 'chips3',
          isChecked: true,
          enabled: true,
        },
      ]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(subscriptionFilterSpy.unsubscribe).toHaveBeenCalled();
      expect(subscriptionSortSpy.unsubscribe).toHaveBeenCalled();
      expect(subscriptionDateSpy.unsubscribe).toHaveBeenCalled();
    });

    it('should unsubscribe from consentSubscription if it is set', () => {
      const tpaSpy = jasmine.createSpyObj('Sub', ['unsubscribe']);
      component.tpaSubscription = tpaSpy;
      component.consentSubscription = new Subscription();
      spyOn(component.consentSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.consentSubscription.unsubscribe).toHaveBeenCalled();
      expect(tpaSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
