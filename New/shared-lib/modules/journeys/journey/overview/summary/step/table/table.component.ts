import {Component, Input} from '@angular/core';
import {
  Row,
  StepContentResponse,
  StepContentElement,
  TableInputConfig,
  TableInputValue,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-overview-summary-step-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableSummaryComponent {
  @Input() element: StepContentElement;
  @Input() content: StepContentResponse;
  config: TableInputConfig;

  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    const originalElement = this.journeyService.findElementByProp(
      this.content,
      'answerId',
      this.element.answerId
    );
    this.processTableConfig(originalElement);
  }

  processTableConfig(originalElement: StepContentElement) {
    const tableAnswer = this.journeyService.safeParse(
      this.element.answer
    ) as TableInputValue[];

    this.config = {rows: []};
    let noInputRows = 0;
    let columnTotals: StepContentElement[] = Array(
      originalElement.config.rows[0].columns.length
    ).fill({id: 'input', answer: '-'});
    columnTotals = JSON.parse(JSON.stringify(columnTotals));
    originalElement.config.rows.forEach(row => {
      const noInput = row.columns.every(
        (col: StepContentElement) => col.id !== 'input'
      );
      if (noInput) {
        noInputRows++;
        this.config.rows.push(row);
        return;
      }
      this.processColumnAnswers(row, tableAnswer, columnTotals);
    });
    if (this.config.rows.length <= noInputRows) {
      this.config.rows = [];
    } else if (this.element.showTotal) {
      columnTotals[0] = {
        totalLabel: this.element.totalLabel,
      };
      this.config.rows.push({columns: columnTotals});
    }
  }

  private processColumnAnswers(
    row: Row,
    tableAnswer: TableInputValue[],
    columnTotals: StepContentElement[]
  ) {
    let rowHasAnswer = false;
    row.columns.forEach((col: StepContentElement, index: number) => {
      const cellAnswer = tableAnswer?.find(
        (cellValue: TableInputValue) => cellValue.answerId === col.answerId
      );
      col.answer = this.journeyService.isValueEmpty(cellAnswer?.value)
        ? '-'
        : cellAnswer?.value;
      rowHasAnswer = rowHasAnswer || !!cellAnswer?.value;
      if (cellAnswer?.value) {
        this.updateTotal(col, columnTotals, index);
      }
    });
    if (rowHasAnswer) {
      this.config.rows.push(row);
    }
  }

  private updateTotal(
    col: StepContentElement,
    columnTotals: StepContentElement[],
    index: number
  ) {
    try {
      const answer = parseFloat(col.answer.toString());
      if (!isNaN(answer)) {
        if (columnTotals[index].answer === '-') {
          columnTotals[index].answer = '0';
        }
        columnTotals[index].answer = (
          parseFloat(columnTotals[index].answer) + answer
        ).toString();
      }
    } catch (e) {
      console.log(e);
    }
  }
}
