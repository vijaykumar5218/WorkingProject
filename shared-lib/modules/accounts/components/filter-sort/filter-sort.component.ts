import {Component, Input} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import * as jsonTxt from '@shared-lib/constants/filter-sort.json';
import {SortPopoverComponent} from '@shared-lib/components/sort-popover/sort-popover.component';
import {FilterPopoverComponent} from '@shared-lib/components/filter-popover/filter-popover.component';
import {
  FilterSortContent,
  FilterList,
  SortListing,
} from '@shared-lib/models/filter-sort.model';
import {AccountService} from '@shared-lib/services/account/account.service';

@Component({
  selector: 'app-filter-sort',
  templateUrl: './filter-sort.component.html',
  styleUrls: ['./filter-sort.component.scss'],
})
export class FilterSortComponent {
  filterContent: FilterSortContent = (jsonTxt as any).default;

  @Input() sortList: SortListing;
  @Input() filterList: FilterList[];

  constructor(
    public popoverCtrl: PopoverController,
    private accountService: AccountService
  ) {}

  async opnSorting(e: Event) {
    const popover = await this.popoverCtrl.create({
      component: SortPopoverComponent,
      event: e,
      cssClass: 'pop-over-class',
      componentProps: {
        sortList: this.sortList,
        service: this.accountService,
      },
      mode: 'ios',
    });

    return popover.present();
  }

  async opnFilter(e: Event) {
    const popover = await this.popoverCtrl.create({
      component: FilterPopoverComponent,
      event: e,
      cssClass: 'pop-over-class',
      componentProps: {
        filterList: this.filterList,
        service: this.accountService,
      },
      mode: 'ios',
    });
    return popover.present();
  }
}
