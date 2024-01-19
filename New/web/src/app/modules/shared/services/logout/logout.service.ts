import {Injectable} from '@angular/core';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {ModalController} from '@ionic/angular';
import * as settingsOption from '@shared-lib/components/settings/constants/settingsOption.json';
import {BehaviorSubject, Observable} from 'rxjs';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endPoints} from './constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
@Injectable({
  providedIn: 'root',
})
export class WebLogoutService {
  content = settingsOption;
  private terminatedUserSubject: BehaviorSubject<boolean>;
  endPoints = endPoints;
  isGenesysActive: boolean;

  constructor(
    private modalController: ModalController,
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {
    this.terminatedUserSubject = new BehaviorSubject(false);
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  setLogoutURL(url) {
    localStorage.setItem('logout-url', url);
  }

  getLogoutURL(): string {
    return localStorage.getItem('logout-url');
  }

  constructLogoutURL(): string {
    return localStorage.getItem('appId') == 'myVoyage'
      ? this.getMyVoyageLogOutURL()
      : this.getMyVoyaLogout();
  }

  getMyVoyageLogOutURL(): string {
    const linkURL = this.utilityService.getEnvironment().logoutUrl;
    const myVoyageDomain = window.location.href
      .split('myvoyageui')[0]
      .slice(0, -1);
    const ssoDomain = `https://${linkURL.split('/')[2]}`;
    const logoutPage = `${ssoDomain}/voyassoui/public/logout.html%3FappId=myVoyage%26loginURL=${myVoyageDomain}`;
    const logoutURL = `${linkURL}&post_logout_redirect_uri=${logoutPage}`;
    this.setLogoutURL(logoutURL);
    return logoutURL;
  }

  getMyVoyaLogout(): string {
    const url = this.utilityService.getMyVoyaDomain(
      this.endPoints.myVoyaLogout
    );
    this.setLogoutURL(url);
    return url;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage: this.content.signOutQuestion,
        yesButtonTxt: this.content.button,
        noButtonTxt: this.content.close,
        saveFunction: async (): Promise<boolean> => {
          return new Promise(res => {
            res(true);
            this.action();
          });
        },
      },
    });
    return modal.present();
  }

  action() {
    sessionStorage.removeItem('genesysActive');
    if (localStorage.getItem('appId') == 'myVoyage') {
      this.baseService.get(this.endPoints.myVoyaLogout);
    }
    this.baseService.get(
      this.endPoints.genesysLogout + localStorage.getItem('sessionId')
    );
    const url = this.getLogoutURL();
    localStorage.clear();
    sessionStorage.removeItem('iframeloaded');
    sessionStorage.removeItem('LoginEventSent');
    sessionStorage.removeItem('isMyBenefitshub');
    window.open(url, '_self');
  }

  genesysRemoveLocalStorage() {
    this.getLocalStorageKeys().forEach(localStorageKey => {
      if (
        localStorageKey.startsWith('deploymentId') ||
        localStorageKey.startsWith('_act') ||
        localStorageKey.startsWith('_gc')
      ) {
        console.log('Removing ' + localStorageKey);
        localStorage.removeItem(localStorageKey);
      }
    });
  }

  getLocalStorageKeys(_localStorage = localStorage): string[] {
    return Object.keys(_localStorage);
  }

  setGenesysIsActive(genesysActive: boolean) {
    this.isGenesysActive = genesysActive;
    sessionStorage.setItem('genesysActive', genesysActive.toString());
  }

  getGenesysIsActive(): boolean {
    const genesysActive = sessionStorage.getItem('genesysActive');
    return genesysActive && genesysActive !== 'undefined'
      ? JSON.parse(genesysActive)
      : this.isGenesysActive;
  }

  setTerminatedUser(data: boolean) {
    this.terminatedUserSubject.next(data);
  }

  getTerminatedUser(): Observable<boolean> {
    return this.terminatedUserSubject.asObservable();
  }
}
