import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import * as pageText from '../budget-widget/constants/spendingbudget.json';
import {RootObjectMX} from '@shared-lib/services/mx-service/models/mx.model';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {BudgetContent} from '../budget-widget/constants/budgetContent.model';
import {MXWidgetComponent} from '@shared-lib/components/mx-widget/mx-widget.component';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-spending-widget',
  templateUrl: './spending-widget.component.html',
  styleUrls: ['./spending-widget.component.scss'],
})
export class SpendingWidgetComponent implements OnInit, OnDestroy {
  readonly widgetType = WidgetType;
  @Input() tagName: string;
  pageText: BudgetContent = JSON.parse(JSON.stringify(pageText)).default;
  loading = true;

  mxBudgetSubscription: Subscription;
  getHeaderMessage: RootObjectMX;
  isWeb: boolean;

  @ViewChild(MXWidgetComponent) widget: MXWidgetComponent;

  constructor(
    private mxService: MXService,
    private utilityService: SharedUtilityService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.fetchScreenContent();
  }

  fetchScreenContent() {
    this.mxBudgetSubscription = this.mxService
      .getHeaderData()
      .subscribe(data => {
        this.getHeaderMessage = data;
      });
  }

  handleClick() {
    if (this.isWeb) {
      this.router.navigate(['/accounts/spending-widget']);
    } else {
      this.router.navigate(['/spending-widget']);
    }
  }

  ngOnDestroy(): void {
    this.mxBudgetSubscription.unsubscribe();
  }
}
