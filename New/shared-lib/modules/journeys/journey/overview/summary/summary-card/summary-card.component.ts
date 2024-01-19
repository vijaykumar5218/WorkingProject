import {Component, Input, OnInit} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-overview-summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: [],
})
export class SummaryCardComponent implements OnInit {
  @Input() summaryCard: StepContentElement;
  @Input() index: number;

  ngOnInit() {
    this.summaryCard.idSuffix = this.index.toString();
  }
}
