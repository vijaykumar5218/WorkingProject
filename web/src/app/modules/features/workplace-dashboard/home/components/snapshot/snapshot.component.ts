import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SnapshotAccounts} from '@shared-lib/services/account/models/all-accounts.model';
import {Subscription} from 'rxjs';
import {MVlandingContent} from '../../models/mvlandingcontent.model';
import * as PageText from '../../constants/workplace-dashboard-content.json';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-snapshot',
  templateUrl: './snapshot.component.html',
  styleUrls: ['./snapshot.component.scss'],
})
export class SnapshotComponent implements OnInit, OnDestroy {
  @Input() snapshotAccount: SnapshotAccounts;
  pageText: MVlandingContent = (PageText as any).default;
  snapshotHeader: string;
  private subscription = new Subscription();

  constructor(private contentService: ContentService, private router: Router) {}

  ngOnInit() {
    this.fetchLeftSideContent();
  }

  fetchLeftSideContent() {
    this.subscription.add(
      this.contentService.getLeftSideContent().subscribe(data => {
        this.snapshotHeader = data.workplaceAccountSnapshotHeader;
      })
    );
  }

  goToPlanLink(account?: Account) {
    if (account && account.planId) {
      this.router.navigateByUrl(
        `accounts/account-details/${account.planId}/info`
      );
    } else {
      this.router.navigateByUrl(`/accounts/all-account/summary`);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
