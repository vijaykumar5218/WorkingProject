import {
  AccountRecovery,
  MoreDescription,
} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {endPoints} from './constants/endpoints';
import {Injectable, OnDestroy} from '@angular/core';
import {from, Observable, ReplaySubject, Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';

@Injectable({
  providedIn: 'root',
})
export class AccountInfoService implements OnDestroy {
  endPoints: Record<string, string> = endPoints;
  private message: Observable<MoreDescription> = null;
  private recoveryInfo: Observable<AccountRecovery> = null;
  private moreContentSubject: ReplaySubject<MoreDescription> = null;
  private recoveryInfoSubject: ReplaySubject<AccountRecovery> = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private utilityService: SharedUtilityService,
    private baseService: BaseService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    this.moreContentSubject = new ReplaySubject(1);
    this.recoveryInfoSubject = new ReplaySubject(1);
  }

  getAccountRecovery(refresh = false): Observable<AccountRecovery> {
    if (!this.recoveryInfo || refresh) {
      this.recoveryInfo = from(
        this.baseService.get(this.endPoints.getAccountRecovery)
      );
      const subscription = this.recoveryInfo.subscribe(result => {
        this.recoveryInfoSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.recoveryInfoSubject;
  }

  getScreenMessage(refresh = false): Observable<MoreDescription> {
    if (!this.message || refresh) {
      this.message = from(this.baseService.get(this.endPoints.getMessage));
      const subscription = this.message.subscribe(result => {
        this.moreContentSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.moreContentSubject;
  }

  saveEmail(email: string, contactId: string): Promise<any> {
    let payload;
    if (contactId) {
      payload = {
        primaryEmail: {
          partyContactId: contactId,
          email: email,
        },
      };
    } else {
      payload = {
        primaryEmail: {
          email: email,
        },
      };
    }

    return this.baseService.post(this.endPoints.saveContact, payload);
  }

  savePhone(phone: string, contactId: string): Promise<any> {
    let payload;
    if (contactId) {
      payload = {
        mobilePhone: {
          partyContactId: contactId,
          phoneNumber: phone,
        },
      };
    } else {
      payload = {
        mobilePhone: {
          phoneNumber: phone,
        },
      };
    }

    return this.baseService.post(this.endPoints.saveContact, payload);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  formatPhoneNumber(phoneNum: string): string {
    let newStr = '';
    if (!phoneNum || phoneNum.length < 1) {
      return newStr;
    }
    newStr = newStr + phoneNum.substring(0, 3) + '-';
    newStr = newStr + phoneNum.substring(3, 6) + '-';
    newStr = newStr + phoneNum.substring(6, 10);
    return newStr;
  }
}
