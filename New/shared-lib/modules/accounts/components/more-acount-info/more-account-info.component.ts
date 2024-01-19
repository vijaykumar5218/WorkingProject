import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import * as pageText from '@shared-lib/services/account/constants/more-account-info.json';
import {AccountService} from '@shared-lib/services/account/account.service';
import {ExternalLink} from '@shared-lib/services/account/models/accountres.model';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-more-account-info',
  templateUrl: './more-account-info.component.html',
  styleUrls: ['./more-account-info.component.scss'],
})
export class MoreAccountInfoComponent implements OnInit, OnDestroy {
  pageText: Record<string, string> = pageText;
  externalLinks: ExternalLink[];
  showSection = false;

  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private accessService: AccessService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.subscription = this.accountService
      .getExternalLinks()
      .subscribe(data => {
        this.setExternalLinks(data);
      });
  }

  setExternalLinks(links: ExternalLink[]) {
    this.externalLinks = links.filter(link => {
      return link.id !== 'MY_PROFILE';
    });
  }

  async itemClicked(item: ExternalLink) {
    const {
      myWorkplaceDashboardEnabled,
    } = await this.accessService.checkWorkplaceAccess();
    if (myWorkplaceDashboardEnabled) {
      this.accountService.openPwebAccountLink(
        decodeURIComponent(item.link),
        '_self'
      );
    } else {
      this.accountService.openPwebAccountLink(decodeURIComponent(item.link));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
