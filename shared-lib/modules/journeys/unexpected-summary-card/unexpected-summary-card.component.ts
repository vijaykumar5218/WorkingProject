import {Component} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {UnExpectedService} from '@shared-lib/services/journey/unExpectedService/unExpected.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-unexpected-summary-card',
  templateUrl: './unexpected-summary-card.component.html',
  styleUrls: ['./unexpected-summary-card.component.scss'],
})
export class UnExpectedExpensesSummaryCardComponent {
  summaryCard: StepContentElement;
  accountlogoUrl: string;
  accountName: string;
  private subscription = new Subscription();
  accountLinked: boolean;

  constructor(
    public unExpectedService: UnExpectedService,
    private mxService: MXService,
    private journeyService: JourneyService
  ) {}

  async ngOnInit() {
    const unexpectedGoalContent = await this.unExpectedService.fetchUnexpectedGoalContent();
    this.summaryCard = unexpectedGoalContent;
    this.subscription.add(
      this.unExpectedService.valueChange.subscribe(() => {
        this.summaryCard.value = this.unExpectedService.currentSavings;
        this.summaryCard.maxValue = parseFloat(
          this.unExpectedService.emergencySavingGoal.slice(1).replace(/,/g, '')
        );
        this.accountLinked = this.unExpectedService.accountLinked;
        if (this.accountLinked) {
          this.fetchAccountInfo(this.unExpectedService.accountLinkedId);
        }
      })
    );
  }

  fetchAccountInfo(accountLinkedId: string) {
    this.subscription.add(
      this.mxService.getMXAccountData(accountLinkedId).subscribe(data => {
        this.accountlogoUrl = data.small_logo_url;
        this.accountName = data.name;
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
