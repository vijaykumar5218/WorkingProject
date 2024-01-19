import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Subscription} from 'rxjs';
import {MXService} from '@shared-lib/services/mx-service/mx.service';

@Component({
  selector: 'hero-card-section',
  templateUrl: './hero-card-section.component.html',
  styleUrls: ['./hero-card-section.component.scss'],
})
export class HeroCardSectionComponent implements OnInit, OnDestroy {
  showAddAccount = false;
  subscription: Subscription = new Subscription();
  isCarouselRequired = true;
  isMXUser: boolean;
  constructor(
    private accountService: AccountService,
    private mxService: MXService
  ) {}

  ngOnInit() {
    this.fetchAggregatedAccounts();
    this.fetchMXUSer();
  }

  fetchAggregatedAccounts() {
    this.subscription.add(
      this.accountService.getAggregatedAccounts().subscribe(data => {
        this.showAddAccount = !data.hasMXAccount;
      })
    );
  }

  fetchMXUSer() {
    this.subscription.add(
      this.mxService.getIsMxUserByMyvoyageAccess().subscribe(data => {
        this.isMXUser = data;
      })
    );
  }
  displayCarousel(carouselRequired: boolean) {
    this.isCarouselRequired = carouselRequired;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
