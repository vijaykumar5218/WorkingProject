import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  _currentPlatform: any;
  _deviceWidth: number;
  private isDesktopSubject: ReplaySubject<boolean>;

  constructor(private platform: Platform, private router: Router) {
    this.setCurrentPlatform();
    this.isDesktopSubject = new ReplaySubject(1);
    this.platformWidth();
    this.platform.resize.subscribe(() => {
      this.platformWidth();
    });
  }

  platformWidth() {
    this._deviceWidth = this.platform.width();
    if (this._deviceWidth <= 920) {
      this.isDesktopSubject.next(false);
    } else {
      this.isDesktopSubject.next(true);
    }
  }

  isDesktop(): Observable<boolean> {
    return this.isDesktopSubject.asObservable();
  }

  get currentPlatform(): string {
    return this._currentPlatform;
  }

  isNative(): boolean {
    return this._currentPlatform === 'native';
  }

  isBrowser(): boolean {
    return this._currentPlatform === 'browser';
  }

  navigateByUrl(path: string) {
    this.router.navigateByUrl(path);
  }

  setCurrentPlatform(): void {
    if (
      (this.platform.is('ios') || this.platform.is('android')) &&
      !(this.platform.is('desktop') || this.platform.is('mobileweb'))
    ) {
      this._currentPlatform = 'native';
    } else {
      this._currentPlatform = 'browser';
    }
  }
}
