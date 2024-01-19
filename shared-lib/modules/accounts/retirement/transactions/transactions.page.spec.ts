import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import {
  Account,
  ExternalLink,
} from '@shared-lib/services/account/models/accountres.model';
import {of} from 'rxjs';
import {TransactionsPage} from './transactions.page';
import {TransactionHistory} from '@shared-lib/services/account/models/retirement-account/transactions/transactions.model';
import {FilterList, FilterValues} from '../../../../models/filter-sort.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('TransactionsPage', () => {
  let component: TransactionsPage;
  let fixture: ComponentFixture<TransactionsPage>;
  let accountServiceSpy;
  let utilityServiceSpy;
  let getSortDataSpy;
  let getSectionValueSpy;
  let filterModelData;
  let hsaTransMockData;
  let getFilterDataSpy;
  let subscriptionFilterSpy;
  let filterHsaTransMockData;
  let storeSlctdFilterChipsMock;
  let mockFilterChips;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getTransaction',
        'posNegSymbol',
        'getExternalLinks',
        'openPwebAccountLink',
        'getAccount',
        'currentSort',
        'currentFilter',
        'getSectionValues',
        'setSortSlcted',
        'getSortSlcted',
        'getFiltSlcted',
        'setFiltSlcted',
      ]);

      subscriptionFilterSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkWorkplaceAccess',
      ]);
      TestBed.configureTestingModule({
        declarations: [TransactionsPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TransactionsPage);
      component = fixture.componentInstance;

      getSortDataSpy = spyOn(component, 'getSortOptions');
      getSectionValueSpy = spyOn(component, 'getSectionValue');
      getFilterDataSpy = spyOn(component, 'getFilterOptions');

      component['subscriptionFilter'] = subscriptionFilterSpy;

      fixture.detectChanges();

      filterModelData = {
        filterList: [
          {
            label: 'Transaction Type',

            values: [
              {name: 'Contributions', key: '34'},
              {name: 'Distributions', key: '35'},
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

      hsaTransMockData = [
        {
          tradeDate: '2020-01-01',
          type: '',
          tranCode: '',
          cash: 50,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test A',
          br172_vouch_num: '',
        },
        {
          tradeDate: '2022-02-02',
          type: '',
          tranCode: '',
          cash: 500,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test B',
          br172_vouch_num: '',
        },
      ];

      filterHsaTransMockData = [
        {
          tradeDate: '2020-01-01',
          type: '',
          tranCode: '1',
          cash: 50,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test A',
          br172_vouch_num: '',
        },
        {
          tradeDate: '2022-02-02',
          type: '',
          tranCode: '2',
          cash: 500,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test B',
          br172_vouch_num: '',
        },
      ] as TransactionHistory[];

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
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    let transactData;
    beforeEach(() => {
      transactData = {
        transactionHistories: [
          {
            tradeDate: '',
            type: '',
            tranCode: '',
            cash: '',
            clientId: '',
            planId: '',
            participantId: '',
            unit_or_unshrs: '',
            br140_new_val_cash: '',
            br161_shr_price: '',
            br009_run_date: '',
            br011_seq_num: '',
            br980_ACT_NAME: '',
            br172_vouch_num: '',
          },
        ],
      };

      accountServiceSpy.getAccount.and.returnValue({} as Account);

      accountServiceSpy.getTransaction.and.returnValue(
        Promise.resolve(transactData)
      );

      spyOn(component, 'sortData');

      accountServiceSpy.getExternalLinks.and.returnValue(
        of([
          {
            id: 'TEST_ONE',
            link: 'http://test.com',
            label: 'test',
            popup: false,
          },
          {
            id: 'ACCT_HISTORY_LANDING',
            link: 'http://test2.com',
            label: 'test2',
            popup: false,
          },
        ])
      );

      spyOn(component, 'checkAndDisableFilters');
    });

    it('Call the Url data', async () => {
      await component.ionViewWillEnter();

      expect(accountServiceSpy.getTransaction).toHaveBeenCalled();
      expect(component.checkAndDisableFilters).toHaveBeenCalled();
      expect(component.transactionHistory).toEqual(
        transactData.transactionHistories
      );
      expect(component.sortData).toHaveBeenCalledWith('dsc');
    });

    it('should load external transactions link', async () => {
      await component.ionViewWillEnter();
      expect(accountServiceSpy.getExternalLinks).toHaveBeenCalled();
      expect(component.extLink).toEqual({
        id: 'ACCT_HISTORY_LANDING',
        link: 'http://test2.com',
        label: 'test2',
        popup: false,
      });
    });

    it('should set isHsa to true if it is', async () => {
      accountServiceSpy.getAccount.and.returnValue({
        isHSAAccount: true,
      } as Account);

      await component.ionViewWillEnter();

      expect(accountServiceSpy.getAccount).toHaveBeenCalled();
      expect(component.isHsa).toBeTrue();
    });

    it('should set account to current account', async () => {
      const acc = {
        isHSAAccount: false,
      } as Account;
      accountServiceSpy.getAccount.and.returnValue(acc);

      await component.ionViewWillEnter();

      expect(accountServiceSpy.getAccount).toHaveBeenCalled();
      expect(component.account).toEqual(acc);
    });

    it('should set isHsa to false if it is not', async () => {
      accountServiceSpy.getAccount.and.returnValue({
        isHSAAccount: false,
      } as Account);

      await component.ionViewWillEnter();
      expect(component.isHsa).toBeFalse();
    });

    it('should call getSortOptions', async () => {
      await component.ionViewWillEnter();
      expect(component.getSortOptions).toHaveBeenCalled();
    });

    it('should call getSectionValue', async () => {
      await component.ionViewWillEnter();
      expect(component.getSectionValue).toHaveBeenCalled();
    });
  });

  describe('getSortOptions', () => {
    it('should call sortData', async () => {
      getSortDataSpy.and.callThrough();
      accountServiceSpy.currentSort.and.returnValue(of('string'));
      spyOn(component, 'sortData');
      component.getSortOptions();
      expect(accountServiceSpy.currentSort).toHaveBeenCalled();
      expect(component.sortData).toHaveBeenCalledWith('string');
    });
  });

  describe('getSectionValue', () => {
    it('should load filterlist and sortlist labels to popup', async () => {
      spyOn(component, 'checkAndDisableFilters');
      getSectionValueSpy.and.callThrough();
      accountServiceSpy.getSectionValues.and.returnValue(
        Promise.resolve(filterModelData)
      );
      await component.getSectionValue();
      expect(accountServiceSpy.getSectionValues).toHaveBeenCalled();
      expect(component.filterOptions).toEqual(filterModelData.filterList);
      expect(component.sortListOptions).toEqual(filterModelData.sortList);
      expect(component.checkAndDisableFilters).toHaveBeenCalled();
    });
  });

  describe('sortData', () => {
    beforeEach(() => {
      component.filteredTransactionHistory = hsaTransMockData;
    });

    it('it should sort the groupData ascending order', () => {
      const ascOrder = [
        {
          tradeDate: '2020-01-01',
          type: '',
          tranCode: '',
          cash: 50,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test A',
          br172_vouch_num: '',
        },
        {
          tradeDate: '2022-02-02',
          type: '',
          tranCode: '',
          cash: 500,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test B',
          br172_vouch_num: '',
        },
      ];

      component.sortData('asc');
      expect(component.filteredTransactionHistory).toEqual(ascOrder);
    });

    it('it should sort the transaction descending order', () => {
      const dscOrder = [
        {
          tradeDate: '2022-02-02',
          type: '',
          tranCode: '',
          cash: 500,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test B',
          br172_vouch_num: '',
        },
        {
          tradeDate: '2020-01-01',
          type: '',
          tranCode: '',
          cash: 50,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test A',
          br172_vouch_num: '',
        },
      ];

      component.sortData('dsc');
      expect(component.filteredTransactionHistory).toEqual(dscOrder);
    });

    it('it should sort the transaction lower to higher order', () => {
      const lowerOrder = [
        {
          tradeDate: '2020-01-01',
          type: '',
          tranCode: '',
          cash: 50,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test A',
          br172_vouch_num: '',
        },

        {
          tradeDate: '2022-02-02',
          type: '',
          tranCode: '',
          cash: 500,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test B',
          br172_vouch_num: '',
        },
      ];

      component.sortData('low');
      expect(component.filteredTransactionHistory).toEqual(lowerOrder);
    });

    it('it should sort the transaction higher to lower order', () => {
      const higherOrder = [
        {
          tradeDate: '2022-02-02',
          type: '',
          tranCode: '',
          cash: 500,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test B',
          br172_vouch_num: '',
        },
        {
          tradeDate: '2020-01-01',
          type: '',
          tranCode: '',
          cash: 50,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test A',
          br172_vouch_num: '',
        },
      ];

      component.sortData('high');
      expect(component.filteredTransactionHistory).toEqual(higherOrder);
    });
  });

  describe('viewMoreClicked', () => {
    beforeEach(() => {
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: false})
      );
    });
    it('should open in app browser with proper link if workplaceDashboardEnabled is false', async () => {
      const item = {
        link: 'http://a.com',
      } as ExternalLink;
      component.extLink = item;

      await component.viewMoreClicked();
      expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        item.link
      );
    });
    it('should open in new browser tab with proper link if workplaceDashboardEnabled is true', async () => {
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      const item = {
        link: 'http://a.com',
      } as ExternalLink;
      component.extLink = item;

      await component.viewMoreClicked();
      expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        item.link,
        '_self'
      );
    });
  });

  describe('getFilterOptions', () => {
    it('should call filterData', () => {
      spyOn(component, 'createFilterChips');
      getFilterDataSpy.and.callThrough();
      accountServiceSpy.currentFilter.and.returnValue(
        of(filterModelData.filterList)
      );
      spyOn(component, 'filterData');
      component.getFilterOptions();
      expect(accountServiceSpy.currentFilter).toHaveBeenCalled();
      expect(component.filterData).toHaveBeenCalledWith(
        filterModelData.filterList
      );
      expect(component.createFilterChips).toHaveBeenCalled();
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

      accountServiceSpy.getFiltSlcted.and.returnValue(
        storeSlctdFilterChipsMock
      );
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
      component.filterData(component.storeSelectedFilter);
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
      expect(component.filterData).toHaveBeenCalledWith(
        component.storeSelectedFilter
      );
    });
  });

  describe('clearAllChips', () => {
    it('should clear all the selcted chips and reset filter data to default', () => {
      component.storeSelectedFilter = storeSlctdFilterChipsMock;
      component.filterChips = mockFilterChips as FilterValues[];
      spyOn(component, 'filterData');
      component.clearAllChips();
      expect(component.storeSelectedFilter).toEqual([]);
      expect(component.filterChips).toEqual([]);
      expect(accountServiceSpy.setFiltSlcted).toHaveBeenCalledWith([]);
      expect(component.filterData).toHaveBeenCalledWith(
        component.storeSelectedFilter
      );
    });
  });

  describe('checkAndDisableFilters', () => {
    it('should not change anything if trans histort is null', () => {
      component.transactionHistory = null;
      component.filterOptions = [];

      component.checkAndDisableFilters();
      expect(component.transactionHistory).toBeNull();
      expect(component.filterOptions).toEqual([]);
    });

    it('should not change anything if filterOptions is null', () => {
      component.transactionHistory = filterHsaTransMockData;
      component.filterOptions = null;

      component.checkAndDisableFilters();
      expect(component.transactionHistory).toEqual(filterHsaTransMockData);
      expect(component.filterOptions).toBeNull();
    });

    it('should loop through data and filter options and enable options that exist', () => {
      component.transactionHistory = filterHsaTransMockData;
      component.filterOptions = [
        {
          label: 'Transaction Type',

          values: [
            {name: 'Contributions', key: '1', isChecked: false, enabled: false},
            {name: 'Distributions', key: '2', isChecked: false, enabled: false},
            {name: 'Distributions', key: '3', isChecked: false, enabled: false},
            {name: 'Distributions', key: '4', isChecked: false, enabled: false},
          ],
        },
      ];

      component.checkAndDisableFilters();

      expect(component.filterOptions).toEqual([
        {
          label: 'Transaction Type',

          values: [
            {name: 'Contributions', key: '1', isChecked: false, enabled: true},
            {name: 'Distributions', key: '2', isChecked: false, enabled: true},
            {name: 'Distributions', key: '3', isChecked: false, enabled: false},
            {name: 'Distributions', key: '4', isChecked: false, enabled: false},
          ],
        },
      ]);
    });
  });

  describe('filterData', () => {
    beforeEach(function() {
      component.transactionHistory = filterHsaTransMockData;
    });

    it('should filter the transactionHistory min one filter is selected and "key === tranCode" ', () => {
      const data = [
        {
          label: 'Tr Type',
          values: [{name: 'Test A', key: '1', isChecked: true}],
        },
      ] as FilterList[];

      component.filterData(data);

      expect(component.filteredTransactionHistory).toEqual([
        {
          tradeDate: '2020-01-01',
          type: '',
          tranCode: '1',
          cash: 50,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test A',
          br172_vouch_num: '',
        },
      ]);
    });

    it('should filter the transactionHistory if any filter is not selected', () => {
      const data = [
        {
          label: 'Tr Type',
          values: [],
        },
      ] as FilterList[];

      component.filterData(data);

      expect(component.filteredTransactionHistory).toEqual([
        {
          tradeDate: '2020-01-01',
          type: '',
          tranCode: '1',
          cash: 50,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test A',
          br172_vouch_num: '',
        },
        {
          tradeDate: '2022-02-02',
          type: '',
          tranCode: '2',
          cash: 500,
          clientId: '',
          planId: '',
          participantId: '',
          unit_or_unshrs: '',
          br140_new_val_cash: '',
          br161_shr_price: '',
          br009_run_date: '',
          br011_seq_num: '',
          br980_ACT_NAME: 'Test B',
          br172_vouch_num: '',
        },
      ]);
    });
  });

  describe('posNegSymbol', () => {
    it('should return - for negative numbers', () => {
      component.posNegSymbol(-1);
      expect(accountServiceSpy.posNegSymbol).toHaveBeenCalledWith(-1);
    });
  });
});
