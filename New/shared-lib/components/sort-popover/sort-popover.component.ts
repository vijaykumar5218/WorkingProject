import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import * as jsonTxt from '@shared-lib/constants/filter-sort.json';
import {
  FilterSortContent,
  SortListing,
} from '@shared-lib/models/filter-sort.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';

@Component({
  selector: 'app-sort-popover',
  templateUrl: './sort-popover.component.html',
  styleUrls: ['./sort-popover.component.scss'],
})
export class SortPopoverComponent implements OnInit {
  filterContent: FilterSortContent = (jsonTxt as any).default;

  @Input() public sortList: SortListing[];

  @Input() service: AccountService | BenefitsService;

  constructor(public popoverCtrl: PopoverController) {}

  public selectedValue = '';
  public selectedSort = 'asc';

  ngOnInit() {
    this.selectedValue = this.service.getSortSlcted();
  }

  closeDialog(data: boolean) {
    if (data) {
      this.service.changeSort(this.selectedValue);
      this.service.setSortSlcted(this.selectedValue);
    } else {
      this.service.changeSort('');
    }
    this.popoverCtrl.dismiss();
  }
}
