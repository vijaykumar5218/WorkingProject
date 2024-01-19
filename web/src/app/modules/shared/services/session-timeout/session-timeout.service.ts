import {Injectable} from '@angular/core';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';
import {WebLogoutService} from '../logout/logout.service';
import {endPoints} from './constants/endpoints';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {SessionTimeoutPopupComponent} from '../../components/session-timeout-popup/session-timeout-popup.component';

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  pingChanged: Subject<boolean>;
  endPoints = endPoints;
  warningTimer: NodeJS.Timeout;
  warningTimerAmount = 780000;
  isOpenWarningModal = false;
  isSecurePage = true;
  sessionExpiringTimer: NodeJS.Timeout;
  sessionExpiringCounterSubject: ReplaySubject<string>;
  subscription = new Subscription();
  isOnLoad = true;
  expiringCountDownAmount = 1000;

  constructor(
    private utilityService: SharedUtilityService,
    private baseService: BaseService,
    private logoutService: WebLogoutService,
    private modalController: ModalController,
    private router: Router
  ) {
    this.pingChanged = new Subject<boolean>();
    this.sessionExpiringCounterSubject = new ReplaySubject(1);
  }

  watcherInitiated() {
    this.setEventListener();
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    this.subscription.add(
      this.pingChanged.pipe(throttleTime(50000)).subscribe(() => {
        this.pingServer();
      })
    );
    this.setWarningCountDown();
    this.subscription.add(
      this.logoutService.getTerminatedUser().subscribe(data => {
        if (data) {
          this.isSecurePage = false;
          this.killWarningCountDown();
          this.killSessionExpiringCountDown();
        }
      })
    );
    this.pingServerOnPageLoad();
  }

  setWarningCountDown() {
    this.warningTimer = setTimeout(() => {
      this.openWarningModal();
    }, this.warningTimerAmount);
  }

  killWarningCountDown() {
    clearTimeout(this.warningTimer);
  }

  setSessionExpiringCountDown() {
    let counter = 120;
    this.sessionExpiringTimer = setInterval(() => {
      if (counter === 0) {
        document.body.style.pointerEvents = 'auto';
        this.router.navigateByUrl('/session-timeout');
      } else {
        const sessionExpiringCounter = `${this.timeTransform(counter)}`;
        this.setSessionExpiringCounter(sessionExpiringCounter);
      }
      counter--;
    }, this.expiringCountDownAmount);
  }

  killSessionExpiringCountDown() {
    clearInterval(this.sessionExpiringTimer);
  }

  timeTransform(value: number): string {
    const minutes: number = Math.floor((value % 3600) / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }

  async openWarningModal(): Promise<void> {
    this.isOpenWarningModal = true;
    document.body.style.pointerEvents = 'none';
    this.setSessionExpiringCounter('2:00');
    this.setSessionExpiringCountDown();
    const modal = await this.modalController.create({
      component: SessionTimeoutPopupComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        saveFunction: async (): Promise<boolean> => {
          return Promise.resolve(true);
        },
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(data => {
      if (data.data.saved) {
        this.pingServer();
      } else {
        this.logoutService.action();
      }
      this.isOpenWarningModal = false;
      document.body.style.pointerEvents = 'auto';
    });
    return modal.present();
  }

  async pingServer() {
    if (this.isSecurePage) {
      const response = await this.baseService.get(
        this.endPoints.check_session + '?' + Date.now()
      );
      this.killWarningCountDown();
      this.killSessionExpiringCountDown();
      if (response.status === 'OK') {
        this.setWarningCountDown();
      } else {
        this.router.navigateByUrl('/session-timeout');
      }
    }
  }

  setEventListener() {
    document.body.addEventListener('click', this.handleEvent.bind(this));
    document.body.addEventListener('touchmove', this.handleEvent.bind(this));
  }

  handleEvent(e) {
    if (
      e.target.getAttribute('type') &&
      e.target.getAttribute('type') === 'submit'
    ) {
      return true;
    }
    if (!this.isOpenWarningModal) {
      this.pingChanged.next(true);
    }
  }

  pingServerOnPageLoad() {
    if (this.isOnLoad) {
      this.pingServer();
    }
    this.isOnLoad = false;
  }

  setSessionExpiringCounter(data: string) {
    this.sessionExpiringCounterSubject.next(data);
  }

  getSessionExpiringCounter(): Observable<string> {
    return this.sessionExpiringCounterSubject.asObservable();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
