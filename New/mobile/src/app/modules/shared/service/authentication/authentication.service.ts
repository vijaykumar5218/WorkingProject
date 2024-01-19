import {Injectable, NgZone, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {IonicAuth} from '@ionic-enterprise/auth';
import {Device, SupportedBiometricType} from '@ionic-enterprise/identity-vault';
import {AlertController, Platform} from '@ionic/angular';
import {
  DEFAULT_FACEID_DISABLED,
  VaultService,
  VAULT_CONFIG_KEY,
} from './vault.service';
import {auth0NativeConfig, authTimeouts} from './contants/authConstants';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Discovery} from './models/discovery';
import {HTTP} from '@ionic-native/http/ngx';
import * as text from './contants/accountText.json';
import {PlatformService} from '../platform/platform.service';
import {endPoints} from './contants/endpoint';
import {AuthenticationChange} from './models/authenticationChange.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends IonicAuth implements OnDestroy {
  authText: Record<string, string> = text;
  reloading = false;
  endpoints = endPoints;

  public authenticationChange$: Observable<AuthenticationChange>;
  private authenticationChange: BehaviorSubject<
    AuthenticationChange
  > = new BehaviorSubject({auth: false, attested: false});

  biometricsAuthenticationChange$: BehaviorSubject<
    boolean
  > = new BehaviorSubject(false);

  peristedLocalStorageItems: string[];

  private platformSubscription = new Subscription();
  private usePlatformListeners = false;
  private pausedTime = Number.MAX_VALUE;
  private launchUrl;

  constructor(
    private router: Router,
    private vaultService: VaultService,
    private platform: Platform,
    private ngZone: NgZone,
    private http: HTTP,
    private platformService: PlatformService,
    private alertController: AlertController
  ) {
    super({...auth0NativeConfig, tokenStorageProvider: vaultService.vault});

    this.authenticationChange$ = this.authenticationChange.asObservable();

    this.registerPlatformListeners();

    this.peristedLocalStorageItems = [
      VAULT_CONFIG_KEY,
      DEFAULT_FACEID_DISABLED,
    ];

    if (this.platform.is('capacitor')) {
      Device.setHideScreenOnBackground(true);
    }
  }

  navigateToLoggedInLanding() {
    this.router.navigateByUrl(this.launchUrl ? this.launchUrl : 'home');
    this.launchUrl = null;
  }

  async didLaunchWithURL(url: string) {
    this.launchUrl = url;
  }

  async getBiometricsIconName(): Promise<string> {
    const supported = await Device.getAvailableHardware();
    if (supported.includes(SupportedBiometricType.Fingerprint)) {
      if (this.platform.is('ios')) {
        return 'assets/icon/touch_ios.svg';
      } else {
        return 'assets/icon/touch_android.svg';
      }
    } else if (
      supported.includes(SupportedBiometricType.Face) ||
      supported.includes(SupportedBiometricType.Iris)
    ) {
      if (this.platform.is('ios')) {
        return 'assets/icon/faceid_ios.svg';
      } else {
        return 'assets/icon/faceid_android.svg';
      }
    }

    return 'assets/icon/touch_android.svg';
  }

  async getBiometricsLabel(): Promise<string> {
    const supported = await Device.getAvailableHardware();
    if (supported.includes(SupportedBiometricType.Fingerprint)) {
      if (this.platform.is('ios')) {
        return this.authText.touchIdIos;
      } else {
        return this.authText.touchIdAndroid;
      }
    } else if (
      supported.includes(SupportedBiometricType.Face) ||
      supported.includes(SupportedBiometricType.Iris)
    ) {
      if (this.platform.is('ios')) {
        return this.authText.faceIdIos;
      } else {
        return this.authText.faceIdAndroid;
      }
    }
    return this.authText.biometrics;
  }

  registerPlatformListeners() {
    this.platformService.setInitialResume(async () => {
      if (!this.usePlatformListeners) {
        return;
      }

      const currTime = new Date().getTime();
      if (!this.vaultService.isFaceIDEnabled()) {
        //Non Faceid Timeout
        if (currTime - this.pausedTime > authTimeouts.nonFaceIDTimeout) {
          await this.logout(true);
          return false;
        }
      } else {
        //Faceid timeout to fix issues
        if (currTime - this.pausedTime > authTimeouts.faceIDRefreshTimout) {
          await this.router.navigateByUrl('landing');
          this.reloadWindow();
          return false;
        }

        await this.vaultService.unlockVault();
        await this.isAuthenticated();
      }

      if (this.launchUrl) {
        this.router.navigateByUrl(this.launchUrl);
        this.launchUrl = null;
      }

      return true;
    });
    this.platformSubscription.add(
      this.platformService.onPause$.subscribe(() => {
        //Use this because of bug when trying to re-register platform listeners
        if (!this.usePlatformListeners) {
          return;
        }

        this.pausedTime = new Date().getTime();
      })
    );
  }

  async attemptFaceIDLogin() {
    try {
      const hasFaceIDSession = await this.hasFaceIDSession();
      if (hasFaceIDSession) {
        const isAuth = await this.isAuthenticated();
        if (isAuth) {
          this.biometricsAuthenticationChange$.next(true);
          this.navigateToLoggedInLanding();
          this.usePlatformListeners = true;
        }
      }
    } catch (ex) {
      //If got biometric not available error, clear biometric session
      if (ex.code == 13) {
        this.clearStorage();
        this.vaultService.disableFaceID();
      }
    }
  }

  async openRegister() {
    this.additionalLoginParameters({register: 'allow'});
    await this.login();
  }

  async openLogin() {
    this.additionalLoginParameters({});
    await this.login();
  }

  async shouldShowBiometricsScreen() {
    const faceIDAvail = await this.vaultService.isFaceIDAvailableOnDevice();
    if (faceIDAvail) {
      return !this.vaultService.defaultFaceIDDisabled();
    }
    return false;
  }

  async showLoginFailureAlert() {
    //Got issue logging in
    const alert = await this.alertController.create({
      message: this.authText.loginError,
      buttons: [this.authText.ok],
    });
    alert.present();
  }

  async login() {
    //Clear vault of any old sessions
    try {
      await this.clearStorage();

      //Change vault type to no face id and clear entire vault because we are loggin in with new account
      await this.vaultService.clearVault();
      await this.vaultService.disableFaceID();

      await super.login();
    } catch (ex) {
      if (ex == 'Error: browser was closed') {
        return;
      } else if (ex.code == 5) {
        //If there was an issue clearing a prev faceid session, retry login
        this.vaultService.disableFaceID();
        setTimeout(() => {
          super.login();
        }, 50);
      } else {
        this.showLoginFailureAlert();
      }
    }
  }

  async onAuthChange(isAuthenticated: AuthenticationChange): Promise<void> {
    this.ngZone.run(() => {
      this.authenticationChange.next(isAuthenticated);
    });
  }

  async onLoginSuccess() {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      this.showLoginFailureAlert();
      this.clearStorage();
      this.router.navigateByUrl('landing');
    } else {
      this.onAuthChange({auth: true, attested: false});
      this.usePlatformListeners = true;
    }
  }

  async hasNonFaceIDSession(): Promise<boolean> {
    if (!this.vaultService.isFaceIDEnabled()) {
      return this.vaultService.hasStoredSession();
    }
    return false;
  }

  async hasFaceIDSession(): Promise<boolean> {
    if (this.vaultService.isFaceIDEnabled()) {
      return this.vaultService.hasStoredSession();
    }
    return false;
  }

  async getDiscoveryURLS(): Promise<Discovery> {
    const result = await this.http.get(auth0NativeConfig.discoveryUrl, {}, {});

    if (result.data) {
      return JSON.parse(result.data);
    }

    return null;
  }

  async logoutAndRevoke(): Promise<boolean> {
    const discovery = await this.getDiscoveryURLS();
    if (!discovery) {
      this.clearStorage();
      return false;
    }

    const token = await this.getAccessToken();
    const refToken = await this.getRefreshToken();

    const httpHeader = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    this.http.setDataSerializer('utf8');

    //Revoke access token
    const acccessBody =
      'client_id=' +
      auth0NativeConfig.clientID +
      '&token=' +
      token +
      '&token_type_hint=access_token';
    const accessResp = await this.http.post(
      discovery.revocation_endpoint,
      acccessBody,
      httpHeader
    );

    //Revoke refresh token
    const refreshBody =
      'client_id=' +
      auth0NativeConfig.clientID +
      '&token=' +
      refToken +
      '&token_type_hint=refresh_token';
    const refreshResp = await this.http.post(
      discovery.revocation_endpoint,
      refreshBody,
      httpHeader
    );

    this.http.setDataSerializer('json');

    if (accessResp.status == 200 && refreshResp.status == 200) {
      return true;
    }
    return false;
  }

  async logout(timeout = false): Promise<void> {
    this.reloading = true;

    this.onAuthChange({auth: false, attested: false});

    if (timeout) {
      await this.router.navigateByUrl('logout');
      this.clearUserSessionLocalStorage();
      this.reloadWindow();
      return;
    }

    this.usePlatformListeners = false;

    await this.router.navigateByUrl('secure-sign-out');

    if (this.vaultService.isFaceIDEnabled()) {
      await this.vaultService.lockVault();
    } else {
      await this.logoutAndRevoke();
      await this.clearStorage();
    }

    await this.router.navigate(['landing'], {
      queryParams: {
        noAutoLogin: true,
      },
    });

    this.clearUserSessionLocalStorage();
    this.reloadWindow();
  }

  clearUserSessionLocalStorage() {
    const keepers = {};
    this.peristedLocalStorageItems.forEach(keep => {
      keepers[keep] = localStorage.getItem(keep);
    });

    localStorage.clear();

    for (const key in keepers) {
      localStorage.setItem(key, keepers[key]);
    }
  }

  async clearStorage(): Promise<void> {
    try {
      this.http.get(this.endpoints.myvoyaLogout, {}, {});
      this.http.clearCookies();
    } catch (ex) {
      console.log('Error clearing old myvoya session');
    }
    super.clearStorage();
  }

  reloadWindow() {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.platformSubscription.unsubscribe();
  }
}
