import {Component, Input, OnInit} from '@angular/core';
import {
  StepContentElement,
  StepsTableObject,
} from '@shared-lib/services/journey/models/journey.model';
import {CollegeService} from '@shared-lib/services/journey/collegeService/college.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'journeys-overview-college-summary-card',
  templateUrl: './college-summary-card.component.html',
  styleUrls: ['./college-summary-card.component.scss'],
})
export class CollegeSummaryCardComponent implements OnInit {
  @Input() summaryCard: StepContentElement;
  private collegeServiceClass = CollegeService;
  dependentSummaryCards: {
    depId: string;
    accountLinked: boolean;
    logoUrl: string;
    accountName: string;
    description: string;
    table: StepContentElement;
    progressBar: StepContentElement;
  }[];

  constructor(
    private collegeService: CollegeService,
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private journeyService: JourneyService,
    private mxService: MXService,
    private journeyUtility: JourneyUtilityService,
    private currencyPipe: CurrencyPipe
  ) {}

  async ngOnInit() {
    this.dependentSummaryCards = [];
    for (const dep of this.collegeService.addedDependents) {
      const depService = new this.collegeServiceClass(
        this.baseService,
        this.utilityService,
        this.journeyService,
        null,
        this.mxService,
        this.journeyUtility,
        this.currencyPipe
      );
      await depService.setTrackerAnswers(
        dep,
        this.collegeService.allDependentSteps,
        this.collegeService.collegeJourneyDataPromise,
        this.collegeService.whoAreYouSavingForId
      );
      const dependentSummary = this.dependentSummaryCards.find(
        card => card.depId === dep.id
      );
      if (
        (depService.typeCollege || depService.collegeName) &&
        depService.scholarshipsNotIncluded !== undefined &&
        depService.stateId &&
        depService.householdIncome !== undefined &&
        depService.taxFilingStatus &&
        !dependentSummary
      ) {
        const rows = this.createRows(
          JSON.parse(JSON.stringify(this.summaryCard.rows)),
          depService
        );

        this.dependentSummaryCards.push({
          depId: dep.id as string,
          accountLinked: depService.accountLinked,
          logoUrl: depService.logoUrl,
          accountName: depService.accountName,
          description: this.summaryCard.description.replace(
            '{dependentName}',
            dep.firstName as string
          ),
          table: {
            rows: rows,
            marginBottom: this.summaryCard.marginBottom,
            labelFontSize: this.summaryCard.labelFontSize,
          },
          progressBar: {
            imageUrl: this.summaryCard.imageUrl,
            label: this.summaryCard.label,
            value: depService.accountLinked
              ? parseFloat(depService.accountBalance)
              : depService.existingSavings,
            maxValue: depService.total,
            type: this.summaryCard.type,
            bgColor: this.summaryCard.bgColor,
            borderColor: this.summaryCard.borderColor,
          },
        });
      }
    }
  }

  private createRows(
    rows: StepsTableObject[],
    depService: CollegeService
  ): StepsTableObject[] {
    const tableRows = [];
    rows.forEach(row => {
      if (!row.flag || depService[row.flag]) {
        row.answer = depService[row.answerId];
        row.answerId = undefined;
        row.flag = undefined;
        tableRows.push(row);
      }
    });
    return tableRows;
  }
}
