import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as ExpandableAccountsContent from './components/expandable-account-list/constants/expandable-account-type.json';
import {AccountService} from '@shared-lib/services/account/account.service';
import {BalanceHistoryGraph} from '@shared-lib/services/account/models/balance-history-graph.model';
import {Subscription} from 'rxjs';
import * as PageText from './components/accounts-widgets/constants/account-widget-content.json';
import {Content} from './components/accounts-widgets/models/widget-types.model';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  @Input() templateType: string;
  @Input() isMXUser: boolean;
  @Input() isCoverageAccessible: boolean;
  @Input() widgetId: string;
  pageText: Content = (PageText as any).default;
  subscription = new Subscription();
  balanceHistoryGraphData: BalanceHistoryGraph;
  expandableAccountsContent = ExpandableAccountsContent;
  isHealthOnly = false;
  enableMX: boolean;

  constructor(
    private accountService: AccountService,
    private accessService: AccessService
  ) {}

  ngOnInit(): void {
    this.accessService.checkMyvoyageAccess().then(access => {
      this.isHealthOnly = access.isHealthOnly;
      this.enableMX = access.enableMX;
    });
    this.subscription.add(
      this.accountService.fetchBalanceHistoryGraph().subscribe(data => {
        if (data) {
          this.balanceHistoryGraphData = data;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
