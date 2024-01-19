import {Component} from '@angular/core';
import {TransactionHistory} from '@shared-lib/services/account/models/retirement-account/transactions/transactions.model';
import pageText from '@shared-lib/services/account/models/retirement-account/info/info-tab.json';
import {AccountService} from '@shared-lib/services/account/account.service';
import {
  Account,
  AccountJsonModel,
  ExternalLink,
} from '@shared-lib/services/account/models/accountres.model';
import {Subscription} from 'rxjs';
import {
  FilterList,
  FilterModels,
  FilterValues,
  SortListing,
} from '../../../../models/filter-sort.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage {
  pageText: AccountJsonModel = pageText;
  transactionHistory: TransactionHistory[];
  filteredTransactionHistory: TransactionHistory[];
  extLink: ExternalLink;
  isHsa = false;
  account: Account;
  filterOptions: FilterList[];
  sortListOptions: SortListing;
  subscriptionSort: Subscription;
  subscriptionFilter: Subscription;
  storeSelectedFilter: FilterList[];
  selectedSortValue = 'dsc';
  filterChips: FilterValues[];
  isWeb = false;

  constructor(
    private accountService: AccountService,
    private utilityService: SharedUtilityService,
    private accessService: AccessService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  async ionViewWillEnter() {
    this.accountService.getTransaction().then(data => {
      this.transactionHistory = data.transactionHistories;
      this.checkAndDisableFilters();
      this.filteredTransactionHistory = this.transactionHistory;
      this.sortData(this.selectedSortValue);
    });

    this.accountService.getExternalLinks().subscribe(links => {
      this.extLink = links.find(link => link.id === 'ACCT_HISTORY_LANDING');
    });

    this.account = this.accountService.getAccount();
    this.isHsa = this.account.isHSAAccount;
    this.getSortOptions();
    this.getSectionValue();
    this.getFilterOptions();
    this.accountService.setSortSlcted(this.selectedSortValue);
  }

  async viewMoreClicked() {
    const {
      myWorkplaceDashboardEnabled,
    } = await this.accessService.checkWorkplaceAccess();
    const url = decodeURIComponent(this.extLink.link);

    if (myWorkplaceDashboardEnabled) {
      this.accountService.openPwebAccountLink(url, '_self');
    } else {
      this.accountService.openPwebAccountLink(url);
    }
  }

  posNegSymbol(val) {
    return this.accountService.posNegSymbol(val);
  }

  getSectionValue() {
    this.accountService.getSectionValues().then((data: FilterModels) => {
      this.filterOptions = data.filterList;
      this.checkAndDisableFilters();
      this.sortListOptions = data.sortList;
    });
  }

  getSortOptions() {
    this.subscriptionSort = this.accountService
      .currentSort()
      .subscribe(data => {
        this.sortData(data);
      });
  }

  sortData(data: string) {
    if (data == 'asc') {
      this.filteredTransactionHistory.sort((a, b) => {
        return (
          new Date(a.tradeDate).getTime() - new Date(b.tradeDate).getTime()
        );
      });
    }
    if (data == 'dsc') {
      this.filteredTransactionHistory.sort((a, b) => {
        return (
          new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime()
        );
      });
    }

    if (data == 'low') {
      this.filteredTransactionHistory.sort((a, b) => {
        return a.cash - b.cash;
      });
    }
    if (data == 'high') {
      this.filteredTransactionHistory.sort((a, b) => {
        return b.cash - a.cash;
      });
    }
  }

  getFilterOptions() {
    this.subscriptionFilter = this.accountService
      .currentFilter()
      .subscribe(data => {
        this.filterData(data);
        this.storeSelectedFilter = data;
        this.createFilterChips();
      });
  }

  createFilterChips() {
    this.filterChips = [];
    this.storeSelectedFilter.forEach(product => {
      return product.values.some(item => {
        this.filterChips.push(item);
      });
    });
  }

  onRemoveChips(clickedItem: FilterValues) {
    this.filterChips = this.filterChips.filter(function(item) {
      return item.key !== clickedItem.key;
    });

    this.storeSelectedFilter = this.storeSelectedFilter.map(items => ({
      ...items,
      values: items.values.filter(el => el.key != clickedItem.key),
    }));

    this.filterData(this.storeSelectedFilter);
  }

  clearAllChips() {
    this.storeSelectedFilter = [];
    this.filterChips = [];
    this.accountService.setFiltSlcted([]);
    this.filterData(this.storeSelectedFilter);
  }

  checkAndDisableFilters() {
    if (!this.filterOptions || !this.transactionHistory) {
      return;
    }
    this.filterOptions[0].values.forEach(filterVal => {
      let hasVal = false;
      this.transactionHistory.forEach(el => {
        if (filterVal.key.includes(el.tranCode)) {
          hasVal = true;
        }
      });
      filterVal.enabled = hasVal;
    });
  }

  filterData(data: FilterList[]) {
    if (data[0]?.values.length) {
      const myArrayFiltered = this.transactionHistory?.filter(el => {
        return data[0]?.values.some(f => {
          return f.key.includes(el.tranCode);
        });
      });

      this.filteredTransactionHistory = myArrayFiltered;
    } else {
      this.filteredTransactionHistory = this.transactionHistory;
    }
  }
}
