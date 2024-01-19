import {Component, Input, OnInit} from '@angular/core';
import * as jsonTxt from '@shared-lib/constants/filter-sort.json';
import {AccountService} from '@shared-lib/services/account/account.service';
import {PopoverController} from '@ionic/angular';
import {
  FilterSortContent,
  FilterList,
} from '@shared-lib/models/filter-sort.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
})
export class FilterPopoverComponent implements OnInit {
  constructor(public popoverCtrl: PopoverController) {}

  filterContent: FilterSortContent = (jsonTxt as any).default;

  @Input() filterList: FilterList[];

  @Input() service: AccountService | BenefitsService;

  selectedFilter: FilterList[];
  slctdFiltrCopy: FilterList[];

  selctedCheckBox: string[] = [];
  storedKeyArr: string[] = [];

  ionViewDidEnter() {
    this.resetCheckbox();

    this.slctdFiltrCopy = [];

    this.filterList.forEach(el => {
      const arry = el.values.filter(val => {
        return this.storedKeyArr.includes(val.key);
      });

      this.slctdFiltrCopy.push({
        label: el.label,
        values: arry,
      });
    });
  }

  resetCheckbox() {
    this.filterList.forEach(el => {
      for (const element of el.values) {
        element.isChecked = false;
      }

      el.values
        .filter(val => {
          return this.storedKeyArr.includes(val.key);
        })
        .forEach(e => {
          e.isChecked = true;
        });
    });
  }

  onChange(item: string) {
    this.selectedFilter = [];
    this.filterList.forEach(el => {
      const arr = el.values.filter(val => {
        return val.isChecked;
      });
      this.selectedFilter.push({
        label: el.label,
        values: arr,
      });
    });

    if (!this.selctedCheckBox.includes(item)) {
      this.selctedCheckBox.push(item);
    } else {
      this.selctedCheckBox.splice(this.selctedCheckBox.indexOf(item), 1);
    }
  }

  ngOnInit(): void {
    this.storedKeyArr = this.service.getFiltSlcted();
  }

  closeDialog(save: boolean) {
    if (save) {
      this.service.changeFilt(this.selectedFilter);
      this.service.setFiltSlcted(this.selctedCheckBox);
    } else {
      this.service.changeFilt(this.slctdFiltrCopy);
    }
    this.popoverCtrl.dismiss();
  }
}
