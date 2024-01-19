import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';

@Component({
  selector: 'app-sub-header',
  templateUrl: 'sub-header.component.html',
  styleUrls: ['sub-header.component.scss'],
})
export class SubHeaderComponent {
  @Input() selectedTab;
  @Input() tabsAction: Array<SubHeaderTab> = [];
  @Input() showGoToAccountButton?: boolean;
  @Input() offsetTop = 0;
  @Output() fetchTabLink: EventEmitter<string> = new EventEmitter<string>();

  handleClick(selectedTab: SubHeaderTab) {
    this.selectedTab = selectedTab.link;
    this.fetchTabLink.emit(this.selectedTab);
  }
}