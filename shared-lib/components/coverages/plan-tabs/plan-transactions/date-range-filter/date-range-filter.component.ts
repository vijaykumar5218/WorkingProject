import {Component, Input, OnInit} from '@angular/core';
import * as pageText from '../constants/pageText.json';
import {PopoverController} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {FilterSortContent} from '@shared-lib/models/filter-sort.model';

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
})
export class DateRangeFilterComponent implements OnInit {
  @Input() public dateRangeList;
  @Input() public selectedDate;

  constructor(
    public popoverCtrl: PopoverController,
    private benefitService: BenefitsService
  ) {}

  filterContent: FilterSortContent = (pageText as any).default;

  public selectedValue = '';
  public selectedDateOpt = '';

  onChange() {
    this.selectedDateOpt = this.selectedValue;
  }

  closeDialog(save: boolean) {
    if (save && this.selectedDateOpt) {
      this.benefitService.changeDateOptions(this.selectedDateOpt);
    }
    this.popoverCtrl.dismiss();
  }

  ngOnInit(): void {
    this.selectedValue = this.selectedDate;
  }
}
