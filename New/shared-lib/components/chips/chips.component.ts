import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  FilterSortContent,
  FilterValues,
} from '@shared-lib/models/filter-sort.model';
import * as pageText from '@shared-lib/components/coverages/plan-tabs/plan-transactions/constants/pageText.json';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class ChipsComponent {
  @Input() item = [];

  @Output() outPutData = new EventEmitter();
  @Output() clearOutPutFn = new EventEmitter();
  filterContent: FilterSortContent = (pageText as any).default;

  removeChip(el: FilterValues) {
    this.outPutData.emit(el);
  }
  clearBtn() {
    this.clearOutPutFn.emit();
  }
}
