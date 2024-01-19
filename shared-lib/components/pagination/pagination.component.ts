import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() paginationConfig: string;
  @Output() paginationChange = new EventEmitter<number>();
  @Input() id: string;

  paginateClick(event) {
    const itemsPerPage = JSON.parse(this.paginationConfig).itemsPerPage;
    const currentPage = event.detail.pageIndex[0] / itemsPerPage + 1;
    this.paginationChange.emit(currentPage);
  }
}
