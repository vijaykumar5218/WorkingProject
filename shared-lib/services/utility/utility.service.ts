import {ElementRef, Injectable} from '@angular/core';
import * as text from './utility.json';
import {Observable, ReplaySubject, Subscription} from 'rxjs';
import {StatusBar, Style} from '@capacitor/status-bar';
import {NavigationModel} from './models/utility.models';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {Environment} from '@shared-lib/models/environment.model';
import {Platform} from '@ionic/angular';
import {PlatformService} from '../platform/platform.service';
import {Location} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SharedUtilityService {
  private environment: Environment;
  counter = 0;
  previousUserName = '';
  invalidLoginCounter = 0;
  pageText = JSON.parse(JSON.stringify(text)).default;
  private subscription: Subscription = new Subscription();
  private isWeb: boolean;
  private routerSubject$: ReplaySubject<NavigationModel>;
  queryParam: string;
  private suppressHeaderFooter: ReplaySubject<boolean> = new ReplaySubject(1);
  private _statusBar = StatusBar;

  constructor(
    private router: Router,
    private platform: Platform,
    private platformService: PlatformService,
    private location: Location,
    private sanitizer: DomSanitizer
  ) {}

  backToPrevious() {
    this.location.back();
  }

  setEnvironment(environment: Environment) {
    this.environment = environment;
  }

  getEnvironment(): Environment {
    return this.environment;
  }

  setIsWeb(isWeb: boolean) {
    this.isWeb = isWeb;
  }

  getIsWeb(): boolean {
    return this.isWeb;
  }

  isDesktop() {
    return this.platformService.isDesktop();
  }

  appendBaseUrlToEndpoints(
    endPoints,
    myvoyageBaseUrl: string = this.environment.baseUrl,
    myvoyaBaseUrl: string = this.environment.myvoyaBaseUrl
  ) {
    const appendedEndpoints = {...endPoints};
    for (const endPoint in appendedEndpoints) {
      if (
        this.isMyVoyaUrl(endPoints[endPoint]) ||
        endPoints[endPoint].includes('iframe_login.html')
      ) {
        appendedEndpoints[endPoint] = myvoyaBaseUrl + endPoints[endPoint];
      } else {
        appendedEndpoints[endPoint] = myvoyageBaseUrl + endPoints[endPoint];
      }
    }
    return appendedEndpoints;
  }

  formatStringDate(str: string) {
    const dateString = str;
    const date = new Date(dateString.replace('IST', ''));
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return month + '-' + day + '-' + year;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  formatPhone(val: string | number): string {
    let phone = val?.toString();
    let trimmed = phone?.replace(/\s+/g, '');
    if (trimmed?.length > 12) {
      trimmed = trimmed?.substring(0, 12);
    }
    trimmed = trimmed?.replace(/-/g, '');
    const numbers = [];
    numbers.push(trimmed?.substring(0, 3));
    if (trimmed?.substring(3, 5) !== '') numbers.push(trimmed?.substring(3, 6));
    if (trimmed?.substring(6, 9) != '') numbers.push(trimmed?.substring(6, 10));
    phone = numbers.join('-');
    return phone;
  }

  async setStatusBarStyleLight() {
    await this._statusBar.setBackgroundColor({color: '#ffffff'});
    await this._statusBar.setStyle({style: Style.Light});
  }

  fetchUrlThroughNavigation(paramSegment): Observable<NavigationModel | null> {
    if (!this.routerSubject$) {
      this.routerSubject$ = new ReplaySubject(1);
      const routerSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(event => {
          const arrOfUrl = event['url'].split('/');
          if (
            typeof arrOfUrl[paramSegment] !== 'undefined' &&
            this.getIsWeb()
          ) {
            this.setQueryParam(event['url'].split('?')[1]);
            this.routerSubject$.next({
              paramId: arrOfUrl[paramSegment],
              url: event['url'],
            });
          } else {
            this.routerSubject$.next(null);
          }
        });
      this.subscription.add(routerSubscription);
    }
    return this.routerSubject$;
  }

  setQueryParam(queryParam: string): void {
    this.queryParam = queryParam;
  }

  getQueryParam(): string {
    return this.queryParam;
  }

  scrollToTop(topmostElement: ElementRef) {
    topmostElement?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    });
  }

  setSuppressHeaderFooter(data: boolean) {
    this.suppressHeaderFooter.next(data);
  }

  getSuppressHeaderFooter(): Observable<boolean> {
    return this.suppressHeaderFooter;
  }

  replaceCurrentYear(str: string): string {
    return str.replace('${currentYear}', new Date().getFullYear().toString());
  }

  isMyVoyaUrl(url: string): boolean {
    return url.includes('myvoya') && !url.includes('myvoyage');
  }

  getPlatformResume(): Observable<void> {
    return this.platform.resume;
  }

  getmyvoyaBaseUrl() {
    return this.environment.myvoyaBaseUrl;
  }

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  getMyVoyaDomain(url?: string): string {
    if (url) {
      return url.replace(
        this.environment.myvoyaBaseUrl,
        this.environment.myVoyaDomain
      );
    } else {
      return this.environment.myVoyaDomain;
    }
  }

  bypassSecurityTrustResourceUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getQueryParams(url: string): Record<string, string> {
    const urlParamArr: string[] = url.includes('?') ? url.split('?') : [];
    const queryParamsMap: Record<string, string> = {};
    if (urlParamArr.length > 1) {
      urlParamArr.shift();
      const urlParam: string = urlParamArr ? urlParamArr.join('?') : '';
      if (urlParam.includes('&')) {
        urlParam.split('&').forEach(item => {
          if (item.includes('=')) {
            const [first, ...itemArr] = item.split('=');
            queryParamsMap[first] = itemArr.join('=');
          }
        });
      } else if (urlParam.includes('=')) {
        const [first, ...urlArr] = urlParam.split('=');
        queryParamsMap[first] = urlArr.join('=');
      }
    }
    return queryParamsMap;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
