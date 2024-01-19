import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'journeys-expand-collapse',
  templateUrl: './expand-collapse.component.html',
  styleUrls: ['./expand-collapse.component.scss'],
})
export class ExpandCollapseComponent implements OnInit {
  @Input() header: string;
  @Input() isExpanded: boolean;
  @Input() isLast: boolean;
  @Input() index: number | string;
  @Output() isExpandedChange = new EventEmitter<boolean>();
  isWeb = false;

  constructor(private sharedUtilityService: SharedUtilityService) {}

  ngOnInit() {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.isExpandedChange.emit(this.isExpanded);
  }
}
