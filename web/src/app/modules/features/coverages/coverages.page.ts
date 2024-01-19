import {Component, ElementRef, ViewChild} from '@angular/core';
import pageText from './constants/coverages.json';
import {CoveragePageText} from './model/coverages.model';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter, startWith} from 'rxjs/operators';
import {from, Subscription} from 'rxjs';
import {AccessService} from '@shared-lib/services/access/access.service';
@Component({
  selector: 'app-coverages',
  templateUrl: 'coverages.page.html',
  styleUrls: ['coverages.page.scss'],
})
export class CoveragesPage {
  pageData: CoveragePageText = pageText;
  subscription: Subscription = new Subscription();
  isAllPlansSelected: boolean;
  isReviewPage: boolean;
  myWorkplaceDashboardEnabled: boolean;
  @ViewChild('focusedElementCoverages', {static: true})
  focusedElement: ElementRef;

  constructor(
    private footerType: FooterTypeService,
    private router: Router,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.subscription.add(
      from(this.accessService.checkWorkplaceAccess()).subscribe(res => {
        this.myWorkplaceDashboardEnabled = res.myWorkplaceDashboardEnabled;
      })
    );
    this.routerNavigation();
  }

  clickAllPlans(): void {
    this.focusOnElement();
    this.router.navigateByUrl(`/coverages/all-coverages/insights`);
  }

  focusOnElement(): void {
    const element = this.focusedElement.nativeElement as HTMLElement;
    element.focus();
  }

  routerNavigation() {
    const routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(this.router)
      )
      .subscribe(event => {
        this.handelEventUrl(event['url']);
      });
    this.subscription.add(routerSubscription);
  }

  handelEventUrl(url: string) {
    const arrOfUrl = url.split('/');
    if (arrOfUrl[1] === 'coverages' && arrOfUrl[2] !== 'view-plans') {
      this.isAllPlansSelected = true;
      if (arrOfUrl[2] === 'review') {
        this.isReviewPage = true;
      } else {
        this.isReviewPage = false;
      }
    } else {
      this.isAllPlansSelected = false;
      this.focusOnElement();
    }
  }

  ngAfterViewInit() {
    this.footerType.publish({
      type: FooterType.tabsnav,
      selectedTab: 'coverages',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
