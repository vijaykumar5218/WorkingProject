export interface FilterModels {
  filterList: FilterList[];
  sortList: SortListing;
}

export interface FilterList {
  label: string;
  values: FilterValues[];
}

export interface FilterValues {
  name: string;
  key: string;
  isChecked: boolean;
  enabled?: boolean;
}

export interface SortListing {
  label: string;
  values: SortValues[];
}

export interface SortValues {
  name: string;
  value: string;
}

export interface FilterSortContent {
  filterLable: string;
  sortLable: string;
  cancelLabel: string;
  okLable: string;
  thisYear: string;
  dateRangeLbl: string;
  fromTxt: string;
  toTxt: string;
  filterIcon: string;
  sortIcon: string;
  manage: string;
  clearFilters: string;
  dateRangeOptions: DateOptions[];
  na: string;
  tpaFilterOptions: FilterValues[];
  tpaSortOptions: SortValues[];
}

export interface DateOptions {
  id: string;
  value: string;
}
