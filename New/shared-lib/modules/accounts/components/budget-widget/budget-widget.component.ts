import {Component, Input, ViewChild} from '@angular/core';
import * as pageText from './constants/spendingbudget.json';
import {BudgetContent} from './constants/budgetContent.model';
import {MXWidgetComponent} from '@shared-lib/components/mx-widget/mx-widget.component';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-budget-widget',
  templateUrl: './budget-widget.component.html',
  styleUrls: ['./budget-widget.component.scss'],
})
export class BudgetWidgetComponent {
  readonly widgetType = WidgetType;
  @Input() tagName: string;
  pageText: BudgetContent = JSON.parse(JSON.stringify(pageText)).default;
  @ViewChild(MXWidgetComponent) widget: MXWidgetComponent;

  constructor(
    private utilityService: SharedUtilityService,
    private router: Router
  ) {}

  handleClick() {
    if (this.utilityService.getIsWeb()) {
      this.router.navigate(['/accounts/budget-widget']);
    } else {
      this.router.navigate(['/budget-widget']);
    }
  }
}
