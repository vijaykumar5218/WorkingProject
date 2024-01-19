import {Injectable, OnDestroy} from '@angular/core';
import {
  MXAccount,
  MXAccountRootObject,
  MXRootMemberObject,
  MXRootObject,
  MXWidgetOptions,
  RootObjectMX,
  RootObjectMXJSON,
  RootObjectNetworth,
} from './models/mx.model';
import {BaseService} from '../base/base-factory-provider';
import {
  BehaviorSubject,
  firstValueFrom,
  from,
  Observable,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import {endPoints} from './constants/endpoints';
import {WidgetType} from './models/widget-type.enum';
import {Platform} from '@ionic/angular';
import {InAppBroserService} from '../../../mobile/src/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {SharedUtilityService} from '../utility/utility.service';
import {map} from 'rxjs/operators';
import {AccessService} from '../access/access.service';
import {AccessResult} from '../access/models/access.model';
import {VoyaGlobalCacheService} from '../../../web/src/app/modules/shared/services/voya-global-cache/voya-global-cache.service';

@Injectable({
  providedIn: 'root',
})
export class MXService implements OnDestroy {
  endpoints;
  private messageHeader: Observable<RootObjectMXJSON> = null;
  private mxBudgetSubject: ReplaySubject<RootObjectMX> = new ReplaySubject(1);

  private mxMemberData: Observable<MXRootMemberObject> = null;
  private mxMemberSubject: ReplaySubject<
    MXRootMemberObject
  > = new ReplaySubject(1);

  private mxAccountData: Observable<MXAccountRootObject> = null;
  private mxAccountSubject: ReplaySubject<
    MXAccountRootObject
  > = new ReplaySubject(1);
  private netWorthData: Observable<RootObjectNetworth> = null;
  private netWorthSubject: ReplaySubject<
    RootObjectNetworth
  > = new ReplaySubject(1);

  private subscription: Subscription = new Subscription();

  private hasMXUserSubject: ReplaySubject<boolean> = new ReplaySubject(1);
  private hasMXUserSubscription;

  private hasMXAccountsSubject: ReplaySubject<boolean> = new ReplaySubject(1);
  private hasMXAccountsSubscription;

  private currentMessageListener = null;

  private hasMxUserByMyvoyageAccessData: Observable<AccessResult> = null;
  private hasMxUserByMyvoyageAccessSubject: ReplaySubject<
    boolean
  > = new ReplaySubject(1);
  private isAltAccessUserData: Observable<AccessResult> = null;
  private isAltAccessUserSubject: ReplaySubject<boolean> = new ReplaySubject(1);

  private mxErrorHiddenSubject = new BehaviorSubject<boolean>(false);

  private displayWidgetBusy = false;
  mxDataLocalStorageSubject: ReplaySubject<MXAccount> = null;
  previousMxDataInLocalStorage: MXAccount;
  private langCode = '';
  private userUpdated: boolean;
  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private platform: Platform,
    private inAppBrowserService: InAppBroserService,
    private accessService: AccessService,
    private voyaCacheService: VoyaGlobalCacheService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    this.mxDataLocalStorageSubject = new ReplaySubject(1);
  }

  setMxErrorHidden(hidden: boolean) {
    this.mxErrorHiddenSubject.next(hidden);
  }

  isMxErrorHidden(): Observable<boolean> {
    return this.mxErrorHiddenSubject.asObservable();
  }

  hasAccounts(): Observable<boolean> {
    if (!this.hasMXAccountsSubscription) {
      this.hasMXAccountsSubscription = this.getMxMemberConnect().subscribe(
        memberData => {
          let hasAccounts = false;
          if (memberData) {
            memberData.members.forEach(member => {
              if (member.connection_status == 'CONNECTED') {
                hasAccounts = true;
              }
            });
          }
          this.hasMXAccountsSubject.next(hasAccounts);
        }
      );
    }
    return this.hasMXAccountsSubject;
  }
  getTotalNetworth(refresh = false): Observable<RootObjectNetworth> {
    if (!this.netWorthData || refresh) {
      this.netWorthData = from(
        this.baseService.get(this.endpoints.totalNetworth)
      );
      const subscription = this.netWorthData.subscribe(result =>
        this.netWorthSubject.next(result)
      );
      this.subscription.add(subscription);
    }
    return this.netWorthSubject;
  }

  hasUser(): Observable<boolean> {
    if (!this.hasMXUserSubscription) {
      this.hasMXUserSubscription = this.getMxMemberConnect().subscribe(
        memberData => {
          let hasUser = false;
          if (memberData) {
            memberData.members.forEach(member => {
              if (member.is_user_created == 'true') {
                hasUser = true;
              }
            });
          }
          this.hasMXUserSubject.next(hasUser);
        }
      );
    }
    return this.hasMXUserSubject;
  }

  getMxMemberConnect(refresh = false): Observable<MXRootMemberObject> {
    if (!this.mxMemberData || refresh) {
      this.mxMemberData = from(
        this.baseService.get(this.endpoints.memberConnect)
      );

      const subscription = this.mxMemberData.subscribe(result => {
        this.mxMemberSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.mxMemberSubject;
  }

  getMxAccountConnect(refresh = false): Observable<MXAccountRootObject> {
    if (!this.mxAccountData || refresh) {
      this.mxAccountData = from(
        this.baseService.get(this.endpoints.accountConnect)
      );

      const subscription = this.mxAccountData.subscribe(result => {
        this.mxAccountSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.mxAccountSubject;
  }

  setMxData(mxaccount: MXAccount): void {
    localStorage.setItem('currentAccountMX', JSON.stringify(mxaccount));
  }

  getMxData(): MXAccount {
    return JSON.parse(localStorage.getItem('currentAccountMX'));
  }

  setMxDataLocalStorage(data: MXAccount) {
    if (data !== this.previousMxDataInLocalStorage) {
      this.setMxData(data);
      this.previousMxDataInLocalStorage = data;
      this.mxDataLocalStorageSubject.next(data);
    }
  }

  getMxDataLocalStorage(): Observable<MXAccount> {
    return this.mxDataLocalStorageSubject.asObservable();
  }

  getHeaderData(refresh = false): Observable<RootObjectMX> {
    if (!this.messageHeader || refresh) {
      this.messageHeader = from(this.baseService.get(this.endpoints.getHeader));
      const subscription = this.messageHeader.subscribe(result => {
        this.mxBudgetSubject.next(JSON.parse(result.MXJSON));
      });
      this.subscription.add(subscription);
    }
    return this.mxBudgetSubject;
  }

  private getMxWidgetUrl(widgetType: WidgetType): Observable<MXRootObject> {
    let plat = 'web';
    if (!this.utilityService.getIsWeb()) {
      if (this.platform.is('ios')) {
        plat = 'ios';
      } else {
        plat = 'android';
      }
    }

    return from(
      this.baseService.get(
        this.endpoints.widgetConnect + widgetType + '/' + plat + this.langCode
      )
    );
  }

  getMxSubAccountWidgetUrl(widgetType: WidgetType): Observable<MXRootObject> {
    return from(
      this.baseService.get(
        this.endpoints.widgetConnect +
          widgetType +
          '/acct/' +
          this.getMxData().guid +
          this.langCode
      )
    );
  }

  awaitIsBusy(): Promise<void> {
    const poll = async resolve => {
      if (!this.displayWidgetBusy) {
        resolve();
      } else {
        setTimeout(() => {
          poll(resolve);
        }, 50);
      }
    };
    return new Promise(poll);
  }

  async displayWidget(
    widgetType: WidgetType,
    options: MXWidgetOptions,
    subAccount = false
  ) {
    if (this.displayWidgetBusy) {
      await this.awaitIsBusy();
    }
    this.displayWidgetBusy = true;
    if (this.utilityService.getIsWeb()) {
      const data = await firstValueFrom(
        this.voyaCacheService.getTranslationPreference()
      );
      this.langCode = data.translationEnabled
        ? '/' + data.langPreference.preference
        : '';
    }
    if (subAccount) {
      const res = await firstValueFrom(
        this.getMxSubAccountWidgetUrl(widgetType)
      );
      this.displayWidgetBusy = false;
      if (!res) {
        return false;
      }
      new window.MoneyDesktopWidgetLoader(options).load(res.url.url);
      return true;
    } else {
      const res = await firstValueFrom(this.getMxWidgetUrl(widgetType));
      this.displayWidgetBusy = false;
      if (!res) {
        return false;
      }
      new window.MoneyDesktopWidgetLoader(options).load(res.url.url);
      return true;
    }
  }

  addMXWindowEventListener(
    func: (MessageEvent) => void = this.gotConnectWidgetMessage.bind(this)
  ) {
    console.log('ADDING MX WINDOW LISTENER');
    this.currentMessageListener = func;
    window.addEventListener('message', this.currentMessageListener);
  }

  removeMXWindowEventListener() {
    console.log('REMOVING MX WINDOW LISTENER');
    window.removeEventListener('message', this.currentMessageListener);
  }

  gotConnectWidgetMessage(message: MessageEvent) {
    console.log('GOT POST MESSAGE: ', message);
    if (
      message.origin !== 'https://int-widgets.moneydesktop.com' &&
      message.origin !== 'https://widgets.moneydesktop.com'
    ) {
      return;
    }
    if (message.data.type == 'mx/connect/oauthRequested') {
      const url = message.data.metadata.url;
      this.openAuthBrowser(url);
    }
    if (this.utilityService.getIsWeb()) {
      const type =  message.data.type || JSON.parse(message?.data)?.type;
      const isCreatedOrDeleted =  type === 'created' || 
      type === 'deleted' || 
      type === 'mx/connect/memberConnected' ||
      type === 'mx/connections/memberDeleted';
      if (
        isCreatedOrDeleted ||
        type === 'mx/focusTrap' ||
        type === 'mx/connect/stepChange'
      ) {
        this.getMxMemberConnect(true);
        this.getMxAccountConnect(true);
      }
      if (isCreatedOrDeleted || type === 'mx/connect/backToSearch') {
        this.setUserAccountUpdate(true);
      }
    }
  }

  setUserAccountUpdate(data: boolean) {
    this.userUpdated = data;
  }
  getUserAccountUpdate(): boolean {
    return this.userUpdated;
  }

  openAuthBrowser(url: string) {
    if (this.utilityService.getIsWeb()) {
      window.open(url, '_blank');
    } else {
      this.inAppBrowserService.openSystemBrowser(url);
    }
  }

  getMXAccountData(guid, refresh = false): Observable<MXAccount> {
    return this.getMxAccountConnect(refresh).pipe(
      map(data => data.accounts.filter(account => account.guid === guid)[0])
    );
  }

  getIsMxUserByMyvoyageAccess(refresh = false): Observable<boolean> {
    if (!this.hasMxUserByMyvoyageAccessData || refresh) {
      this.hasMxUserByMyvoyageAccessData = from(
        this.accessService.checkMyvoyageAccess(refresh)
      );
      const subscription = this.hasMxUserByMyvoyageAccessData.subscribe(
        result => {
          this.hasMxUserByMyvoyageAccessSubject.next(
            result.enableMX && result.isMxUser
          );
        }
      );
      this.subscription.add(subscription);
    }
    return this.hasMxUserByMyvoyageAccessSubject;
  }

  checkIsAltAccessUser(refresh = false): Observable<boolean> {
    if (!this.isAltAccessUserData || refresh) {
      this.isAltAccessUserData = from(
        this.accessService.checkMyvoyageAccess(refresh)
      );
      const subscription = this.isAltAccessUserData.subscribe(result => {
        this.isAltAccessUserSubject.next(result.isAltAccessUser);
      });
      this.subscription.add(subscription);
    }
    return this.isAltAccessUserSubject;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.hasMXAccountsSubscription) {
      this.hasMXAccountsSubscription.unsubscribe();
    }
    if (this.hasMXUserSubscription) {
      this.hasMXUserSubscription.unsubscribe();
    }
  }
}
