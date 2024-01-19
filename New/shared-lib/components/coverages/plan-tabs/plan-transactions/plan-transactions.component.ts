import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import * as chartText from '@shared-lib/components/coverages/constants/chartData.json';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {
  AllCategory,
  GroupingCategoryDetails,
  HealthContent,
  HealthDates,
  HealthUtlization,
  NameCategory,
} from '@shared-lib/components/coverages/models/chart.model';
import moment from 'moment';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PopoverController} from '@ionic/angular';

import {DateRangeFilterComponent} from './date-range-filter/date-range-filter.component';
import * as pageText from './constants/pageText.json';
import {Subscription} from 'rxjs';
import {
  DateOptions,
  FilterList,
  FilterModels,
  FilterSortContent,
  FilterValues,
  SortListing,
} from '../../../../models/filter-sort.model';
import {FilterPopoverComponent} from '../../../filter-popover/filter-popover.component';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {TPAClaimsData} from '@shared-lib/services/tpa-stream/models/tpa.model';
import {SortPopoverComponent} from '../../../sort-popover/sort-popover.component';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'mobile-plan-transactions',
  templateUrl: './plan-transactions.component.html',
  styleUrls: ['./plan-transactions.component.scss'],
})
export class PlanTransactionsComponent implements OnInit, OnDestroy {
  @Input() back = false;
  @Input() isModal = false;
  isTpa = false;
  @Output() consent = new EventEmitter<boolean>();
  @Output() manageButtonEvent = new EventEmitter();
  contentP: HealthContent = (chartText as any).default;
  groupData: AllCategory[] = [];
  filteredGroupData: AllCategory[] = [];
  sortOption = 'asc';

  healthDates: HealthDates;
  hasConsent = false;
  isWeb: boolean;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;

  filterContent: FilterSortContent = (pageText as any).default;

  filterList: FilterList[];
  sortList: SortListing;
  dateRangeList: DateOptions[] = this.filterContent.dateRangeOptions;

  subscriptionFilter: Subscription;
  subscriptionSort: Subscription;
  subscriptionDate: Subscription;
  tpaSubscription: Subscription;
  isDataLoaded: boolean;
  selectedRangeType: string;
  fromDate = '';
  toDate = '';
  fromMinDate = '';
  fromMaxDate = '';
  toMinDate = '';
  toMaxDate = '';

  storeSelectedFilter: FilterList[];

  customAlertOptions = {
    header: this.filterContent.dateRangeLbl,
    translucent: true,
    cssClass: 'pop-over-class',
  };

  consentSubscription: Subscription;
  selectedSortValue = '';

  filterChips: FilterValues[];
  storedKeyArr: string[] = [];

  constructor(
    private benefitServices: BenefitsService,
    private consentService: ConsentService,
    private utilityService: SharedUtilityService,
    public popoverCtrl: PopoverController,
    private tpaService: TPAStreamService,
    private accessService: AccessService
  ) {}

  async ngOnInit() {
    await this.determineTPA();
    this.selectedRangeType = 'thisYear';
    this.isWeb = this.utilityService.getIsWeb();
    this.getFilterOptions();
    this.getSortOptions();
    this.getSectionValue();
    this.getDateOptions();
    this.checkAuthorization();
    this.benefitServices.setSortSlcted(this.selectedSortValue);
    this.initFilterMinMaxDates();
  }

  initFilterMinMaxDates() {
    this.fromMinDate = moment()
      .subtract(3, 'years')
      .format('YYYY-MM-DD');
    this.fromMaxDate = moment().format('YYYY-MM-DD');
    this.toMinDate = this.fromMinDate;
    this.toMaxDate = this.fromMaxDate;
  }

  async determineTPA() {
    const access = await this.accessService.checkMyvoyageAccess();
    this.isTpa = access.enableTPA === 'Y';
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

    this.benefitServices.changeFilt(this.storeSelectedFilter);

    this.storedKeyArr = this.benefitServices.getFiltSlcted();

    if (this.storedKeyArr.includes(clickedItem.key)) {
      this.storedKeyArr = this.storedKeyArr.filter(function(item) {
        return item !== clickedItem.key;
      });
    } else {
      return;
    }

    this.benefitServices.setFiltSlcted(this.storedKeyArr);
  }

  clearAllChips() {
    this.storeSelectedFilter = [];
    this.filterChips = [];
    this.benefitServices.setFiltSlcted([]);
    this.benefitServices.changeFilt(this.storeSelectedFilter);
  }

  getSectionValue() {
    this.benefitServices.getSectionValues().then((data: FilterModels) => {
      const filter = data.filterList;
      const sort = data.sortList;
      if (this.isTpa) {
        filter[1].values = this.filterContent.tpaFilterOptions;
        sort[0].values = this.filterContent.tpaSortOptions;
      }
      this.filterList = filter;
      this.checkAndDisableFilters();
      this.sortList = sort;
    });
  }

  getFilterOptions() {
    this.subscriptionFilter = this.benefitServices
      .currentFilter()
      .subscribe(data => {
        this.storeSelectedFilter = data;
        this.createFilterChips();
        this.filterData(data);
      });
  }

  getSortOptions() {
    this.subscriptionSort = this.benefitServices
      .currentSort()
      .subscribe(data => {
        this.sortOption = data;
        this.filterData(this.storeSelectedFilter);
      });
  }

  getDateOptions() {
    this.subscriptionDate = this.benefitServices
      .currentDateOpt()
      .subscribe(data => {
        this.selectedRangeType = data;
        this.gethealthDates();
      });
  }

  sortData(data: string) {
    if (data == 'asc') {
      this.filteredGroupData.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      return this.filteredGroupData.forEach(item => {
        return item.name.sort(
          (a, b) =>
            new Date(a.serviceDate).getTime() -
            new Date(b.serviceDate).getTime()
        );
      });
    }
    if (data == 'dsc') {
      this.filteredGroupData.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      return this.filteredGroupData.forEach(item => {
        return item.name.sort(
          (a, b) =>
            new Date(b.serviceDate).getTime() -
            new Date(a.serviceDate).getTime()
        );
      });
    }
    if (data == 'low') {
      this.listWithoutMonth();
      this.filteredGroupData.forEach(item => {
        return item.name.sort((a, b) => a.outOfPocketCost - b.outOfPocketCost);
      });
    }

    if (data == 'high') {
      this.listWithoutMonth();
      this.filteredGroupData.forEach(item => {
        return item.name.sort((a, b) => b.outOfPocketCost - a.outOfPocketCost);
      });
    }
  }

  listWithoutMonth() {
    const transactions = [];
    const mergedArray = [];

    this.filteredGroupData.forEach(item => {
      transactions.push(...item.name);
    });

    mergedArray.push({
      name: transactions,
    });

    this.filteredGroupData = mergedArray;
  }

  filterNetwork(data: FilterList[], el: NameCategory) {
    let show = false;
    if (data[0].values.length < 1) {
      show = true;
    } else {
      data[0].values.forEach(element => {
        if (show) {
          return;
        }
        if (element.key == 'inNetwork') {
          show = el.inNetwork == true;
        }
        if (element.key == 'OutNetwork') {
          show = el.inNetwork == false;
        }
      });
    }
    return show;
  }

  filterAllCategoryItem(item: AllCategory, data: FilterList[]): any {
    return item.name.filter(el => {
      const show = this.filterNetwork(data, el);
      if (show) {
        if (data[1].values.length < 1) {
          return true;
        }
        let res = false;
        data[1].values.forEach(element => {
          if (element.key == el.serviceName) {
            res = true;
          }
        });
        return res;
      }

      return show;
    });
  }

  filterData(data: FilterList[]) {
    if (
      data.length < 1 ||
      (data[0]?.values.length < 1 && data[1]?.values.length < 1)
    ) {
      this.filteredGroupData = this.groupData;
    } else {
      const filteredData = [];
      this.groupData.forEach(item => {
        const arr = this.filterAllCategoryItem(item, data);
        return filteredData.push({
          date: item.date,
          name: arr,
        });
      });

      this.filteredGroupData = filteredData;
    }

    this.filterByDateRange(this.filteredGroupData);
    this.sortData(this.sortOption);
  }

  ionViewWillEnter() {
    if (!this.consentSubscription) {
      this.checkAuthorization();
    }
  }

  async checkAuthorization() {
    if (this.isTpa) {
      this.hasConsent = true;
      this.getSpending();
    } else {
      this.consentSubscription = this.consentService
        .getMedicalConsent()
        .subscribe(async (consent: boolean) => {
          this.hasConsent = consent;
          if (this.isWeb) {
            this.utilityService.scrollToTop(this.topmostElement);
          }
          if (this.hasConsent) {
            this.consent.emit(true);
            this.getSpending();
          } else {
            this.consent.emit(false);
          }
        });
    }
  }

  gethealthDates() {
    if (this.selectedRangeType == '30Days') {
      this.healthDates = {
        startDate: moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      };
    }
    if (this.selectedRangeType == '3Months') {
      this.healthDates = {
        startDate: moment()
          .subtract(90, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      };
    }
    if (this.selectedRangeType == '6Months') {
      this.healthDates = {
        startDate: moment()
          .subtract(180, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      };
    }
    if (this.selectedRangeType == '12Months') {
      this.healthDates = {
        startDate: moment()
          .subtract(360, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      };
    }

    if (this.selectedRangeType == 'lastYear') {
      this.healthDates = {
        startDate: moment()
          .startOf('year')
          .subtract(1, 'years')
          .format('YYYY-MM-DD'),
        endDate: moment()
          .endOf('year')
          .subtract(1, 'years')
          .format('YYYY-MM-DD'),
      };
    } else if (this.selectedRangeType == 'thisYear') {
      this.healthDates = {
        startDate: moment()
          .startOf('year')
          .format('YYYY-MM-DD'),
        endDate: moment()
          .endOf('year')
          .format('YYYY-MM-DD'),
      };
    }
    this.fromDate = this.healthDates.startDate;
    this.toDate = this.healthDates.endDate;
    this.filterData(this.storeSelectedFilter);
  }

  filterByDateRange(data: AllCategory[]) {
    const dataWithinDate = [];

    data.forEach(item => {
      const res = item.name.filter(d => {
        return (
          d.serviceDate >= this.healthDates.startDate &&
          d.serviceDate <= this.healthDates.endDate
        );
      });
      return dataWithinDate.push({
        date: item.date,
        name: res,
      });
    });

    this.filteredGroupData = dataWithinDate;
  }

  getSpending() {
    if (this.isTpa) {
      this.getSpendingTPA();
    } else {
      this.getSpendingRegular();
    }
  }

  manageCarriers() {
    this.manageButtonEvent.emit();
  }

  getSpendingTPA() {
    this.tpaSubscription = this.tpaService
      .getTPAData()
      .subscribe((tpaData: TPAClaimsData) => {
        this.isDataLoaded = true;
        this.createGroupDetails(tpaData.groupingCategoryDetails);
      });
  }

  getSpendingRegular() {
    this.healthDates = {
      startDate: moment()
        .startOf('year')
        .add(-2, 'years')
        .format('MM/DD/YYYY'),
      endDate: moment()
        .endOf('year')
        .format('MM/DD/YYYY'),
    };

    this.benefitServices
      .fetchSpending(this.healthDates, true)
      .then((resp: HealthUtlization) => {
        this.isDataLoaded = true;
        this.createGroupDetails(resp.groupingCategoryDetails);
      })
      .catch(() => {
        this.isDataLoaded = true;
      });
  }

  createGroupDetails(groupingCategoryDetails: GroupingCategoryDetails) {
    if (groupingCategoryDetails) {
      this.groupData = [];
      Object.keys(groupingCategoryDetails).forEach(key => {
        const data = {};
        data['date'] = key;
        data['name'] = [];
        for (const element of groupingCategoryDetails[key]) {
          data['name'].push(element);
        }
        this.groupData.push(data);
      });
      this.checkAndDisableFilters();
      this.filteredGroupData = this.groupData;
      this.filterData(this.storeSelectedFilter);
      this.gethealthDates();
    }
    this.benefitServices.setFiltSlcted([]);
  }

  private checkIfFilterHasVal(filterVal: FilterValues, i: number) {
    let hasVal = false;
    this.groupData.forEach((groupData: AllCategory) => {
      groupData.name.forEach((value: NameCategory) => {
        if (i == 0) {
          if (filterVal.key == 'inNetwork') {
            hasVal = value.inNetwork;
          } else if (filterVal.key == 'OutNetwork') {
            hasVal = !value.inNetwork;
          }
        } else {
          if (filterVal.key == value.serviceName) {
            hasVal = true;
          }
        }
        if (hasVal) {
          return;
        }
      });
    });
    return hasVal;
  }

  checkAndDisableFilters() {
    if (!this.filterList || !this.groupData) {
      return;
    }
    let i = 0;
    this.filterList.forEach(dat => {
      dat.values.forEach(filterVal => {
        filterVal.enabled = this.checkIfFilterHasVal(filterVal, i);
      });
      i++;
    });
  }

  async opnFilter(e: Event) {
    const popover = await this.popoverCtrl.create({
      component: FilterPopoverComponent,
      event: e,
      cssClass: 'pop-over-class',
      componentProps: {
        filterList: this.filterList,
        service: this.benefitServices,
      },
      mode: 'ios',
    });

    return popover.present();
  }

  async opnSorting(e: Event) {
    const popover = await this.popoverCtrl.create({
      component: SortPopoverComponent,
      event: e,
      cssClass: 'pop-over-class',
      componentProps: {
        sortList: this.sortList,
        service: this.benefitServices,
      },
      mode: 'ios',
    });

    return popover.present();
  }

  async opnDateRangeFilter(e: Event) {
    const popover = await this.popoverCtrl.create({
      component: DateRangeFilterComponent,
      event: e,
      cssClass: 'pop-over-class',
      componentProps: {
        dateRangeList: this.dateRangeList,
        selectedDate: this.selectedRangeType,
      },
      mode: 'ios',
    });

    return popover.present();
  }

  fromDateChange(event: CustomEvent) {
    this.fromDate = event.detail.value;
    this.customDateRange(this.fromDate, this.toDate);
  }

  toDateChange(event: CustomEvent) {
    this.toDate = event.detail.value;
    this.customDateRange(this.fromDate, this.toDate);
  }

  customDateRange(fromDate: string, toDate: string) {
    this.healthDates = {
      startDate: moment(fromDate).format('YYYY-MM-DD'),
      endDate: moment(toDate).format('YYYY-MM-DD'),
    };

    this.toMinDate = moment(fromDate).format('YYYY-MM-DD');
    this.fromMaxDate = moment(toDate).format('YYYY-MM-DD');

    this.filterByDateRange(this.groupData);
  }

  ionViewWillLeave() {
    this.consentSubscription.unsubscribe();
    this.consentSubscription = null;
  }

  ngOnDestroy() {
    this.subscriptionFilter.unsubscribe();
    this.subscriptionSort.unsubscribe();
    this.subscriptionDate.unsubscribe();
    if (this.tpaSubscription) {
      this.tpaSubscription.unsubscribe();
    }
    if (this.consentSubscription) {
      this.consentSubscription.unsubscribe();
    }
  }
}
