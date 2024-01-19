import {Component, OnInit} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {Subscription} from 'rxjs';
import {HSAService} from '../../../services/journey/hsaService/hsa.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'app-hsa-summary-card',
  templateUrl: './hsa-summary-card.component.html',
  styleUrls: ['./hsa-summary-card.component.scss'],
})
export class HSASummaryCardComponent implements OnInit {
  summaryCard: StepContentElement;
  private subscription = new Subscription();
  accountLinked: boolean;
  logoUrl: string;
  onFile: boolean;

  constructor(
    private hsaService: HSAService,
    private journeyService: JourneyService
  ) {}

  async ngOnInit() {
    const hsaContent = await this.hsaService.fetchGoalJSON();
    this.summaryCard = hsaContent;
    this.subscription.add(
      this.hsaService.valueChange.subscribe(() => {
        this.summaryCard.value = this.hsaService.ytdContribution;
        this.summaryCard.maxValue = this.hsaService.adjustedMaxContribution;
        this.accountLinked = this.hsaService.accountLinked;
        this.onFile = this.hsaService.onFile;
        this.logoUrl = this.hsaService.logoUrl;
      })
    );
  }

  async openDialog() {
    this.journeyService.openModal(
      {element: {id: 'revisit-journey-modal'}},
      false
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
