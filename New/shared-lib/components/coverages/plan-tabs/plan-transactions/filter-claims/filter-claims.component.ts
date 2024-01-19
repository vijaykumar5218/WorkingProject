import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {
  FilterList,
  FilterSortContent,
} from '@shared-lib/models/filter-sort.model';
import * as pageText from '../constants/pageText.json';

@Component({
  selector: 'app-filter-claims',
  templateUrl: './filter-claims.component.html',
  styleUrls: ['./filter-claims.component.scss'],
})
export class FilterClaimsComponent implements OnInit {
  constructor(
    private benefitService: BenefitsService,
    public popoverCtrl: PopoverController
  ) {}

  @Input() public filterList: FilterList[];

  selectedFilter: FilterList[];
  slctdFiltrCopy: FilterList[];

  selctedCheckBox: string[] = [];
  storedKeyArr: string[] = [];

  filterContent: FilterSortContent = (pageText as any).default;

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

  closeDialog(save: boolean) {
    if (save) {
      this.benefitService.changeFilt(this.selectedFilter);
      this.benefitService.setFiltSlcted(this.selctedCheckBox);
    } else {
      this.benefitService.changeFilt(this.slctdFiltrCopy);
    }
    this.popoverCtrl.dismiss();
  }

  ngOnInit() {
    this.storedKeyArr = this.benefitService.getFiltSlcted();
  }

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
}
