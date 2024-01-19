import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {TPAStreamService} from '../../../services/tpa-stream/tpastream.service';
import {
  TPAClaimsData,
  TPAWarning,
  TPAWarningType,
} from '../../../services/tpa-stream/models/tpa.model';
import {NameCategory} from '../models/chart.model';
import {Subscription} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ViewWillEnter} from '@ionic/angular';
import {delay, filter} from 'rxjs/operators';

@Component({
  selector: 'app-tpaclaims',
  templateUrl: './tpaclaims.component.html',
  styleUrls: ['./tpaclaims.component.scss'],
})
export class TPAClaimsComponent implements OnInit, OnDestroy, ViewWillEnter {
  isWeb = false;
  loading = true;
  tpaData: TPAClaimsData;
  notConnected = true;
  claims: NameCategory[];
  warnings: TPAWarning[] = [];
  subscription: Subscription;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;

  constructor(
    private tpaStreamService: TPAStreamService,
    private router: Router,
    private utilityService: SharedUtilityService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  async ngOnInit() {
    this.subscription = this.tpaStreamService
      .getTPAData()
      .subscribe((tpaData: TPAClaimsData) => {
        this.tpaData = tpaData;
        this.checkForErrors();
        setTimeout(() => {
          this.loading = false;
        }, 250);
      });
    this.subscription.add(
      this.tpaStreamService.tpaDataReload$.subscribe(() => {
        this.loading = true;
      })
    );
  }

  ionViewWillEnter(): void {
    this.scrollToTop();
  }

  scrollToTop() {
    if (this.isWeb) {
      const routerSubscription = this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          delay(100)
        )
        .subscribe(() => {
          this.utilityService.scrollToTop(this.topmostElement);
        });
      this.subscription.add(routerSubscription);
    }
  }

  checkForErrors() {
    this.warnings = [];
    this.tpaData.carriers.forEach(car => {
      if (car.crawlCount < 1) {
        this.warnings.push({
          carrier: car.carrierName,
          warningType: TPAWarningType.IN_PROCCESS,
        });
      } else if (car.loginProblem != 'valid') {
        this.warnings.push({
          carrier: car.carrierName,
          errorMessage: car.loginMessage,
          warningType: TPAWarningType.CONNECTION_ERROR,
        });
      }
    });
  }

  manageProviders() {
    if (this.isWeb) {
      this.router.navigateByUrl('coverages/all-coverages/tpaclaims/providers');
    } else {
      this.router.navigateByUrl('coverages/coverage-tabs/tpaproviders');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
