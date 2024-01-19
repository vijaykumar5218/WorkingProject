import {Component, Input, SimpleChanges} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-sub-header-nav',
  templateUrl: 'sub-header-nav.component.html',
  styleUrls: ['sub-header-nav.component.scss'],
})
export class SubHeaderNavComponent {
  @Input() headerName: string;
  id: string;

  constructor(private location: Location) {}

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.headerName.currentValue) {
      this.id = simpleChanges.headerName.currentValue.split(' ').join('-');
    }
  }

  goBack() {
    this.location.back();
  }
}
